// server/src/routes/businessUserRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { validate } = require('../utils/validate');

const {
	SignUpSchema,
	EditLoginSchema,
	SetBusinessSchema,
	SignInSchema,
} = require('../schemas');

const businessUserController = require('../controllers/businessUserController');

// @route   POST /api/auth/signin
// @desc    Get a user
// @access  Public (no auth yet)
router.post(
	'/signin',
	validate(SignInSchema),
	asyncHandler(businessUserController.signIn),
);

// @route   POST /api/auth/signup
// @desc    Create a new user
// @access  Public (no auth yet)
router.post(
	'/signup',
	validate(SignUpSchema),
	asyncHandler(businessUserController.signUp),
);

// @route   POST /api/auth/logout
// @desc    Log out
// @access  Public (no auth yet)
router.post('/logout', asyncHandler(businessUserController.logout));

// @route   POST /api/auth/edit-login
// @desc    Change email or password
// @access  Public (no auth yet)
router.post(
	'/edit-login',
	validate(EditLoginSchema),
	asyncHandler(businessUserController.editLogin),
);

// @route   POST /api/auth/set-business
// @desc    Get a user
// @access  Public (no auth yet)
router.post(
	'/set-business',
	validate(SetBusinessSchema),
	asyncHandler(businessUserController.setBusiness),
);

module.exports = router;
