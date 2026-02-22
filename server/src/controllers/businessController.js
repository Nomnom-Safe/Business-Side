// server/src/controllers/businessController.js

const businessService = require('../services/businessService');
const {
	CreateBusinessSchema,
	UpdateBusinessSchema,
} = require('../schemas/Business');

const {
	validateBusinessName,
	validatePhone,
	validateAddressId,
	buildBusinessPayload,
	safelyCreateMenu,
	updateUserAdminCookieIfLoggedIn,
	buildBusinessUpdatePayload,
	mapBusinessResponse,
	getResolvedAddress,
	fetchBusinessOrError,
	deleteBusinessById,
} = require('./businessController.helpers');

/**
 * GET /api/businesses
 * List all businesses
 */
async function listBusinesses(req, res) {
	const businesses = await businessService.listBusinesses();

	if (!businesses || businesses.length === 0) {
		return res.status(404).json({
			error: 'No businesses found',
			message: 'No businesses found.',
		});
	}

	return res.status(200).json(businesses);
}

/**
 * GET /api/businesses/:id
 * Get a business and its menus
 */
async function getBusinessById(req, res) {
	const { id } = req.params;

	const business = await fetchBusinessOrError(id);

	if (business.error) {
		return res.status(404).json(business);
	}

	const resolvedAddress = await getResolvedAddress(business);
	return res.status(200).json(mapBusinessResponse(business, resolvedAddress));
}

/**
 * POST /api/businesses
 * Create a business and auto-generate its menu
 */
async function createBusiness(req, res) {
	// Zod validation
	const parsed = CreateBusinessSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error.flatten() });
	}
	const data = parsed.data;

	// Validate business name
	const nameCheck = await validateBusinessName(data.name);
	if (nameCheck) return res.status(400).json(nameCheck);

	// Validate phone
	const phoneCheck = validatePhone(data.phone);
	if (phoneCheck) return res.status(400).json(phoneCheck);

	// Validate address
	const addressCheck = await validateAddressId(data.address_id);
	if (addressCheck) return res.status(400).json(addressCheck);

	// Build payload
	const newBusiness = buildBusinessPayload(data);

	// Create business
	const savedBusiness = await businessService.createBusiness(newBusiness);
	if (!savedBusiness) {
		return res.status(400).json({
			error: 'Error creating business',
			message: 'Error creating business.',
		});
	}

	// Create menu
	const menuError = await safelyCreateMenu(savedBusiness.id);
	if (menuError) return res.status(500).json(menuError);

	// Update cookie if logged in
	await updateUserAdminCookieIfLoggedIn(req, res);

	// Return populated business
	const populated = await businessService.getBusinessWithMenus(
		savedBusiness.id,
	);
	return res.status(201).json(populated);
}

/**
 * PUT /api/businesses/:id
 * Update a business
 */
async function updateBusiness(req, res) {
	const { id } = req.params;

	// Zod validation
	const parsed = UpdateBusinessSchema.safeParse({ id, ...req.body });
	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error.flatten() });
	}

	const data = parsed.data;

	// Check for duplicate name
	const nameExists = await validateBusinessName(data.name, id);
	if (nameExists) return res.status(400).json(nameExists);

	// Validate phone
	const phoneCheck = validatePhone(data.phone);
	if (phoneCheck) return res.status(400).json(phoneCheck);

	// Validate address
	const addressCheck = await validateAddressId(data.address_id);
	if (addressCheck) return res.status(400).json(addressCheck);

	// Build update payload
	const updateObj = buildBusinessUpdatePayload(data);

	// Update business
	const updatedBusiness = await businessService.updateBusiness(id, updateObj);
	if (!updatedBusiness) {
		return res.status(404).json({ error: 'Business not found' });
	}

	return res.status(200).json(updatedBusiness);
}

/**
 * DELETE /api/businesses/:id
 * Delete a business
 */
async function deleteBusiness(req, res) {
	const { id } = req.params;

	const result = await deleteBusinessById(id);
	if (result.error) {
		return res.status(404).json(result);
	}

	return res.status(200).json(result);
}

module.exports = {
	listBusinesses,
	getBusinessById,
	createBusiness,
	updateBusiness,
	deleteBusiness,
};
