'use strict';

/**
 * Integration tests for POST /api/menu/import/file
 *
 * These tests spin up a minimal Express app (no Firebase, no real LLM calls).
 * menuParseService is mocked so tests are fast and deterministic.
 */

const express = require('express');
const request = require('supertest');
const path = require('path');

// pdf-parse and mammoth ship ESM internals that Jest 27's default transform cannot parse.
// Mock them before any module that requires them is loaded.
jest.mock('pdf-parse', () => jest.fn());
jest.mock('mammoth', () => ({ extractRawText: jest.fn() }));

// @google/genai also ships as ESM — mock the entire service.
jest.mock('../../src/services/menuParseService', () => ({
  parseMenuText: jest.fn(),
}));
const { parseMenuText } = require('../../src/services/menuParseService');

// Avoid loading cheerio/undici in Jest (ReadableStream) when routes pull urlImportFetch.
jest.mock('../../src/utils/urlImportFetch', () => ({
  fetchPageText: jest.fn(),
}));
const { fetchPageText } = require('../../src/utils/urlImportFetch');

jest.mock('../../src/services/menuItemService', () => ({
  createMenuItem: jest.fn(),
}));
const menuItemService = require('../../src/services/menuItemService');
const pdfParse = require('pdf-parse');

const menuImportRoutes = require('../../src/routes/menuImportRoutes');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/menu/import', menuImportRoutes);
  app.use((err, req, res, next) => {
    res.status(500).json({ success: false, error: err.message });
  });
  return app;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCSVBuffer(content) {
  return Buffer.from(content || 'Name,Price\nBurger,10\n');
}

const VALID_LLM_ITEMS = [
  {
    name: 'Burger',
    description: 'Classic beef burger',
    ingredients: ['beef patty', 'lettuce', 'tomato'],
    price: 10,
    category: 'Mains',
    possible_allergens: ['gluten'],
  },
  {
    name: 'Garden Salad',
    description: 'Fresh mixed greens',
    ingredients: ['lettuce', 'tomato', 'cucumber'],
    price: 8,
    category: 'Starters',
    possible_allergens: [],
  },
];

// ---------------------------------------------------------------------------
// Full success (all rows valid)
// ---------------------------------------------------------------------------

describe('POST /api/menu/import/file — full success', () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  beforeEach(() => {
    parseMenuText.mockResolvedValue(VALID_LLM_ITEMS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns 200 with success:true, partial:false', async () => {
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.partial).toBe(false);
  });

  test('response contains correlationId in body and header', async () => {
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.body.correlationId).toBeDefined();
    expect(typeof res.body.correlationId).toBe('string');
    expect(res.headers['x-correlation-id']).toBe(res.body.correlationId);
  });

  test('echoes client-provided X-Correlation-Id', async () => {
    const clientId = 'test-correlation-abc-123';
    const res = await request(app)
      .post('/api/menu/import/file')
      .set('X-Correlation-Id', clientId)
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.body.correlationId).toBe(clientId);
    expect(res.headers['x-correlation-id']).toBe(clientId);
  });

  test('generates its own correlationId when none provided', async () => {
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.body.correlationId).toMatch(/^[0-9a-f-]{36}$/);
  });

  test('response includes summary with correct counts', async () => {
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.body.summary).toEqual({
      totalRows: 2,
      validRows: 2,
      invalidRows: 0,
      duplicateRows: 0,
    });
  });

  test('each row has status:valid and empty issues array', async () => {
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    for (const row of res.body.items) {
      expect(row.status).toBe('valid');
      expect(row.issues).toEqual([]);
    }
  });

  test('ingredients field is an array in each row', async () => {
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    for (const row of res.body.items) {
      expect(Array.isArray(row.item.ingredients)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Partial success (mixed rows)
// ---------------------------------------------------------------------------

describe('POST /api/menu/import/file — partial success', () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns partial:true when any row is invalid', async () => {
    parseMenuText.mockResolvedValue([
      { name: 'Burger', price: 10, category: 'Mains', ingredients: [], possible_allergens: [] },
      { name: '', price: null, category: 'Mains', ingredients: [], possible_allergens: [] },
    ]);

    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.status).toBe(200);
    expect(res.body.partial).toBe(true);
    expect(res.body.summary.invalidRows).toBe(1);
  });

  test('returns partial:true when any row is a duplicate', async () => {
    parseMenuText.mockResolvedValue([
      { name: 'Burger', price: 10, category: 'Mains', ingredients: [], possible_allergens: [] },
      { name: 'Burger', price: 12, category: 'Mains', ingredients: [], possible_allergens: [] },
    ]);

    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.status).toBe(200);
    expect(res.body.partial).toBe(true);
    expect(res.body.summary.duplicateRows).toBe(1);
  });

  test('duplicate row has status:duplicate and DUPLICATE_NAME_CATEGORY code', async () => {
    parseMenuText.mockResolvedValue([
      { name: 'Burger', price: 10, category: 'Mains', ingredients: [], possible_allergens: [] },
      { name: 'Burger', price: 12, category: 'Mains', ingredients: [], possible_allergens: [] },
    ]);

    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    const dupeRow = res.body.items.find(r => r.status === 'duplicate');
    expect(dupeRow).toBeDefined();
    expect(dupeRow.issues[0].code).toBe('DUPLICATE_NAME_CATEGORY');
  });

  test('duplicate row is not auto-removed (both rows present)', async () => {
    parseMenuText.mockResolvedValue([
      { name: 'Pizza', price: 15, category: 'Mains', ingredients: [], possible_allergens: [] },
      { name: 'Pizza', price: 16, category: 'Mains', ingredients: [], possible_allergens: [] },
    ]);

    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.body.items).toHaveLength(2);
  });

  test('returns IMPORT_ZERO_ITEMS_PARSED when no valid rows remain after normalization', async () => {
    parseMenuText.mockResolvedValue([
      { name: '', price: null, category: 'Mains', ingredients: [], possible_allergens: [] },
    ]);

    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.status).toBe(422);
    expect(res.body.code).toBe('IMPORT_ZERO_ITEMS_PARSED');
  });
});

