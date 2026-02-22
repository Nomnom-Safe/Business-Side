// client/src/utils/authValidation.js

import format from '../utils/formValidation.js';

export function validateSignUp(form) {
	const email = form.email.value;
	const password = form.password.value;
	const confirm = form.confirmPassword.value;

	if (!format.validateEmail(email)) {
		return 'Invalid email format.';
	}

	if (password !== confirm) {
		return 'Passwords do not match.';
	}

	if (!format.validatePassword(password)) {
		return 'Password must be at least 6 characters long.';
	}

	return null;
}

export function validateSignIn(form) {
	// Add rules if needed later
	return null;
}
