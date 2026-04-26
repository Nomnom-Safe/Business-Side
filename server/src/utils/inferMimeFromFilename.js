'use strict';

/**
 * Infer MIME type from filename when multer reports application/octet-stream.
 */
function inferMimeFromFilename(originalname) {
  const n = String(originalname || '').toLowerCase();
  if (n.endsWith('.pdf')) return 'application/pdf';
  if (n.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (n.endsWith('.csv')) return 'text/csv';
  return null;
}

module.exports = { inferMimeFromFilename };
