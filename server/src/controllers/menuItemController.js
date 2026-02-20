// server/src/controllers/menuItemController.js
const menuItemService = require('../services/menuItemService');
const menuService = require('../services/menuService');

async function getMenuByBusinessId(req, res) {
	const { businessId } = req.query;

	if (!businessId) {
		return res.status(400).json({ error: 'businessId is required' });
	}

	const menus = await menuService.listMenus();
	const menu = menus.find((m) => m.business_id === businessId) || null;

	if (!menu) {
		return res.status(200).json(null);
	}

	res.status(200).json({
		...menu,
		title: menu.title || 'Your Menu',
	});
}

async function listMenuItems(req, res) {
	const { menuID } = req.query;

	const filter = {};
	if (menuID) filter.menu_id = menuID;

	const items = await menuItemService.listMenuItems(filter);
	res.status(200).json(items || []);
}

async function getMenuItemById(req, res) {
	const { id } = req.params;
	const item = await menuItemService.getMenuItemById(id);

	if (!item) {
		return res.status(404).json({ error: 'Menu item not found' });
	}

	res.status(200).json(item);
}

async function createMenuItem(req, res) {
	const { name, description, ingredients, allergens, menu_id, item_type, item_types, price, price_description, is_available } = req.body;

	if (!menu_id) {
		return res.status(400).json({ error: 'menu_id is required' });
	}

	const newItem = {
		name,
		description: description ?? '',
		ingredients: ingredients ?? '',
		allergens: allergens || [],
		menu_id,
		item_type: item_type || 'entree',
		...(Array.isArray(item_types) && item_types.length > 0 && { item_types }),
		...(price !== undefined && { price }),
		...(price_description !== undefined && { price_description }),
		...(is_available !== undefined && { is_available }),
	};

	const saved = await menuItemService.createMenuItem(newItem);
	res.status(201).json(saved);
}

async function updateMenuItem(req, res) {
	const { id } = req.params;
	const updated = await menuItemService.updateMenuItem(id, req.body);

	if (!updated) {
		return res.status(404).json({ error: 'Menu item not found' });
	}

	res.status(200).json(updated);
}

async function deleteMenuItem(req, res) {
	const { id } = req.params;
	const deleted = await menuItemService.deleteMenuItem(id);

	if (!deleted) {
		return res.status(404).json({ error: 'Menu item not found' });
	}

	res.status(200).json({ message: 'Menu item deleted successfully' });
}

module.exports = {
	getMenuByBusinessId,
	listMenuItems,
	getMenuItemById,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
};
