// server/src/controllers/addressController.js
const addressService = require('../services/addressService');

async function listAddresses(req, res) {
	const addresses = await addressService.listAddresses();
	res.status(200).json(addresses);
}

async function getAddressById(req, res) {
	const { id } = req.params;
	const address = await addressService.getAddressById(id);

	if (!address) {
		return res.status(404).json({ error: 'Address not found' });
	}

	res.status(200).json(address);
}

async function createAddress(req, res) {
	const created = await addressService.createAddress(req.body);
	res.status(201).json(created);
}

async function updateAddress(req, res) {
	const { id } = req.params;
	const updated = await addressService.updateAddress(id, req.body);

	if (!updated) {
		return res.status(404).json({ error: 'Address not found' });
	}

	res.status(200).json(updated);
}

async function deleteAddress(req, res) {
	const { id } = req.params;
	const deleted = await addressService.deleteAddress(id);

	if (!deleted) {
		return res.status(404).json({ error: 'Address not found' });
	}

	res.status(200).json({ message: 'Address deleted' });
}

module.exports = {
	listAddresses,
	getAddressById,
	createAddress,
	updateAddress,
	deleteAddress,
};
