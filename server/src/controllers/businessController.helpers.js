// server/src/controllers/businessController.helpers.js

const businessService = require('../services/businessService');
const userService = require('../services/businessUserService');
const cookies = require('../utils/cookies');
const menuService = require('../services/menuService');
const addressService = require('../services/addressService');
const { US_STATES } = require('../schemas/Address');

/**
 * Parse a legacy free-text address string into { street, city, state, zipCode }.
 * Returns null if value does not look like legacy (e.g. no comma, or looks like doc ID).
 */
function parseLegacyAddressString(value) {
	if (!value || typeof value !== 'string') return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	// Doc IDs are typically alphanumeric with optional prefix (e.g. add_xxx); avoid treating as legacy
	if (/^[a-zA-Z0-9_-]+$/.test(trimmed) && trimmed.length < 50) return null;
	if (!trimmed.includes(',')) return null;

	const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
	if (parts.length < 2) return null;

	const street = parts[0] || '';
	const city = parts.length >= 2 ? parts[1] : '';
	let state = '';
	let zipCode = '';
	if (parts.length >= 3) {
		const lastPart = parts[parts.length - 1];
		const stateZipMatch = lastPart.match(/^([A-Za-z]{2})\s+(\d{5}(-\d{4})?)$/);
		if (stateZipMatch) {
			const abbr = stateZipMatch[1].toUpperCase();
			if (US_STATES.includes(abbr)) {
				state = abbr;
				zipCode = stateZipMatch[2];
			}
		}
	}

	return { street, city, state, zipCode };
}

/**
 * Resolve business address: fetch by address_id or parse legacy free-text in address_id.
 * Returns { id?, street, city, state, zipCode } or null.
 */
async function getResolvedAddress(business) {
	if (!business || !business.address_id) return null;

	const addr = await addressService.getAddressById(business.address_id);
	if (addr) {
		return {
			id: addr.id,
			street: addr.street || '',
			city: addr.city || '',
			state: addr.state || '',
			zipCode: addr.zipCode || '',
		};
	}

	const parsed = parseLegacyAddressString(business.address_id);
	if (parsed) return parsed;
	return null;
}

function mapBusinessResponse(business, resolvedAddress) {
	const out = {
		id: business.id,
		name: business.name || '',
		website: business.website || '',
		address_id: business.address_id,
		allergens: business.allergens || [],
		diets: business.diets || [],
		phone: business.phone || '000-000-0000',
		hours: business.hours || [],
		disclaimers: business.disclaimers || [],
		cuisine: business.cuisine || '',
		menus: business.menus,
	};
	if (resolvedAddress) {
		out.address = {
			street: resolvedAddress.street || '',
			city: resolvedAddress.city || '',
			state: resolvedAddress.state || '',
			zipCode: resolvedAddress.zipCode || '',
		};
		if (resolvedAddress.id) out.address.id = resolvedAddress.id;
	}
	return out;
}

async function fetchBusinessOrError(id) {
	const business = await businessService.getBusinessWithMenus(id);
	if (!business) {
		return { error: 'Business not found' };
	}
	return business;
}

async function deleteBusinessById(id) {
	const deleted = await businessService.deleteBusiness(id);
	if (!deleted) {
		return { error: 'Business not found' };
	}
	return { message: 'Business deleted successfully' };
}

/**
 * Validate business name uniqueness
 */
async function validateBusinessName(name, businessId = null) {
	if (!name || name.trim() === '') return null;

	const exists = await businessService.businessNameExists(name, businessId);

	if (!exists) return null;

	return {
		error: 'Business name already exists',
		message:
			'A business with this name already exists. Please choose a different name.',
	};
}

/**
 * Validate phone number format
 */
function validatePhone(phone) {
	if (phone && !/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
		return { error: 'phone must be in format ###-###-####' };
	}
	return null;
}

/**
 * Validate address existence
 */
async function validateAddressId(address_id) {
	if (!address_id) return null;

	const exists = await addressService.verifyAddressExists(address_id);
	if (!exists) {
		return { error: 'address_id does not exist' };
	}
	return null;
}

/**
 * Build the business payload for creation
 */
function buildBusinessPayload(data) {
	return {
		name: data.name.trim(),
		website: data.website?.trim().toLowerCase() || 'None',
		address_id:
			data.address_id || (data.address ? data.address.trim() : undefined),
		hours: Array.isArray(data.hours) ? data.hours : [],
		phone: data.phone || '',
		allergens: data.allergens || [],
		diets: data.diets || [],
		disclaimers: Array.isArray(data.disclaimers) ? data.disclaimers : [],
		cuisine: data.cuisine || '',
		menu_id: null,
	};
}

/**
 * Create menu safely and return error object if needed
 */
async function safelyCreateMenu(businessId) {
	try {
		await menuService.createMenuForBusiness(businessId);
		return null;
	} catch (err) {
		console.error('Failed to create menu for new business:', err);
		return {
			error: 'Menu creation failed',
			message: 'Business was created, but menu creation failed.',
		};
	}
}

/**
 * Update user admin cookie if logged in
 */
async function updateUserAdminCookieIfLoggedIn(req, res) {
	const email = req.cookies.email;
	if (!email) return;

	const user = await userService.getUserByEmail(email);
	if (user) {
		cookies.updateCookie(res, 'isAdmin', user.admin);
	}
}

/**
 * Build update payload
 */
function buildBusinessUpdatePayload(data) {
	return {
		name: data.name?.trim(),
		website: data.website?.trim().toLowerCase() || 'None',
		address_id:
			data.address_id || (data.address ? data.address.trim() : undefined),
		allergens: data.allergens,
		diets: data.diets,
		menu_id: data.menu_id || null,
		hours: Array.isArray(data.hours) ? data.hours : undefined,
		phone: data.phone || undefined,
		disclaimers: Array.isArray(data.disclaimers) ? data.disclaimers : undefined,
		cuisine: data.cuisine || undefined,
	};
}

module.exports = {
	validateBusinessName,
	validatePhone,
	validateAddressId,
	buildBusinessPayload,
	safelyCreateMenu,
	updateUserAdminCookieIfLoggedIn,
	buildBusinessUpdatePayload,
	deleteBusinessById,
	fetchBusinessOrError,
	mapBusinessResponse,
	getResolvedAddress,
};
