const categoryService = require('../services/categoryService');

async function list(req, res) {
	const { businessId } = req.params;
	if (!businessId) {
		return res.status(400).json({ error: 'businessId is required' });
	}
	const categories = await categoryService.listByBusinessId(businessId);
	res.status(200).json(categories);
}

async function create(req, res) {
	const { businessId } = req.params;
	const { label, sort_order } = req.body;
	if (!businessId) {
		return res.status(400).json({ error: 'businessId is required' });
	}
	try {
		const category = await categoryService.create(businessId, { label, sort_order });
		res.status(201).json(category);
	} catch (err) {
		res.status(400).json({ error: err.message || 'Invalid request' });
	}
}

async function update(req, res) {
	const { businessId, id } = req.params;
	const { label, sort_order } = req.body;
	const updated = await categoryService.update(id, { label, sort_order }, businessId);
	if (!updated) {
		return res.status(404).json({ error: 'Category not found' });
	}
	res.status(200).json(updated);
}

async function remove(req, res) {
	const { businessId, id } = req.params;
	const deleted = await categoryService.remove(id, businessId);
	if (!deleted) {
		return res.status(404).json({ error: 'Category not found' });
	}
	res.status(200).json({ message: 'Category deleted' });
}

module.exports = {
	list,
	create,
	update,
	remove,
};