// ---------------------------------------------------------------------------
// Pipeline-level failures — error taxonomy
// ---------------------------------------------------------------------------

describe('POST /api/menu/import/file — pipeline failures', () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('IMPORT_NO_FILE when no file attached', async () => {
    const res = await request(app)
      .post('/api/menu/import/file');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('IMPORT_NO_FILE');
    expect(res.body.error).toBeTruthy();
    expect(res.body.fallback).toBeTruthy();
    expect(res.body.correlationId).toBeDefined();
  });

  test('IMPORT_UNSUPPORTED_FILE_TYPE for non-allowed MIME', async () => {
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', Buffer.from('data'), { filename: 'menu.png', contentType: 'image/png' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('IMPORT_UNSUPPORTED_FILE_TYPE');
  });

  test('IMPORT_EMPTY_EXTRACTED_TEXT when CSV is whitespace only', async () => {
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', Buffer.from('   '), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.status).toBe(422);
    expect(res.body.code).toBe('IMPORT_EMPTY_EXTRACTED_TEXT');
  });

  test('IMPORT_PARSE_PROVIDER_ERROR when LLM throws', async () => {
    parseMenuText.mockRejectedValue(new Error('Provider unavailable'));

    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.status).toBe(502);
    expect(res.body.code).toBe('IMPORT_PARSE_PROVIDER_ERROR');
    expect(res.body.fallback).toBeTruthy();
  });

  test('IMPORT_PARSE_TIMEOUT when LLM throws timeout error', async () => {
    parseMenuText.mockRejectedValue(new Error('Request timeout exceeded'));

    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.status).toBe(502);
    expect(res.body.code).toBe('IMPORT_PARSE_TIMEOUT');
  });

  test('IMPORT_INVALID_RESPONSE_FORMAT when LLM returns non-array', async () => {
    parseMenuText.mockResolvedValue({ unexpected: 'object' });

    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', makeCSVBuffer(), { filename: 'menu.csv', contentType: 'text/csv' });

    expect(res.status).toBe(502);
    expect(res.body.code).toBe('IMPORT_INVALID_RESPONSE_FORMAT');
  });

  test('error response always includes success:false, code, error, fallback, correlationId', async () => {
    const res = await request(app)
      .post('/api/menu/import/file');

    expect(res.body).toMatchObject({
      success: false,
      code: expect.any(String),
      error: expect.any(String),
      fallback: expect.any(String),
      correlationId: expect.any(String),
    });
  });
});

// ---------------------------------------------------------------------------
// POST /api/menu/import/file — PDF
// ---------------------------------------------------------------------------

