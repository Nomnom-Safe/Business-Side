const express = require('express');
const router = express.Router();
const cookies = require('../utils/cookies');
const businessService = require('../services/businessService');
const userService = require('../services/businessUserService');
const { db } = require('../services/firestoreInit');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/businesses/
// @desc    Get a list of all businesses
// @access  Public (no auth yet)
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const businesses = await businessService.listBusinesses();

		if (!businesses || businesses.length <= 0) {
			// No businesses exist in the DB
			return res.status(404).json({
				error: 'No businesses found',
				message: 'No businesses found.',
			});
		}

		return res.status(200).json(businesses);
	}),
);

// @route   GET /api/businesses/:id
// @desc    Get a business by ID and populate its menus
// @access  Public (no auth yet)
router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const business = await businessService.getBusinessWithMenus(req.params.id);

		if (!business) {
			return res.status(404).json({ error: 'Business not found' });
		}

		res.json({
			id: business.id,
			name: business.name || '',
			website: business.website || '',
			address: business.address_id,
			allergens: business.allergens || [],
			diets: business.diets || [],
			phone: business.phone || '000-000-0000',
			hours: business.hours || [],
			disclaimers: business.disclaimers || [],
			cuisine: business.cuisine || '',
			menus: business.menus,
		});
	}),
);

// @route   POST /api/businesses
// @desc    Create a new business and auto-generate its menu
// @access  Public (no auth yet)
router.post(
	'/',
	asyncHandler(async (req, res) => {
		const {
			name,
			website,
			address_id,
			address,
			hours = [],
			phone = '',
			allergens = [],
			diets = [],
			disclaimers = [],
			cuisine = '',
		} = req.body;

		const unnamed = name === 'New Business';
		let existing = null;

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

		// validate phone (USA format ###-###-####) if provided
		if (phone && !/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
			return res
				.status(400)
				.json({ error: 'phone must be in format ###-###-####' });
		}

		// if address_id provided, verify it exists
		if (address_id) {
			const addrRef = db.collection('addresses').doc(address_id);
			const addrSnap = await addrRef.get();
			if (!addrSnap.exists) {
				return res.status(400).json({ error: 'address_id does not exist' });
			}
		}

		const newBusiness = {
			name: name.trim(),
			website: website?.trim().toLowerCase() || 'None',
			address_id: address_id || (address ? address.trim() : undefined),
			hours: Array.isArray(hours) ? hours : [],
			phone: phone || '',
			allergens,
			diets,
			disclaimers: Array.isArray(disclaimers) ? disclaimers : [],
			cuisine: cuisine || '',
			menu_id: null, // menu_id will be created and set after creating the menu
		};

		const savedBusiness = await businessService.createBusiness(newBusiness);

		if (!savedBusiness) {
			return res.status(400).json({
				error: 'Error creating business',
				message: 'Error creating business.',
			});
		}

		// Create a menu for the new business and set the business.menu_id
		const menuService = require('../services/menuService');

		try {
			await menuService.createMenuForBusiness(savedBusiness.id);
		} catch (err) {
			console.error('Failed to create menu for new business:', err);
			return res.status(500).json({
				error: 'Menu creation failed',
				message: 'Business was created, but menu creation failed.',
			});
		}

		const email = req.cookies.email;
		let user = null;

		if (email) {
			user = await userService.getUserByEmail(email);
			if (user) {
				cookies.updateCookie(res, 'isAdmin', user.admin);
			} else {
				console.warn(
					'Business created but user association failed — no user found for email cookie.',
				);
			}
		} else {
			console.warn(
				'Business created but user association skipped — no email cookie present.',
			);
		}

		// Return business with its menu populated
		const populated = await businessService.getBusinessWithMenus(
			savedBusiness.id,
		);

		return res.status(201).json(populated);
	}),
);

// @route   PUT /api/businesses/:id
// @desc    Update a business
// @access  Public (no auth yet)
router.put(
	'/:id',
	asyncHandler(async (req, res) => {
		const {
			name,
			website,
			address_id,
			address,
			allergens,
			diets,
			menu_id,
			hours,
			phone,
			disclaimers,
			cuisine,
		} = req.body;

		// Check if another business already exists with the same name
		const existingBusiness = await businessService.businessNameExists(
			name,
			req.params.id,
		);

		if (existingBusiness) {
			return res.status(400).json({ error: 'Business name already exists.' });
		}

		// validate phone if present
		if (phone && !/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
			return res
				.status(400)
				.json({ error: 'phone must be in format ###-###-####' });
		}

		if (address_id) {
			const addrRef = db.collection('addresses').doc(address_id);
			const addrSnap = await addrRef.get();
			if (!addrSnap.exists) {
				return res.status(400).json({ error: 'address_id does not exist' });
			}
		}

		const updateObj = {
			name: name?.trim(),
			website: website?.trim().toLowerCase() || 'None',
			address_id: address_id || (address ? address.trim() : undefined),
			allergens,
			diets,
			menu_id: menu_id || null,
			hours: Array.isArray(hours) ? hours : undefined,
			phone: phone || undefined,
			disclaimers: Array.isArray(disclaimers) ? disclaimers : undefined,
			cuisine: cuisine || undefined,
		};

		const updatedBusiness = await businessService.updateBusiness(
			req.params.id,
			updateObj,
		);

		if (!updatedBusiness)
			return res.status(404).json({ error: 'Business not found' });
		res.json(updatedBusiness);
	}),
);

// @route   DELETE /api/businesses/:id
// @desc    Delete a business
// @access  Public (no auth yet)
router.delete(
	'/:id',
	asyncHandler(async (req, res) => {
		const deleted = await businessService.deleteBusiness(req.params.id);
		if (!deleted) return res.status(404).json({ error: 'Business not found' });
		res.json({ message: 'Business deleted successfully' });
	}),
);

module.exports = router;
