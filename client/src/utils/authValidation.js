// client/src/utils/authValidation.js

import format from '../utils/formValidation.js';

export function validateSignUp(form) {
	const email = form.email.value;
	const password = form.password.value;
	const confirm = form.confirmPassword.value;

	if (!format.validateEmail(email)) {
		return 'Invalid email format.';
	}

	if (password.length < 8) {
		return 'Password must be at least 8 characters.';
	}

	if (!/[A-Z]/.test(password)) {
		return 'Password must contain at least one uppercase letter.';
	}

	if (!/[a-z]/.test(password)) {
		return 'Password must contain at least one lowercase letter.';
	}

	if (!/[0-9]/.test(password)) {
		return 'Password must contain at least one number.';
	}

	if (password !== confirm) {
		return 'Passwords do not match.';
	}

	return null;
}

export function validateSignIn(form) {
	// Add rules if needed later
	return null;
}
