const express = require('express');
const router = express.Router();
const addressService = require('../services/addressService');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/addresses - list addresses
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const addresses = await addressService.listAddresses();
		res.json(addresses);
	}),
);

// GET /api/addresses/:id
router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const addr = await addressService.getAddressById(req.params.id);
		if (!addr) return res.status(404).json({ error: 'Address not found' });
		res.json(addr);
	}),
);

// POST /api/addresses
router.post(
	'/',
	asyncHandler(async (req, res) => {
		const addrObj = req.body;
		const created = await addressService.createAddress(addrObj);
		res.status(201).json(created);
	}),
);

// PUT /api/addresses/:id
router.put(
	'/:id',
	asyncHandler(async (req, res) => {
		const updated = await addressService.updateAddress(req.params.id, req.body);
		if (!updated) return res.status(404).json({ error: 'Address not found' });
		res.json(updated);
	}),
);

// DELETE /api/addresses/:id
router.delete(
	'/:id',
	asyncHandler(async (req, res) => {
		const deleted = await addressService.deleteAddress(req.params.id);
		if (!deleted) return res.status(404).json({ error: 'Address not found' });
		res.json({ message: 'Address deleted' });
	}),
);

module.exports = router;
