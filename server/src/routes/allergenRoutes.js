const express = require('express');
const router = express.Router();
const { db } = require('../services/firestoreInit');

// @route GET /api/allergens
// @desc  Return all allergens as [{ id, label }, ...]
router.get('/', async (req, res) => {
	try {
		const snap = await db.collection('allergens').get();
		const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
		res.status(200).json(items);
	} catch (err) {
		console.error('Error fetching allergens:', err);
		res.status(500).json({ error: 'Could not fetch allergens' });
	}
});

module.exports = router;
