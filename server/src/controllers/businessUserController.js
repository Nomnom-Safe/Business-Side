// server/src/controllers/businessUserController.js

const cookies = require('../utils/cookies');
const { getIdToken } = require('../utils/getIdToken');
const authService = require('../services/authService');
const businessMembershipService = require('../services/businessMembershipService');

/**
 * POST /api/auth/signin
 * Sign in a user
 */
async function signIn(req, res) {
	const { email, password, idToken } = req.validated;

	const { user, cookiesToSet } = await authService.signIn({
		email,
		password,
		idToken,
	});

	cookies.apply(res, cookiesToSet);

	return res.status(200).json({ success: true, data: user });
}

/**
 * POST /api/auth/signup
 * Create a new user
 */
async function signUp(req, res) {
	const { first_name, last_name, email, password } = req.validated;

	const idToken = getIdToken(req);

	const { user, cookiesToSet } = await authService.signUp({
		first_name,
		last_name,
		email,
		password,
		idToken,
	});

	cookies.apply(res, cookiesToSet);

	return res.status(201).json({ success: true, data: user });
}

/**
 * POST /api/auth/logout
 * Log out a user
 */
async function logout(req, res) {
	cookies.clearAllCookies(req, res);
	return res.status(200).json({ message: 'Logged out successfully.' });
}

/**
 * POST /api/auth/edit-login
 * Update email or password
 */
async function editLogin(req, res) {
	const { message, user, cookiesToSet } = await authService.editLogin(
		req.validated,
	);

	if (cookiesToSet) {
		cookies.apply(res, cookiesToSet);
	}

	return res.status(200).json({ success: true, message, data: user });
}

/**
 * POST /api/auth/set-business
 * Assign a user to a business
 */
async function setBusiness(req, res) {
	const { type, businessId } = req.validated;
	const { email } = req.cookies;

	const { cookiesToSet, response } =
		await businessMembershipService.assignUserToBusiness(
			email,
			businessId,
			type,
		);

	cookies.apply(res, cookiesToSet);

	return res.status(200).json({ success: true, data: response });
}

module.exports = {
	signIn,
	signUp,
	logout,
	editLogin,
	setBusiness,
};
