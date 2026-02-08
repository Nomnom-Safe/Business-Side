const express = require('express');
const router = express.Router();
const cookies = require('../utils/cookies');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const businessService = require('../services/businessService');

// @route   POST /api/auth/signin
// @desc    Get a user
// @access  Public (no auth yet)
router.post('/signin', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			// Email or password is missing
			return res.status(400).json({
				error: 'Email and password are required',
				message: 'Email and password are required.',
			});
		}

		const foundUser = await userService.getUserByEmail(email);

		if (!foundUser) {
			// Email is wrong or doesn't exist
			return res.status(401).json({
				error: 'Invalid email',
				message: 'Invalid email.',
			});
		}

		// Check that the password is correct
		const passwordMatches = await bcrypt.compare(password, foundUser.password);

		if (!passwordMatches) {
			// Password is wrong
			return res.status(401).json({
				error: 'Password is incorrect',
				message: 'Password is incorrect.',
			});
		}

		// Extract id token from request (client may provide it after Firebase sign-in)
		const idToken =
			req.body.idToken ||
			(req.get('Authorization') || '').replace('Bearer ', '') ||
			null;

		// Set cookies (include token if provided)
		cookies.setCookies(res, foundUser, idToken ? { token: idToken } : {});

		// Get business name
		if (foundUser.business_id === '') {
			cookies.updateCookie(res, 'hasBusiness', false);
		} else {
			const foundBusiness = await businessService.getBusinessById(
				foundUser.business_id,
			);

			if (!foundBusiness) {
				// Business does not exist
				cookies.updateCookie(res, 'hasBusiness', false);
				return res.status(401).json({
					error: 'Business not found',
					message:
						'The business associated with your account may have been deleted.\nPlease create a new business or join a different one.',
				});
			}

			if (foundBusiness.name === 'New Business') {
				cookies.updateCookie(res, 'hasBusiness', false);
			}
		}

		// Send success response w/ user's data
		return res.status(200).json(foundUser);
	} catch (err) {
		return res.status(500).json({
			error: 'Could not fetch user' + err.message,
			message: 'Could not fetch user.',
		});
	}
});

// @route   POST /api/auth/signup
// @desc    Create a new user
// @access  Public (no auth yet)
router.post('/signup', async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;

		if (!first_name || !last_name || !email || !password) {
			// One of the fields is missing
			return res.status(401).json({
				error: 'All fields are required',
				message: 'All fields are required.',
			});
		}

		// Get User document from the DB if the email already exists
		const userExists = await userService.getUserByEmail(email);

		if (userExists) {
			// Email already exists in DB
			return res.status(401).json({
				error: 'An account with the provided email already exists',
				message: 'An account with the provided email already exists.',
			});
		}

		// Create new User document from request body

		const newUser = {
			first_name,
			last_name,
			email,
			password,
			business_id: '',
			menu_item_layout: 0,
			admin: false,
		};

		// Save new user to Firestore
		const savedUser = await userService.createUser(newUser);

		if (!savedUser) {
			// User was not saved
			return res.status(401).json({
				error: 'Error saving user',
				message: 'Error saving user.',
			});
		}

		// Extract id token if provided by client
		const idToken =
			req.body.idToken ||
			(req.get('Authorization') || '').replace('Bearer ', '') ||
			null;

		// Set cookies (include token if provided)
		cookies.setCookies(res, savedUser, idToken ? { token: idToken } : {});

		// Send response
		return res.status(201).json(savedUser);
	} catch (err) {
		res.status(401).json({
			error: 'Error creating user: ' + err.message,
		});
	}
});

// @route   POST /api/auth/logout
// @desc    Log out
// @access  Public (no auth yet)
router.post('/logout', async (req, res) => {
	try {
		// Clear cookies
		cookies.clearAllCookies(req, res);

		// Send response
		return res.status(200).json({ message: 'Logged out successfully.' });
	} catch (err) {
		res.status(400).json({
			error: 'Error logging out: ' + err.message,
		});
	}
});

