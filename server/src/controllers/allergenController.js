// server/src/controllers/allergenController.js

const allergenService = require('../services/allergenService');

async function listAllergens(req, res) {
	const items = await allergenService.listAllergens();

	res.status(200).json(items);
}

async function getAllergenById(req, res) {
	const { id } = req.params;

	const item = await allergenService.getAllergenById(id);

	if (!item) {
		return res.status(404).json({ error: 'Allergen not found' });
	}

	res.status(200).json(item);
}

module.exports = {
	listAllergens,
	getAllergenById,
};
