// services/authService.js
const bcrypt = require('bcrypt');
const userService = require('./businessUserService');
const businessService = require('./businessService');

class AuthError extends Error {
	constructor(code, message) {
		super(message || code);
		this.name = 'AuthError';
		this.code = code;
	}
}

async function signIn({ email, password, idToken }) {
	if (!email || !password) {
		throw new AuthError('Email and password are required');
	}

	const foundUser = await userService.getUserByEmail(email);
	if (!foundUser) {
		throw new AuthError('Invalid email');
	}

	const passwordMatches = await bcrypt.compare(password, foundUser.password);
	if (!passwordMatches) {
		throw new AuthError('Password is incorrect');
	}

	// Prepare cookies to set
	const cookiesToSet = {};
	if (idToken) {
		cookiesToSet.token = idToken;
	}

	if (!foundUser.business_id || foundUser.business_id === '') {
		cookiesToSet.hasBusiness = false;
	} else {
		const foundBusiness = await businessService.getBusinessById(
			foundUser.business_id,
		);
		cookiesToSet.hasBusiness = !(
			!foundBusiness || foundBusiness.name === 'New Business'
		);
	}

	cookiesToSet.email = foundUser.email;
	cookiesToSet.isAdmin = foundUser.admin;
	cookiesToSet.isAuthorized = true;
	cookiesToSet.fullName = foundUser.getFullName();

	return { user: foundUser, cookiesToSet };
}

async function signUp({ first_name, last_name, email, password, idToken }) {
	if (!first_name || !last_name || !email || !password) {
		throw new AuthError('FIELDS_REQUIRED', 'All fields are required.');
	}

	const userExists = await userService.getUserByEmail(email);
	if (userExists) {
		throw new AuthError(
			'EMAIL_EXISTS',
			'An account with the provided email already exists.',
		);
	}

	const newUser = {
		first_name,
		last_name,
		email,
		password,
		business_id: '',
		menu_item_layout: 0,
		admin: false,
	};

	const savedUser = await userService.createUser(newUser);
	if (!savedUser) {
		throw new AuthError('SAVE_FAILED', 'Error saving user.');
	}

	const cookiesToSet = {};
	if (idToken) {
		cookiesToSet.token = idToken;
	}

	cookiesToSet.email = savedUser.email;
	cookiesToSet.isAdmin = savedUser.admin;
	cookiesToSet.isAuthorized = true;
	cookiesToSet.hasBusiness = false;
	cookiesToSet.fullName = savedUser.getFullName();

	return { user: savedUser, cookiesToSet };
}

async function editLogin({ email, newLoginDetails }) {
	// Validate required fields
	if (!email || !newLoginDetails) {
		throw new AuthError(
			'FIELDS_REQUIRED',
			'Email and login details are required.',
		);
	}

	// Fetch user
	const user = await userService.getUserByEmail(email);
	if (!user) {
		throw new AuthError('USER_NOT_FOUND', 'User not found.');
	}

	// -------------------------------
	// PASSWORD CHANGE
	// -------------------------------
	if (newLoginDetails.password) {
		// Ensure currentPassword is present
		if (!newLoginDetails.currentPassword) {
			throw new AuthError(
				'CURRENT_PASSWORD_REQUIRED',
				'Current password is required to change your password.',
			);
		}

		// Compare current password
		const currentMatches = await bcrypt.compare(
			newLoginDetails.currentPassword,
			user.password,
		);

		if (!currentMatches) {
			throw new AuthError(
				'INCORRECT_CURRENT_PASSWORD',
				'Current password is incorrect.',
			);
		}

		// Prevent reusing the same password
		if (newLoginDetails.password === newLoginDetails.currentPassword) {
			throw new AuthError(
				'PASSWORD_SAME',
				'New password must be different from current password.',
			);
		}

		// Update password
		const updatedUser = await userService.updateUserByEmail(email, {
			password: newLoginDetails.password,
		});

		if (!updatedUser) {
			throw new AuthError('SAVE_FAILED', 'Failed to update password.');
		}

		return { message: 'Password changed successfully.', user: updatedUser };
	}

	// -------------------------------
	// EMAIL CHANGE
	// -------------------------------

	const updatedUser = await userService.updateUserByEmail(
		email,
		newLoginDetails,
	);

	if (!updatedUser) {
		throw new AuthError('SAVE_FAILED', 'Failed to update login information.');
	}

	// Prepare cookies if email changed
	const cookiesToSet = {};
	if (newLoginDetails.email) {
		cookiesToSet.email = updatedUser.email;
	}

	return {
		message: 'Login information updated successfully.',
		user: updatedUser,
		cookiesToSet:
			Object.keys(cookiesToSet).length > 0 ? cookiesToSet : undefined,
	};
}

module.exports = { signIn, signUp, editLogin, AuthError };
