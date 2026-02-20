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

async function ensureMenuForBusiness(req, res) {
	const businessId = req.body.businessId ?? req.query.businessId;

	if (!businessId) {
		return res.status(400).json({ error: 'businessId is required' });
	}

	const menu = await menuService.ensureMenuForBusiness(businessId);
	res.status(200).json(menu);
}

async function updateMenu(req, res) {
	const { id } = req.params;
	const { title } = req.body;

	const menu = await menuService.updateMenu(id, { title });
	if (!menu) {
		return res.status(404).json({ error: 'Menu not found' });
	}

	res.status(200).json(menu);
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
	ensureMenuForBusiness,
	updateMenu,
	deleteMenu,
};
