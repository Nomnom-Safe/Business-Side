// server/src/controllers/menuController.js
const menuService = require('../services/menuService');

async function listMenus(req, res) {
	const menus = await menuService.listMenus();
	res.status(200).json(menus);
}

async function getMenuById(req, res) {
	const { id } = req.params;
	const menu = await menuService.getMenuById(id);

	if (!menu) {
		return res.status(404).json({ error: 'Menu not found' });
	}

	res.status(200).json(menu);
}

async function createMenuForBusiness(req, res) {
	const { business_id } = req.body;

	const menu = await menuService.createMenuForBusiness(business_id);
	res.status(201).json(menu);
}

async function deleteMenu(req, res) {
	const { id } = req.params;

	const deleted = await menuService.deleteMenu(id);
	if (!deleted) {
		return res.status(404).json({ error: 'Menu not found' });
	}

	res.status(200).json({ success: true });
}

module.exports = {
	listMenus,
	getMenuById,
	createMenuForBusiness,
	deleteMenu,
};
