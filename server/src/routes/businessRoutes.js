const express = require('express');
const router = express.Router();
const cookies = require('../utils/cookies');
const businessService = require('../services/businessService');
const userService = require('../services/userService');

// @route   GET /api/businesses/
// @desc    Get a list of all businesses
// @access  Public (no auth yet)
router.get('/', async (req, res) => {
	try {
		const businesses = await businessService.listBusinesses();

		if (!businesses || businesses.length <= 0) {
			// No businesses exist in the DB
			return res.status(404).json({
				error: 'No businesses found',
				message: 'No businesses found.',
			});
		}

		return res.status(200).json(businesses);
	} catch (err) {
		res.status(500).json({
			error: 'Could not fetch businesses',
			message: 'Could not fetch businesses.',
		});
	}
});

// @route   GET /api/businesses/:id
// @desc    Get a business by ID and populate its menus
// @access  Public (no auth yet)
router.get('/:id', async (req, res) => {
	try {
		const business = await businessService.getBusinessWithMenus(req.params.id);

		if (!business) {
			return res.status(404).json({ error: 'Business not found' });
		}

		res.json(business);
	} catch (err) {
		console.error('GET /:id error:', err);
		res.status(500).json({ error: 'Could not fetch business' });
	}
});

// @route   POST /api/businesses
// @desc    Create a new business
// @access  Public (no auth yet)
router.post('/', async (req, res) => {
	try {
		const { name, url, address, allergens = [], diets = [] } = req.body;

		const unnamed = name === 'New Business';
		var existing;

		if (!unnamed && name !== '') {
			existing = await businessService.businessNameExists(name);
		}

		if (existing) {
			return res.status(400).json({
				error: 'Business name already exists',
				message:
					'A business with this name already exists. Please choose a different name.',
			});
		}

		const newBusiness = {
			name: name.trim(),
			website: url?.trim().toLowerCase() || 'None',
			address_id: address?.trim(),
			allergens,
			diets,
			menus: [],
		};

		const savedBusiness = await businessService.createBusiness(newBusiness);

		if (!savedBusiness) {
			return res.status(400).json({
				error: 'Error creating business',
				message: 'Error creating business.',
			});
		}

		const email = req.cookies.email;
		const user = await userService.getUserByEmail(email);

		if (!user) {
			return res.status(400).json({
				error: 'Error associating new business with user',
				message: 'Error associating new business with user.',
			});
		}

		cookies.updateCookie(res, 'isAdmin', user.admin);

		return res.status(201).json(savedBusiness);
	} catch (err) {
		console.error('Caught error:', err);

		// Handle duplicate key error (unique constraint violation)
		if (err.code === 11000 || err.message.includes('duplicate key')) {
			return res.status(400).json({
				error: 'Business name already exists',
				message:
					'A business with this name already exists. Please choose a different name.',
			});
		}

		// Handle validation errors
		if (err.name === 'ValidationError') {
			return res.status(400).json({
				error: 'Validation error',
				message: err.message || 'Invalid business data provided.',
			});
		}

		res.status(400).json({
			error: 'Error creating business: ' + err.message,
			message: 'Failed to create business. Please try again.',
		});
	}
});

// @route   PUT /api/businesses/:id
// @desc    Update a business
// @access  Public (no auth yet)
router.put('/:id', async (req, res) => {
	try {
		const { name, url, address, allergens, diets, menus } = req.body;

		// Check if another business already exists with the same name
		const existingBusiness = await businessService.businessNameExists(
			name,
			req.params.id,
		);

		if (existingBusiness) {
			return res.status(400).json({ error: 'Business name already exists.' });
		}

		const updateObj = {
			name: name?.trim(),
			website: url?.trim().toLowerCase() || 'None',
			address_id: address?.trim(),
			allergens,
			diets,
			menus,
		};

		const updatedBusiness = await businessService.updateBusiness(
			req.params.id,
			updateObj,
		);

		if (!updatedBusiness)
			return res.status(404).json({ error: 'Business not found' });
		res.json(updatedBusiness);
	} catch (err) {
		res.status(400).json({
			error: 'Error updating business: ' + err.message,
		});
	}
});

// @route   DELETE /api/businesses/:id
// @desc    Delete a business
// @access  Public (no auth yet)
router.delete('/:id', async (req, res) => {
	try {
		const deleted = await businessService.deleteBusiness(req.params.id);
		if (!deleted) return res.status(404).json({ error: 'Business not found' });
		res.json({ message: 'Business deleted successfully' });
	} catch (err) {
		res.status(500).json({ error: 'Could not delete business' });
	}
});

module.exports = router;