// @route   POST /api/auth/edit-login
// @desc    Change email or password
// @access  Public (no auth yet)
router.post('/edit-login', async (req, res) => {
	try {
		const { credType, currentCred, newCred } = req.body;
		const { email: currentEmail } = req.cookies;

		// Check if any data is missing
		if (!credType || !newCred || !currentCred) {
			return res.status(401).json({
				error: 'All fields are required',
				message: 'All fields are required.',
			});
		}

		// Handle email change
		if (credType === 'email') {
			// Check that the new email does not already exist in the DB
			const emailExists = await userService.getUserByEmail(newCred);

			if (emailExists) {
				// Email already exists in the DB
				return res.status(400).json({
					error: 'Email already exists',
					message: 'Email already exists.',
				});
			}

			// Update the user's email in the DB
			const updatedUser = await userService.updateUserByEmail(currentEmail, {
				email: newCred,
			});

			if (updatedUser && updatedUser.email !== newCred) {
				// Email was not saved to the DB
				return res.status(400).json({
					error: 'Error saving email',
					message: 'Error saving email.',
				});
			}

			// Update the email cookie
			cookies.updateCookie(res, 'email', newCred);

			// Send success response
			return res.status(200).json({
				message: 'Email changed successfully.',
			});
		}

		// Handle password change
		if (credType === 'password') {
			// Get User document from the DB
			const user = await userService.getUserByEmail(currentEmail);

			if (!user) {
				// Email does not exist in the DB
				return res.status(400).json({
					error: 'User not found',
					message: 'User not found.',
				});
			}

			// Check that the current password is correct
			const currentMatchesDb = await bcrypt.compare(currentCred, user.password);

			if (!currentMatchesDb) {
				// Current password is incorrect
				return res.status(400).json({
					error: 'Current password is incorrect',
					message: 'Current password is incorrect.',
				});
			}

			// Check that the new password is not the same as the current password
			if (newCred === currentCred) {
				return res.status(400).json({
					error: `New ${credType} must be different from current ${credType}`,
					message: `New ${credType} must be different from current ${credType}.`,
				});
			}

			// Change and save user password (hashing handled by service)
			await userService.updateUserByEmail(currentEmail, { password: newCred });

			// Send response
			return res.status(200).json({
				message: 'Password changed successfully.',
			});
		}

		// Invalid credential was given
		return res.status(400).json({
			error: 'Credential cannot be changed',
			message: 'Credential cannot be changed.',
		});
	} catch (err) {
		res.status(400).json({
			error: 'Error changing login info: ' + err.message,
			message: 'Error changing login info.',
		});
	}
});

// @route   POST /api/auth/set-business
// @desc    Get a user
// @access  Public (no auth yet)
router.post('/set-business', async (req, res) => {
	try {
		const { type, business_id } = req.body;
		const { email } = req.cookies;

		if (!business_id) {
			return res.status(400).json({
				error: 'A business is required',
				message: 'A business is required.',
			});
		}

		const foundBusiness = await businessService.getBusinessById(business_id);

		if (!foundBusiness) {
			return res.status(401).json({
				error: 'Invalid business',
				message: 'Invalid business.',
			});
		}

		var updatedUser;

		try {
			if (type === 'existing') {
				updatedUser = await userService.updateUserByEmail(email, {
					business_id: business_id,
					admin: false,
				});
			} else if (type === 'new') {
				updatedUser = await userService.updateUserByEmail(email, {
					business_id: business_id,
					admin: true,
				});
			}
		} catch (err) {
			console.error('Error updating user:', err);
		}

		if (!updatedUser) {
			return res.status(401).json({
				error: 'Could not add user to the business',
				message: 'Could not add user to the business.',
			});
		}

		// Set cookies
		if (type === 'existing') {
			cookies.updateCookie(res, 'hasBusiness', true);
			cookies.updateCookie(res, 'isAdmin', false);
		} else if (type === 'new') {
			cookies.updateCookie(res, 'hasBusiness', false);
			cookies.updateCookie(res, 'isAdmin', updatedUser.admin);
		}

		if (type === 'existing') {
			// Include business_id in response
			res.status(200).json({
				message: `You have been added to ${foundBusiness.name} successfully.`,
				business_id: foundBusiness.id,
			});
		} else if (type === 'new') {
			res.status(200).json({ message: 'Business template created.' });
		}
	} catch (err) {
		res.status(500).json({
			error: 'An error occurred: ' + err,
			message: 'An error occurred.',
		});
	}
});

module.exports = router;
