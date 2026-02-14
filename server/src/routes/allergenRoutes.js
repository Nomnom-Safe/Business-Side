// server/src/routes/allergenRoutes.js
const express = require('express');
const router = express.Router();
const allergenService = require('../services/allergenService');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/allergens
// @desc  Return all allergens as [{ id, label }, ...]
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const items = await allergenService.listAllergens();
		res.status(200).json(items);
	}),
);

// @route GET /api/allergens/:id
router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const item = await allergenService.getAllergenById(req.params.id);
		if (!item) return res.status(404).json({ error: 'Allergen not found' });
		res.json(item);
	}),
);

module.exports = router;
