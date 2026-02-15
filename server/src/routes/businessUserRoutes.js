const express = require('express');
const router = express.Router();
const cookies = require('../utils/cookies');
const asyncHandler = require('../utils/asyncHandler');
const { getIdToken } = require('../utils/getIdToken');
const businessMembershipService = require('../services/businessMembershipService');
const authService = require('../services/authService');
const {
	SignUpSchema,
	EditLoginSchema,
	SetBusinessSchema,
	SignInSchema,
} = require('../schemas');
const { validate } = require('../utils/validate');

// @route   POST /api/auth/signin
// @desc    Get a user
// @access  Public (no auth yet)
router.post(
	'/signin',
	validate(SignInSchema),
	asyncHandler(async (req, res) => {
		const { email, password, idToken } = req.validated;

		// Delegate signin logic to the service layer
		const { user, cookiesToSet } = await authService.signIn({
			email,
			password,
			idToken,
		});

		// Set cookies
		cookies.apply(res, cookiesToSet);

		// Send success response w/ user's data
		return res.status(200).json({ success: true, data: user });
	}),
);

// @route   POST /api/auth/signup
// @desc    Create a new user
// @access  Public (no auth yet)
router.post(
	'/signup',
	validate(SignUpSchema),
	asyncHandler(async (req, res) => {
		const { first_name, last_name, email, password } = req.validated;

		// Extract id token if provided by client
		const idToken = getIdToken(req);

		// Delegate signup logic to authService
		const { user, cookiesToSet } = await authService.signUp({
			first_name,
			last_name,
			email,
			password,
			idToken,
		});

		// Set cookies
		cookies.apply(res, cookiesToSet);

		// Send success response
		return res.status(201).json({ success: true, data: user });
	}),
);

// @route   POST /api/auth/logout
// @desc    Log out
// @access  Public (no auth yet)
router.post(
	'/logout',
	asyncHandler(async (req, res) => {
		// Clear cookies
		cookies.clearAllCookies(req, res);

		// Send response
		return res.status(200).json({ message: 'Logged out successfully.' });
	}),
);

// @route   POST /api/auth/edit-login
// @desc    Change email or password
// @access  Public (no auth yet)
router.post(
	'/edit-login',
	validate(EditLoginSchema),
	asyncHandler(async (req, res) => {
		const { message, user, cookiesToSet } = await authService.editLogin(
			req.validated,
		);

		if (cookiesToSet) cookies.apply(res, cookiesToSet);

		res.status(200).json({ success: true, message, data: user });
	}),
);

// @route   POST /api/auth/set-business
// @desc    Get a user
// @access  Public (no auth yet)
router.post(
	'/set-business',
	validate(SetBusinessSchema),
	asyncHandler(async (req, res) => {
		const { type, businessId } = req.validated;
		const { email } = req.cookies;

		const { cookiesToSet, response } =
			await businessMembershipService.assignUserToBusiness(
				email,
				businessId,
				type,
			);

		cookies.apply(res, cookiesToSet);

		res.status(200).json({ success: true, data: response });
	}),
);

module.exports = router;
