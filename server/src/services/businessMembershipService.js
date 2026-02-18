const userService = require('./businessUserService');
const businessService = require('./businessService');

class BusinessMembershipError extends Error {
	constructor(code, message) {
		super(message || code);
		this.name = 'BusinessMembershipError';
		this.code = code;
	}
}

/**
 * Assigns a user to a business, either as an existing member or new admin.
 * Updates user record and prepares cookies and response message.
 *
 * @param {string} email - User's email
 * @param {string} businessId - Business ID to assign
 * @param {string} type - 'existing' or 'new'
 * @returns {Promise<{updatedUser: object, business: object, cookiesToSet: object, response: object}>}
 */
async function assignUserToBusiness(email, businessId, type) {
	if (!businessId) {
		throw new BusinessMembershipError(
			'BUSINESS_REQUIRED',
			'A business is required.',
		);
	}

	const foundBusiness = await businessService.getBusinessById(businessId);
	if (!foundBusiness) {
		throw new BusinessMembershipError('INVALID_BUSINESS', 'Invalid business.');
	}

	let updatedUser;
	try {
		if (type === 'existing') {
			updatedUser = await userService.updateUserByEmail(email, {
				business_id: businessId,
				admin: false,
			});
		} else if (type === 'new') {
			updatedUser = await userService.updateUserByEmail(email, {
				business_id: businessId,
				admin: true,
			});
		} else {
			throw new BusinessMembershipError(
				'INVALID_TYPE',
				'Invalid membership type.',
			);
		}
	} catch (err) {
		throw new BusinessMembershipError(
			'UPDATE_FAILED',
			'Could not add user to the business.',
		);
	}

	if (!updatedUser) {
		throw new BusinessMembershipError(
			'UPDATE_FAILED',
			'Could not add user to the business.',
		);
	}

	// Prepare cookies to set
	const cookiesToSet = {
		hasBusiness: type === 'existing' ? true : false,
		isAdmin: type === 'existing' ? false : updatedUser.admin,
		email: updatedUser.email,
		fullName: updatedUser.getFullName(),
		isAuthorized: true,
	};

	// Prepare response message
	let response;
	if (type === 'existing') {
		response = {
			message: `You have been added to ${foundBusiness.name} successfully.`,
			business_id: foundBusiness.id,
		};
	} else if (type === 'new') {
		response = { message: 'Business template created.' };
	}

	return { cookiesToSet, response };
}

module.exports = {
	assignUserToBusiness,
	BusinessMembershipError,
};
