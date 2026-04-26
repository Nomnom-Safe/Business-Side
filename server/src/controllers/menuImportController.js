'use strict';

const pdfParseModule = require('pdf-parse');
const mammoth = require('mammoth');
const { parseMenuText } = require('../services/menuParseService');
const { processItems, buildSummary, LIMITS } = require('../utils/importNormalize');
const { fetchPageText } = require('../utils/urlImportFetch');
const { categoryStringToItemType } = require('../utils/categoryToItemType');
const { getResponse, setResponse } = require('../utils/importIdempotency');
const menuItemService = require('../services/menuItemService');
const { inferMimeFromFilename } = require('../utils/inferMimeFromFilename');
const { snapshot: telemetrySnapshot } = require('../utils/importTelemetry');

const SUPPORTED_MIME_TYPES = {
  'application/pdf': 'pdf',
  'text/csv': 'csv',
  'application/vnd.ms-excel': 'csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
function extensionToMime(name) {
  const n = String(name || '').toLowerCase();
  if (n.endsWith('.pdf')) return 'application/pdf';
  if (n.endsWith('.csv')) return 'text/csv';
  if (n.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return null;
}

function assessParseQuality(rows, summary) {
  const validRows = rows.filter((r) => r.status === 'valid');
  if (validRows.length === 0) {
    return {
      level: 'none',
      warning: 'No valid menu items were parsed from this source.',
    };
  }
  let sparseFields = 0;
  for (const row of validRows) {
    const item = row.item || {};
    const missingCount = [
      !item.description || !String(item.description).trim(),
      !item.ingredients || item.ingredients.length === 0,
      item.price == null,
      !item.category || String(item.category).trim().toLowerCase() === 'uncategorized',
    ].filter(Boolean).length;
    if (missingCount >= 3) sparseFields += 1;
  }
  const sparseRatio = validRows.length > 0 ? sparseFields / validRows.length : 0;
  if (summary.invalidRows > 0 || sparseRatio >= 0.4) {
    return {
      level: 'low',
      warning: 'Low-confidence parse: many rows are incomplete. Review fields carefully before saving.',
    };
  }
  return { level: 'ok', warning: null };
}
const pdfParseFn = typeof pdfParseModule === 'function'
  ? pdfParseModule
  : pdfParseModule && typeof pdfParseModule.default === 'function'
    ? pdfParseModule.default
    : null;
const PDFParseClass = pdfParseModule && typeof pdfParseModule.PDFParse === 'function'
  ? pdfParseModule.PDFParse
  : null;

async function parsePdfText(buffer) {
  if (pdfParseFn) {
    const pdf = await pdfParseFn(buffer);
    return pdf && typeof pdf.text === 'string' ? pdf.text : '';
  }

  if (PDFParseClass) {
    const parser = new PDFParseClass({ data: buffer });
    try {
      const out = await parser.getText();
      return out && typeof out.text === 'string' ? out.text : '';
    } finally {
      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
    }
  }

  throw new Error('PDF parser dependency is not available.');
}

async function extractText(buffer, mimeType) {
  const fileType = SUPPORTED_MIME_TYPES[mimeType];
  switch (fileType) {
    case 'pdf': {
      let pdf;
      try {
        pdf = await parsePdfText(buffer);
      } catch (e) {
        const err = new Error(
          e.message || 'Could not read this PDF (it may be encrypted or corrupted).',
        );
        err.code = 'PDF_PARSE_ERROR';
        throw err;
      }
      return pdf || '';
    }
    case 'docx': {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    case 'csv':
      return buffer.toString('utf-8');
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

function errorResponse(res, statusCode, code, error, fallback, correlationId) {
  res.set('X-Correlation-Id', correlationId);
  return res.status(statusCode).json({ success: false, code, error, fallback, correlationId });
}

/**
 * Shared LLM parse + normalize pipeline. Returns { ok: true, data } or { ok: false, error }.
 * `error` shape: { status, code, error, fallback }
 */
async function runParsePipeline(extractedText, correlationId) {
  if (!extractedText || extractedText.trim().length === 0) {
    return {
      ok: false,
      error: {
        status: 422,
        code: 'IMPORT_EMPTY_EXTRACTED_TEXT',
        error: 'No text could be extracted to parse.',
        fallback: 'Try a different source, or add items manually.',
        correlationId,
      },
    };
  }

  const truncatedText = extractedText.length > LIMITS.MAX_TEXT_LENGTH
    ? extractedText.slice(0, LIMITS.MAX_TEXT_LENGTH)
    : extractedText;

  let rawItems;
  try {
    rawItems = await parseMenuText(truncatedText, { correlationId });
  } catch (err) {
    const isTimeout = err.message && err.message.toLowerCase().includes('timeout');
    return {
      ok: false,
      error: {
        status: 502,
        code: isTimeout ? 'IMPORT_PARSE_TIMEOUT' : 'IMPORT_PARSE_PROVIDER_ERROR',
        error: "We couldn't parse this menu automatically.",
        fallback: 'Try again, or add items manually.',
        correlationId,
      },
    };
  }

  if (!Array.isArray(rawItems)) {
    return {
      ok: false,
      error: {
        status: 502,
        code: 'IMPORT_INVALID_RESPONSE_FORMAT',
        error: 'The parser returned an unexpected response.',
        fallback: 'Try again, or add items manually.',
        correlationId,
      },
    };
  }

  if (rawItems.length > LIMITS.MAX_ITEMS) {
    return {
      ok: false,
      error: {
        status: 422,
        code: 'IMPORT_ITEM_LIMIT_EXCEEDED',
        error: `This menu has too many items (max ${LIMITS.MAX_ITEMS}).`,
        fallback: 'Try a smaller file or page section, or add items manually.',
        correlationId,
      },
    };
  }

  const rows = processItems(rawItems);
  const summary = buildSummary(rows);
  const partial = summary.invalidRows > 0 || summary.duplicateRows > 0;
  const quality = assessParseQuality(rows, summary);

  if (quality.level === 'none') {
    return {
      ok: false,
      error: {
        status: 422,
        code: 'IMPORT_ZERO_ITEMS_PARSED',
        error: 'No valid menu items were parsed from this source.',
        fallback: 'Try a cleaner section, upload CSV/DOCX, or add items manually.',
        correlationId,
      },
    };
  }

  console.info(JSON.stringify({
    event: 'import.pipeline.complete',
    correlationId,
    summary,
    quality,
    telemetry: telemetrySnapshot(),
  }));

  return {
    ok: true,
    data: {
      success: true, partial, correlationId, summary, items: rows, quality,
    },
  };
}

function sendErrorFromPipeline(res, errPayload) {
  return errorResponse(
    res,
    errPayload.status,
    errPayload.code,
    errPayload.error,
    errPayload.fallback,
    errPayload.correlationId,
  );
}

async function importFromFile(req, res) {
  const correlationId = req.correlationId;

  if (!req.file) {
    return errorResponse(res, 400, 'IMPORT_NO_FILE', 'No file uploaded.',
      'Please select a PDF, CSV, or DOCX file and try again.', correlationId);
  }

  let effectiveMime = req.file.mimetype;
  const extMime = extensionToMime(req.file.originalname);
  if (extMime && req.file.mimetype && req.file.mimetype !== 'application/octet-stream' && extMime !== req.file.mimetype) {
    return errorResponse(
      res,
      400,
      'IMPORT_MIME_EXTENSION_MISMATCH',
      `File extension does not match MIME type (${req.file.mimetype}).`,
      'Re-export the file and upload again.',
      correlationId,
    );
  }
  if (!SUPPORTED_MIME_TYPES[effectiveMime]) {
    const inferred = inferMimeFromFilename(req.file.originalname);
    if (inferred && SUPPORTED_MIME_TYPES[inferred]) {
      effectiveMime = inferred;
    }
  }

  if (!SUPPORTED_MIME_TYPES[effectiveMime]) {
    return errorResponse(res, 400, 'IMPORT_UNSUPPORTED_FILE_TYPE',
      `Unsupported file type: ${req.file.mimetype}.`,
      'Upload a PDF, DOCX, or CSV file, or add items manually.', correlationId);
  }

  if (req.file.size > MAX_FILE_SIZE) {
    return errorResponse(res, 400, 'IMPORT_FILE_TOO_LARGE', 'File is too large (max 5 MB).',
      'Try a smaller file, or add items manually.', correlationId);
  }

  let extractedText;
  try {
    extractedText = await extractText(req.file.buffer, effectiveMime);
  } catch (err) {
    const isPdf = SUPPORTED_MIME_TYPES[effectiveMime] === 'pdf';
    const msg = err.code === 'PDF_PARSE_ERROR' && isPdf
      ? err.message
      : 'Text could not be extracted from this file.';
    return errorResponse(res, 422, 'IMPORT_TEXT_EXTRACTION_FAILED', msg,
      isPdf
        ? 'If this is a scanned menu PDF, try CSV or DOCX, or add items manually.'
        : 'Try a different file format, or add items manually.', correlationId);
  }

  if (
    (!extractedText || extractedText.trim().length === 0)
    && SUPPORTED_MIME_TYPES[effectiveMime] === 'pdf'
  ) {
    return errorResponse(
      res,
      422,
      'IMPORT_EMPTY_EXTRACTED_TEXT',
      'This PDF has no selectable text (common for scanned image-only menus).',
      'Export as text-based PDF, use CSV or Word, or add items manually.',
      correlationId,
    );
  }

  const pipeline = await runParsePipeline(extractedText, correlationId);
  if (!pipeline.ok) {
    return sendErrorFromPipeline(res, pipeline.error);
  }

  res.set('X-Correlation-Id', correlationId);
  return res.status(200).json(pipeline.data);
}

async function importFromUrl(req, res) {
  const correlationId = req.correlationId;
  const url = req.body && typeof req.body.url === 'string' ? req.body.url.trim() : '';

  if (!url) {
    return errorResponse(res, 400, 'IMPORT_VALIDATION_FAILED', 'Request body must include a non-empty url string.',
      'Enter a full http or https link, upload a file instead, or add items manually.', correlationId);
  }

  let extractedText;
  try {
    extractedText = await fetchPageText(url);
  } catch (err) {
    const code = err.code && String(err.code).startsWith('IMPORT_')
      ? err.code
      : 'IMPORT_URL_FETCH_FAILED';
    const isTimeout = code === 'IMPORT_URL_TIMEOUT';
    return errorResponse(
      res,
      isTimeout ? 504 : 502,
      code,
      err.message || "We couldn't read this page.",
      isTimeout
        ? 'Try another URL, upload a file instead, or add items manually.'
        : (code === 'IMPORT_URL_BLOCKED_HOST'
          ? 'Use a public web address, upload a file instead, or add items manually.'
          : 'Try a different page, upload a file instead, or add items manually.'),
      correlationId,
    );
  }

  const pipeline = await runParsePipeline(extractedText, correlationId);
  if (!pipeline.ok) {
    return sendErrorFromPipeline(res, pipeline.error);
  }

  res.set('X-Correlation-Id', correlationId);
  return res.status(200).json(pipeline.data);
}

/**
 * POST /api/menu/import/save — bulk create menu items from reviewed import rows.
 * R2.8: if suggested_allergens (from parse) is non-empty, allergen_import_acknowledged must be true.
 */
async function saveImportedItems(req, res) {
  const correlationId = req.correlationId;
  const idemHeader = req.headers['idempotency-key'];
  const { menu_id: menuId, items } = req.body || {};

  if (!menuId || typeof menuId !== 'string') {
    return errorResponse(res, 400, 'IMPORT_VALIDATION_FAILED', 'menu_id is required.',
      'Select a target menu and try again.', correlationId);
  }

  if (!Array.isArray(items) || items.length === 0) {
    return errorResponse(res, 400, 'IMPORT_VALIDATION_FAILED', 'items must be a non-empty array.',
      'Select at least one item to import.', correlationId);
  }

  if (items.length > LIMITS.MAX_ITEMS) {
    return errorResponse(res, 400, 'IMPORT_ITEM_LIMIT_EXCEEDED', `At most ${LIMITS.MAX_ITEMS} items per request.`,
      'Deselect some rows or split into multiple saves.', correlationId);
  }

  const idempotencyKey = typeof idemHeader === 'string' && idemHeader.trim()
    ? idemHeader.trim()
    : (typeof req.body.idempotency_key === 'string' && req.body.idempotency_key.trim()
      ? req.body.idempotency_key.trim()
      : null);

  if (idempotencyKey) {
    const cacheKey = `${idempotencyKey}::${menuId}`;
    const existing = getResponse(cacheKey);
    if (existing && existing.body) {
      res.set('X-Correlation-Id', correlationId);
      return res.status(200).json({ ...existing.body, correlationId });
    }
  }

  const results = [];
  for (let i = 0; i < items.length; i += 1) {
    const row = items[i];
    const clientKey = row.client_key != null
      ? String(row.client_key)
      : (row.clientKey != null ? String(row.clientKey) : `row_${i}`);

    if (!row || !row.name || !String(row.name).trim()) {
      results.push({
        client_key: clientKey, status: 'error', code: 'ROW_VALIDATION', error: 'Name is required.',
      });
      continue;
    }

    const suggested = Array.isArray(row.suggested_allergens) ? row.suggested_allergens : [];
    if (suggested.length > 0 && !row.allergen_import_acknowledged) {
      results.push({
        client_key: clientKey,
        status: 'error',
        code: 'ALLERGEN_CONFIRMATION_REQUIRED',
        error: 'You must confirm that you have reviewed suggested allergens before saving.',
      });
      continue;
    }

    const itemType = row.item_type
      && typeof row.item_type === 'string'
      && ['appetizer', 'entree', 'dessert', 'drink', 'side'].includes(row.item_type)
      ? row.item_type
      : categoryStringToItemType(row.category);

    const ingredientsStr = Array.isArray(row.ingredients)
      ? row.ingredients.map((s) => String(s || '').trim()).filter(Boolean).join(', ')
      : String(row.ingredients || '');

    const allergens = Array.isArray(row.allergens) ? row.allergens : [];

    let priceVal = null;
    if (row.price !== null && row.price !== undefined && row.price !== '') {
      const n = Number(row.price);
      priceVal = !Number.isNaN(n) && n > 0 ? n : null;
    }

    const toCreate = {
      name: String(row.name).trim(),
      description: row.description != null ? String(row.description) : '',
      ingredients: ingredientsStr,
      allergens,
      menu_id: menuId,
      item_type: itemType,
      item_types: [itemType],
      price: priceVal,
      is_available: row.is_available !== false,
    };

    try {
      const created = await menuItemService.createMenuItem(toCreate);
      results.push({
        client_key: clientKey, status: 'ok', id: created.id, item: created,
      });
    } catch (e) {
      results.push({
        client_key: clientKey,
        status: 'error',
        code: 'IMPORT_VALIDATION_FAILED',
        error: e.message || 'Could not save item.',
      });
    }
  }

  const saved = results.filter((r) => r.status === 'ok').length;
  const failed = results.length - saved;
  const body = {
    success: true,
    partial: failed > 0,
    correlationId,
    summary: {
      total: results.length,
      saved,
      failed,
    },
    results,
  };

  if (idempotencyKey) {
    const cacheKey = `${idempotencyKey}::${menuId}`;
    setResponse(cacheKey, 200, body);
  }

  res.set('X-Correlation-Id', correlationId);
  return res.status(200).json(body);
}

module.exports = {
  importFromFile,
  importFromUrl,
  saveImportedItems,
  SUPPORTED_MIME_TYPES,
  runParsePipeline,
};
