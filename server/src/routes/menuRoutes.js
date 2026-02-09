const express = require('express');
const router = express.Router();
const menuService = require('../services/menuService');
const businessService = require('../services/businessService');

// @route   GET /api/menus
// @desc    Get all menus
// @access  Public (no auth yet)
router.get('/', async (req, res) => {
	try {
		const menus = await menuService.listMenus();

		res.json(menus);
	} catch (err) {
		res.status(500).json({ error: 'Could not fetch menu' });
	}
});

/* Non-MVP Feature: Multiple menus.
	// @route   POST /api/menus
	// @desc    Create a new menu
	// @access  Public (no auth yet)
	router.post('/', async (req, res) => {
		try {
			// Expect payload: { restaurant_id }
			const { restaurant_id } = req.body;

			if (!restaurant_id) {
				return res.status(400).json({ error: 'restaurant_id is required' });
			}

			const savedMenu = await menuService.createMenuForRestaurant(restaurant_id);

			res.status(201).json(savedMenu);
		} catch (err) {
			res.status(400).json({ error: 'Error creating menu: ' + err.message });
		}
	});
*/

// @route   PUT /api/menus/update-title-description
// @desc    Update a menu's title and description
// @access  Public (no auth yet)
router.put('/update-title-description', async (req, res) => {
	// With the new Firestore schema menus do not have title/description.
	// Keep this endpoint for compatibility but return 400 to indicate unsupported operation.
	return res.status(400).json({
		error:
			'Updating title/description is not supported with the new menu schema.',
	});
});

/* Non-MVP Feature: Delete menu.
	// @route   DELETE /api/menus/:id
	// @desc    Delete a menu by ID
	// @access  Public (no auth yet)
	router.delete('/:id', async (req, res) => {
		try {
			const menuId = req.params.id;

			const deleted = await menuService.deleteMenu(menuId);

			if (!deleted) return res.status(404).json({ error: 'Menu not found' });

			res.json({ message: 'Menu deleted and business updated successfully' });
		} catch (err) {
			res.status(500).json({ error: 'Could not delete menu: ' + err.message });
		}
	});
*/

module.exports = router;
