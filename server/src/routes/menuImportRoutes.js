const express = require('express');
const router = express.Router();
const multer = require('multer');
const asyncHandler = require('../utils/asyncHandler');
const menuImportController = require('../controllers/menuImportController');

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// @route   POST /api/menu/import/file
// @desc    Upload a menu file (PDF, CSV, DOCX), extract text, parse via LLM
// @access  Public (no auth yet)
router.post('/file', upload.single('file'), asyncHandler(menuImportController.importFromFile));

module.exports = router;
