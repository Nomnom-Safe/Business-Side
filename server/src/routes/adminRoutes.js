// ARCHIVED: Admin Features - Not part of MVP (single user per business)
/*
const express = require('express');
const router = express.Router();
const cookies = require('../utils/cookies');
const { authenticate } = require('../middleware/auth');
const userService = require('../services/userService');

// Returns the business_id of a user
const getBusinessId = async (email) => {
	const user = await userService.getUserByEmail(email);
	if (!user) return null;
	return user.business_id;
};

const checkConditions = async (action, targetEmail) => {
	// Get the business_id of the user being modified
	const business_id = await getBusinessId(targetEmail);

	// Count the number of admins in the business
	const admin_count = await userService.countAdmins(business_id);

	if (admin_count === 1 && (action === 'demote' || action === 'remove')) {
		return false;
	}

	return true;
};

// Protect admin routes with Firebase authentication
router.use(authenticate);

// @route   POST /api/admin/get-user-list
// @desc    Get a list of users w/ the same business_id
// @access  Protected
router.post('/get-user-list', async (req, res) => {
	try {
		const email = req.user && req.user.email;
		const business_id = await getBusinessId(email);

		if (business_id === null || !business_id) {
			// business_id or user does not exist
			return res.status(401).json({
				error: 'Business ID not found.',
			});
		}

		// Get array of users that have access to the business
		const usersRaw = await userService.getUsersByBusinessId(business_id);
		const users = (usersRaw || []).map((u) => ({
			first_name: u.first_name,
			last_name: u.last_name,
			email: u.email,
			status: u.admin ? 'admin' : 'user',
		}));

		if (users.length === 0) {
			// No users are associated with the business_id
			return res.status(401).json({
				error: 'No users found with the specified business ID.',
			});
		}

		// Send success response
		return res.status(200).json(users);
	} catch (err) {
		res.status(400).json({
			error: 'Error fetching user list: ' + err.message,
		});
	}
});

// @route   POST /api/admin/change-admin-status
// @desc    Change a user's admin status
// @access  Public (no auth yet)
router.post('/change-admin-status', async (req, res) => {
	try {
		const { action, targetEmail } = req.body;
		var admin = false;

		if (action !== 'promote' && action !== 'demote') {
			// The provided action is not allowed
			return res.status(400).json({
				error: `Unknown action: ${action}`,
				message: `Unknown action: ${action}.`,
			});
		}

		const conditionsMet = await checkConditions(action, targetEmail);

		if (!conditionsMet) {
			// Conditions are not met
			if (action === 'demote') {
				// Target user is the only admin of the business
				return res.status(400).json({
					error: 'At least one user must be an admin',
					message:
						'At least one user must be an admin. Promote another user to admin before demoting this user.',
				});
			}

			return res.status(400).json({
				error: 'Something went wrong',
				message: 'Something went wrong.',
			});
		}

		if (action === 'promote') {
			// User is being promoted to admin
			admin = true;
		}

		// Update the user's admin status
		const updatedUser = await userService.updateUserByEmail(targetEmail, {
			admin: admin,
		});

		if (!updatedUser || updatedUser.admin !== admin) {
			// Admin status was not updated in the DB
			return res.status(400).json({
				error: 'Error saving admin status',
				message: 'There was an error promoting user to admin.',
			});
		}

		// Set success repsonse message
		var message =
			action === 'promote'
				? 'Promoted user to admin successfully.'
				: 'Demoted admin to user successfully.';

		// Check if user is demoting theirself
		if (targetEmail === req.user.email) {
			// Update admin cookie
			cookies.updateCookie(res, 'isAdmin', admin);

			// Set success response message
			message = 'You have been demoted to user. Redirecting to your dashboard.';
		}

		// Send success response
		return res.status(200).json({ message: message });
	} catch (err) {
		res.status(400).json({
			error: 'Error changing admin status: ' + err.message,
		});
	}
});

// @route   POST /api/admin/remove-user-access
// @desc    Remove a user's access to a specific business
// @access  Public (no auth yet)
router.post('/remove-user-access', async (req, res) => {
	try {
		const business_id = await getBusinessId(req.user.email);
		const { email: targetEmail } = req.body;

		if (business_id === null || !business_id) {
			// business_id or user does not exist
			return res.status(400).json({
				error: `Business id not found. Business id: ${business_id}`,
				message: `Business id not found.`,
			});
		}

		const action = 'remove';
		const foundUser = await userService.getUserByEmail(targetEmail);

		if (!foundUser) {
			// User not found in the DB
			return res.status(400).json({
				error: `User not found`,
				message: `User not found.`,
			});
		}

		const conditionsMet = await checkConditions(action, targetEmail);

		if (!conditionsMet && foundUser.admin) {
			// Conditions are not met
			// Target user is the only admin of the business
			return res.status(400).json({
				error: 'At least one admin must be associated with the business',
				message:
					'At least one admin must be associated with the business. Add another user with admin status before removing your access.',
			});
		}

		const admin = false;

		// Remove user's business_id from the DB
		const updatedUser = await userService.updateUserByEmail(targetEmail, {
			business_id: '',
			admin: admin,
		});

		if (
			!updatedUser ||
			updatedUser.business_id !== '' ||
			updatedUser.admin !== admin
		) {
			// User's business_id was not removed from the DB
			return res.status(400).json({
				error: 'Error removing user access',
				message: 'Error removing user access.',
			});
		}

		// Check if user is removing their own access
		if (targetEmail === req.user.email) {
			// Update admin and hasBusiness cookies
			cookies.updateCookie(res, 'isAdmin', admin);
			cookies.updateCookie(res, 'hasBusiness', false);

			// Set success response message
			return res.status(200).json({
				message:
					'You have been demoted to user. Redirecting to your dashboard.',
			});
		}

		// Send success response
		return res.status(200).json({
			message: 'Removed user access successfully.',
		});
	} catch (err) {
		res.status(400).json({
			error: 'Error changing business id: ' + err.message,
		});
	}
});

// @route   POST /api/admin/add-user-access
// @desc    Add a user's access to a specific business
// @access  Public (no auth yet)
router.post('/add-user-access', async (req, res) => {
	try {
		const business_id = await getBusinessId(req.user.email);
		const { email: targetEmail, status } = req.body;

		if (!targetEmail || !status) {
			// Data is missing
			return res.status(400).json({
				error: 'All fields are required.',
				message: 'All fields are required.',
			});
		}

		const isAdmin = status === 'admin' ? true : false;

		if (business_id === null || !business_id) {
			// business_id or user does not exist
			return res.status(400).json({
				error: `Business id not found. Business id: ${business_id}`,
				message: `Business id not found. Business id: ${business_id}`,
			});
		}

		const foundUser = await userService.getUserByEmail(targetEmail);

		if (!foundUser) {
			return res.status(400).json({
				error: 'User does not exist',
				message: 'User does not exist.',
			});
		}

		if (foundUser.business_id === business_id) {
			return res.status(400).json({
				error: 'User already has access to the business',
				message: 'User already has access to the business.',
			});
		}

		if (
			foundUser.business_id !== '' &&
			foundUser.business_id !== 'New Business'
		) {
			return res.status(400).json({
				error: 'User has access to another business and cannot be added',
				message: 'User has access to another business and cannot be added.',
			});
		}

		// Update user's business_id & admin status in the DB
		const updatedUser = await userService.updateUserByEmail(targetEmail, {
			business_id: business_id,
			admin: isAdmin,
		});

		if (!updatedUser || updatedUser.business_id !== business_id) {
			// User's business_id and/or admin status was not changed in the DB
			return res.status(400).json({
				error: 'Error saving user access',
				message: 'Error saving user access.',
			});
		}

		// Send success response
		return res.status(200).json({
			message: 'User access added successfully.',
		});
	} catch (err) {
		res.status(400).json({
			error: 'Error adding user access: ' + err.message,
		});
	}
});

module.exports = router;
*/