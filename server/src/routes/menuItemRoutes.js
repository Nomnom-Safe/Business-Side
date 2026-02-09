const express = require('express');
const router = express.Router();
const menuItemService = require('../services/menuItemService');
const menuService = require('../services/menuService');

//
// MenuItems.jsx
//

// @route GET /api/menuitems/menu/:menuname&:restaurant_id
// @desc Get menu by menuTitle
// @access Public
router.get('/menu/', async (req, res) => {
	try {
		const { restaurant_id } = req.query;

		if (!restaurant_id) {
			return res.status(400).json({ error: 'restaurant_id is required' });
		}

		// With the schema menus are identified by restaurant_id. Return the menu for the restaurant.
		const menus = await menuService.listMenus();
		const menu = menus.find((m) => m.restaurant_id === restaurant_id) || null;
		res.status(200).json(menu || []);
	} catch (err) {
		console.error('Error fetching menu:', err);
		res.status(500).json({ error: 'Could not fetch menu' });
	}
});

// @route GET /api/menuitems
// @desc Get menu items by menuID (optional)
// @access Public
router.get('/', async (req, res) => {
	try {
		const { menuID } = req.query;

		let filter = {};
		if (menuID) {
			filter.menu_id = menuID;
		}

		const menuitems = await menuItemService.listMenuItems(filter);

		res.status(200).json(menuitems || []);
	} catch (err) {
		console.error('Error fetching menu items:', err);
		res.status(500).json({ error: 'Could not fetch menu items' });
	}
});

// @route   PUT api/menuitems
// @desc    Edit an existing menu item
// @access  Public (no auth yet)
router.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, allergens, menu_id } = req.body;

		// Ensure the ID is provided
		if (!id) {
			return res.status(400).json({ error: 'Menu item ID is required' });
		}

		const updatedMenuItem = await menuItemService.updateMenuItem(id, {
			name,
			description,
			allergens,
			menu_id,
		});

		// If no menu item is found, return an error
		if (!updatedMenuItem) {
			return res.status(404).json({ error: 'Menu item not found' });
		}
		res.status(200).json(updatedMenuItem);
	} catch (err) {
		res.status(500).json({ error: 'Error editing menu item: ' + err.message });
	}
});

// @route   DELETE api/menuitems/:id
// @desc    Delete a menu item by ID
// @access  Public (no auth yet)
// @route DELETE /api/menuitems/:id
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await menuItemService.deleteMenuItem(id);
		if (!deleted) {
			return res.status(404).json({ error: 'Menu Item not found' });
		}
		res.status(200).json({ message: 'Menu item deleted successfully' });
	} catch (err) {
		res.status(500).json({ error: 'Could not delete menu item' });
	}
});

///
/// AddMenuItem.jsx
///

// @route   POST /api/menuitems/add-menu-item
// @desc    Create a new menu item
// @access  Public (no auth yet)
// Schema requires `menu_id` to reference the menu this item belongs to.
router.post('/add-menu-item', async (req, res) => {
	try {
		const { name, description, allergens, menu_id } = req.body;

		if (!menu_id) {
			return res.status(400).json({ error: 'menu_id is required' });
		}

		const newMenuItem = {
			name,
			description,
			allergens: allergens || [],
			menu_id,
		};

		const savedMenuItem = await menuItemService.createMenuItem(newMenuItem);
		res.status(201).json(savedMenuItem);
	} catch (err) {
		res.status(400).json({ error: 'Error creating menu item: ' + err.message });
	}
});

///
/// MenuItemSwap.jsx
///
// ARCHIVED: Menu Item Swapping - Not part of MVP (single menu)
// @route   GET /api/menuitems/menuswap-menus
// @desc    Get all menus for business id
// @access  Public (no auth yet)
/*
router.get('/menuswap-menus', async (req, res) => {
	try {
		const { restaurant_id } = req.query;

		if (!restaurant_id)
			return res.status(400).json({ error: 'restaurant_id required' });

		const menus = await menuService.listMenus();
		const filtered = menus.filter((m) => m.restaurant_id === restaurant_id);
		res.json(filtered);
	} catch (err) {
		console.error('Error fetching menu:', err);
		res.status(500).json({ error: 'Could not fetch menus' });
	}
});

// @route   GET /api/menuitems/menuswap-items
// @desc    Get all menu items associated with Master Menu ID
// @access  Public (no auth yet)
router.get('/menuswap-items', async (req, res) => {
	try {
		const { menuID } = req.query;
		const items = await menuItemService.listMenuItems(
			menuID ? { menu_id: menuID } : {},
		);
		res.status(200).json(items || []);
	} catch (err) {
		console.error('Error fetching menu items:', err);
		res.status(500).json({ error: 'Could not fetch menu items' });
	}
});
*/

// ARCHIVED: Menu Item Swapping - Not part of MVP (single menu)
// @route   PUT /api/menuitem/swap-menu
// @desc    Update the existing menuItems
// @access  Public (no auth yet)
/*
router.put('/swap-menu/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, allergens, menu_id } = req.body;

		if (!id) return res.status(400).json({ error: 'Menu item ID is required' });

		const updatedMenuItem = await menuItemService.updateMenuItem(id, {
			name,
			description,
			allergens,
			menu_id,
		});

		if (!updatedMenuItem)
			return res.status(404).json({ error: 'Menu item not found' });

		res.status(200).json(updatedMenuItem);
	} catch (err) {
		res.status(500).json({ error: 'Error editing menu item: ' + err.message });
	}
});
*/

module.exports = router;
