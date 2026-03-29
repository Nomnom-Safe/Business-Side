const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { parseMenuText } = require('../services/menuParseService');

const SUPPORTED_MIME_TYPES = {
	'application/pdf': 'pdf',
	'text/csv': 'csv',
	'application/vnd.ms-excel': 'csv',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

async function extractText(buffer, mimeType) {
	const fileType = SUPPORTED_MIME_TYPES[mimeType];

	switch (fileType) {
		case 'pdf': {
			const pdf = await pdfParse(buffer);
			return pdf.text;
		}
		case 'docx': {
			const result = await mammoth.extractRawText({ buffer });
			return result.value;
		}
		case 'csv': {
			return buffer.toString('utf-8');
		}
		default:
			throw new Error(`Unsupported file type: ${mimeType}`);
	}
}

async function importFromFile(req, res) {
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				error: 'No file uploaded.',
				fallback: 'Please select a PDF, CSV, or DOCX file and try again.',
			});
		}

		if (!SUPPORTED_MIME_TYPES[req.file.mimetype]) {
			return res.status(400).json({
				success: false,
				error: `Unsupported file type: ${req.file.mimetype}`,
				fallback: 'Please upload a PDF, CSV, or DOCX file, or add items manually.',
			});
		}

		if (req.file.size > MAX_FILE_SIZE) {
			return res.status(400).json({
				success: false,
				error: 'File is too large (max 5 MB).',
				fallback: 'Try a smaller file, or add items manually.',
			});
		}

		const extractedText = await extractText(req.file.buffer, req.file.mimetype);

		if (!extractedText || extractedText.trim().length === 0) {
			return res.status(422).json({
				success: false,
				error: 'The file appears to be empty — no text could be extracted.',
				fallback: 'Try a different file, or add items manually.',
			});
		}

		const items = await parseMenuText(extractedText);
		res.json({ success: true, items });

	} catch (err) {
		console.error('Menu import error:', err.message);

		res.status(500).json({
			success: false,
			error: "We couldn't parse this menu automatically.",
			fallback: 'Try uploading a different file format, or add items manually.',
		});
	}
}

module.exports = {
	importFromFile,
	SUPPORTED_MIME_TYPES,
};