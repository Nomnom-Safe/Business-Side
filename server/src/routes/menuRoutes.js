const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const menuController = require('../controllers/menuController');

// @route   GET /api/menus
// @desc    Get all menus
// @access  Public (no auth yet)
router.get('/', asyncHandler(menuController.listMenus));

/* Non-MVP Feature: Multiple menus.
	// @route   POST /api/menus
	// @desc    Create a new menu
	// @access  Public (no auth yet)
	router.post('/', asyncHandler(async (req, res) => {
		// Expect payload: { businessId }
		const { businessId } = req.body;

		if (!businessId) {
			return res.status(400).json({ error: 'businessId is required' });
		}

		const savedMenu = await menuService.createMenuForBusiness(businessId);

		res.status(201).json(savedMenu);
	}));
*/

/* Non-MVP Feature: Update menu title/description.
	// @route   PUT /api/menus/update-title-description
	// @desc    Update a menu's title and description
	// @access  Public (no auth yet)
	router.put('/update-title-description', async (req, res) => {
		try {
			const { businessId, title, description } = req.body;

			// Find the most recent menu for this business (since they are editing latest one)
			const business = await Business.findById(businessId).populate('menus');

			if (!business) {
				return res.status(404).json({ error: 'Business not found' });
			}

			const lastMenuId = business.menus[business.menus.length - 1];

			if (!lastMenuId) {
				return res.status(404).json({ error: 'No menus found for business' });
			}

			const updatedMenu = await Menu.findByIdAndUpdate(
				lastMenuId,
				{ title, description },
				{ new: true },
			);

			res.status(200).json(updatedMenu);
		} catch (err) {
			res.status(400).json({ error: 'Error updating menu: ' + err.message });
		}
	});
*/

/* Non-MVP Feature: Delete menu.
	// @route   DELETE /api/menus/:id
	// @desc    Delete a menu by ID
	// @access  Public (no auth yet)
	router.delete('/:id', asyncHandler(async (req, res) => {
		const menuId = req.params.id;

		const deleted = await menuService.deleteMenu(menuId);

		if (!deleted) return res.status(404).json({ error: 'Menu not found' });

		res.json({ message: 'Menu deleted and business updated successfully' });
	}));
*/

module.exports = router;
