// server/src/routes/menuItemRoutes.js
const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/menuitems/menu/:businessId
// @desc Get menu by menuTitle
// @access Public
router.get('/menu/', asyncHandler(menuItemController.getMenuByBusinessId));

// @route GET /api/menuitems
// @desc Get menu items by menuID (optional)
// @access Public
router.get('/', asyncHandler(menuItemController.listMenuItems));

// @route   PUT api/menuitems
// @desc    Edit an existing menu item
// @access  Public (no auth yet)
router.put('/:id', asyncHandler(menuItemController.updateMenuItem));

// @route   DELETE api/menuitems/:id
// @desc    Delete a menu item by ID
// @access  Public (no auth yet)
// @route DELETE /api/menuitems/:id
router.delete('/:id', asyncHandler(menuItemController.deleteMenuItem));

// @route   POST /api/menuitems/add-menu-item
// @desc    Create a new menu item
// @access  Public (no auth yet)
// Schema requires `menu_id` to reference the menu this item belongs to.
router.post('/add-menu-item', asyncHandler(menuItemController.createMenuItem));

// ARCHIVED: Menu Item Swapping - Not part of MVP (single menu)
// @route   GET /api/menuitems/menuswap-menus
// @desc    Get all menus for business id
// @access  Public (no auth yet)
/*
router.get('/menuswap-menus', asyncHandler(async (req, res) => {
	const { businessId } = req.query;

	if (!businessId)
		return res.status(400).json({ error: 'businessId required' });

	const menus = await menuService.listMenus();
	const filtered = menus.filter((m) => m.business_id === businessId);
	res.json(filtered);
}));

// @route   GET /api/menuitems/menuswap-items
// @desc    Get all menu items associated with Master Menu ID
// @access  Public (no auth yet)
router.get('/menuswap-items', asyncHandler(async (req, res) => {
	const { menuID } = req.query;
	const items = await menuItemService.listMenuItems(
		menuID ? { menu_id: menuID } : {},
	);
	res.status(200).json(items || []);
}));
*/

// ARCHIVED: Menu Item Swapping - Not part of MVP (single menu)
// @route   PUT /api/menuitem/swap-menu
// @desc    Update the existing menuItems
// @access  Public (no auth yet)
/*
router.put('/swap-menu/:id', asyncHandler(async (req, res) => {
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
}));
*/

module.exports = router;