describe('POST /api/menu/import/file — PDF handling', () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  beforeEach(() => {
    parseMenuText.mockResolvedValue(VALID_LLM_ITEMS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('infers PDF from application/octet-stream when filename ends with .pdf', async () => {
    pdfParse.mockResolvedValue({ text: 'Some menu text' });
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', Buffer.from('%PDF-1.0'), {
        filename: 'menu.pdf',
        contentType: 'application/octet-stream',
      });

    expect(res.status).toBe(200);
    expect(pdfParse).toHaveBeenCalled();
    expect(parseMenuText).toHaveBeenCalledWith(
      expect.stringContaining('Some menu text'),
      expect.objectContaining({ correlationId: expect.any(String) }),
    );
  });

  test('IMPORT_EMPTY_EXTRACTED_TEXT when PDF has no extractable text', async () => {
    pdfParse.mockResolvedValue({ text: '   ' });
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', Buffer.from('x'), { filename: 'scan.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(422);
    expect(res.body.code).toBe('IMPORT_EMPTY_EXTRACTED_TEXT');
    expect(parseMenuText).not.toHaveBeenCalled();
  });

  test('IMPORT_TEXT_EXTRACTION_FAILED when pdf-parse throws', async () => {
    pdfParse.mockRejectedValue(new Error('encrypted'));
    const res = await request(app)
      .post('/api/menu/import/file')
      .attach('file', Buffer.from('x'), { filename: 'locked.pdf', contentType: 'application/pdf' });

    expect(res.status).toBe(422);
    expect(res.body.code).toBe('IMPORT_TEXT_EXTRACTION_FAILED');
    expect(parseMenuText).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// POST /api/menu/import/url
// ---------------------------------------------------------------------------

describe('POST /api/menu/import/url', () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('200 with same envelope as file when fetch and parse succeed', async () => {
    fetchPageText.mockResolvedValue('Burger 10\nSalad 8');
    parseMenuText.mockResolvedValue(VALID_LLM_ITEMS);

    const res = await request(app)
      .post('/api/menu/import/url')
      .send({ url: 'https://example.com/menu' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.partial).toBe(false);
    expect(res.body.summary.totalRows).toBe(2);
    expect(res.headers['x-correlation-id']).toBe(res.body.correlationId);
  });

  test('400 when url missing', async () => {
    const res = await request(app)
      .post('/api/menu/import/url')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('IMPORT_VALIDATION_FAILED');
  });

  test('502 when fetchPageText throws IMPORT_URL_TIMEOUT', async () => {
    const err = new Error("We couldn't read this page in time.");
    err.code = 'IMPORT_URL_TIMEOUT';
    fetchPageText.mockRejectedValue(err);

    const res = await request(app)
      .post('/api/menu/import/url')
      .send({ url: 'https://example.com/slow' });

    expect(res.status).toBe(504);
    expect(res.body.code).toBe('IMPORT_URL_TIMEOUT');
  });
});

// ---------------------------------------------------------------------------
// POST /api/menu/import/save
// ---------------------------------------------------------------------------

describe('POST /api/menu/import/save', () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  beforeEach(() => {
    menuItemService.createMenuItem.mockImplementation((obj) => Promise.resolve({
      id: 'doc_new_1',
      ...obj,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('200 saves items and returns row results', async () => {
    const res = await request(app)
      .post('/api/menu/import/save')
      .send({
        menu_id: 'menu_123',
        items: [
          {
            client_key: 'a',
            name: 'Burger',
            description: 'Good',
            ingredients: ['beef'],
            category: 'Mains',
            allergens: [],
            price: 9.99,
            suggested_allergens: [],
            allergen_import_acknowledged: true,
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.partial).toBe(false);
    expect(res.body.summary.saved).toBe(1);
    expect(res.body.results[0].status).toBe('ok');
    expect(res.body.results[0].id).toBe('doc_new_1');
    expect(menuItemService.createMenuItem).toHaveBeenCalledTimes(1);
  });

  test('fails row when suggested_allergens without acknowledgement', async () => {
    const res = await request(app)
      .post('/api/menu/import/save')
      .send({
        menu_id: 'menu_123',
        items: [
          {
            client_key: 'a',
            name: 'Cake',
            category: 'Desserts',
            ingredients: ['flour'],
            allergens: [],
            suggested_allergens: ['gluten'],
            allergen_import_acknowledged: false,
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.partial).toBe(true);
    expect(res.body.summary.failed).toBe(1);
    expect(res.body.results[0].code).toBe('ALLERGEN_CONFIRMATION_REQUIRED');
    expect(menuItemService.createMenuItem).not.toHaveBeenCalled();
  });

  test('idempotent: second request with same Idempotency-Key returns cached body', async () => {
    const payload = {
      menu_id: 'menu_abc',
      items: [
        {
          client_key: 'a',
          name: 'Soup',
          category: 'Mains',
          ingredients: 'water',
          allergens: [],
          suggested_allergens: [],
        },
      ],
    };

    const r1 = await request(app)
      .post('/api/menu/import/save')
      .set('Idempotency-Key', 'key-replay-1')
      .send(payload);

    const r2 = await request(app)
      .post('/api/menu/import/save')
      .set('Idempotency-Key', 'key-replay-1')
      .send({ ...payload, items: [{ ...payload.items[0], name: 'SHOULD NOT USE' }] });

    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    expect(r2.body.results[0].item.name || r2.body.results[0].item).toBeDefined();
    expect(r2.body.results[0].item.name).toBe('Soup');
  });
});
