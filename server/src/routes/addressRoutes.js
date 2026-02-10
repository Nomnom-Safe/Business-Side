const express = require('express');
const router = express.Router();
const addressService = require('../services/addressService');

// GET /api/addresses - list addresses
router.get('/', async (req, res) => {
	try {
		const addresses = await addressService.listAddresses();
		res.json(addresses);
	} catch (err) {
		res.status(500).json({ error: 'Could not fetch addresses' });
	}
});

// GET /api/addresses/:id
router.get('/:id', async (req, res) => {
	try {
		const addr = await addressService.getAddressById(req.params.id);
		if (!addr) return res.status(404).json({ error: 'Address not found' });
		res.json(addr);
	} catch (err) {
		res.status(500).json({ error: 'Could not fetch address' });
	}
});

// POST /api/addresses
router.post('/', async (req, res) => {
	try {
		const addrObj = req.body;
		const created = await addressService.createAddress(addrObj);
		res.status(201).json(created);
	} catch (err) {
		res.status(400).json({ error: 'Error creating address: ' + err.message });
	}
});

// PUT /api/addresses/:id
router.put('/:id', async (req, res) => {
	try {
		const updated = await addressService.updateAddress(req.params.id, req.body);
		if (!updated) return res.status(404).json({ error: 'Address not found' });
		res.json(updated);
	} catch (err) {
		res.status(400).json({ error: 'Error updating address: ' + err.message });
	}
});

// DELETE /api/addresses/:id
router.delete('/:id', async (req, res) => {
	try {
		const deleted = await addressService.deleteAddress(req.params.id);
		if (!deleted) return res.status(404).json({ error: 'Address not found' });
		res.json({ message: 'Address deleted' });
	} catch (err) {
		res.status(500).json({ error: 'Could not delete address' });
	}
});

module.exports = router;
