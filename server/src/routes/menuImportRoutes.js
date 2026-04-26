'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const menuImportController = require('../controllers/menuImportController');
const { importRateLimit } = require('../middleware/importRateLimit');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const jsonBody = express.json({ limit: '1mb' });

function correlationIdMiddleware(req, res, next) {
  const incoming = req.headers['x-correlation-id'];
  req.correlationId = (typeof incoming === 'string' && incoming.trim())
    ? incoming.trim()
    : crypto.randomUUID();
  next();
}

// @route   POST /api/menu/import/file
// @desc    Upload a menu file (PDF, CSV, DOCX), extract text, parse via LLM
// @access  Public (no auth yet)
router.post('/file',
  correlationIdMiddleware,
  importRateLimit,
  upload.single('file'),
  asyncHandler(menuImportController.importFromFile),
);

// @route   POST /api/menu/import/url
// @desc    Fetch public URL, extract text, parse via LLM
// @access  Public (no auth yet)
router.post('/url',
  correlationIdMiddleware,
  importRateLimit,
  jsonBody,
  asyncHandler(menuImportController.importFromUrl),
);

// @route   POST /api/menu/import/save
// @desc    Bulk save reviewed import rows to a menu
// @access  Public (no auth yet)
router.post('/save',
  correlationIdMiddleware,
  importRateLimit,
  jsonBody,
  asyncHandler(menuImportController.saveImportedItems),
);

module.exports = router;
