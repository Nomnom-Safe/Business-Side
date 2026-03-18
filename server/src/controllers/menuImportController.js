const { parseMenuText } = require('../services/menuParseService');

// Example usage inside your file import endpoint:
async function importFromFile(req, res) {
  try {
    const extractedText = req.body.text; // Text already extracted by pdf-parse, mammoth, etc.
    
    const items = await parseMenuText(extractedText);
    res.json({ success: true, items });

  } catch (err) {
    console.error('Menu parse error:', err.message);

    // R2.7: Clear error with fallback option
    res.status(500).json({
      success: false,
      error: 'We couldn't parse this menu automatically.',
      fallback: 'Try uploading a different file format, or add items manually.',
    });
  }
}