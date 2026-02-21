// client/src/hooks/useEditLoginInfo.js

import { useState } from 'react';
import getCookie from '../utils/cookies.jsx';
import format from '../utils/formValidation.js';
import api from '../api';

export function useEditLoginInfo() {
	const [message, setMessage] = useState('');
	const [showError, setShowError] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);

	const validate = (option, form) => {
		const cookieEmail = getCookie('email');

		if (option === 'email') {
			const current = form.currentEmail.value;
			const next = form.newEmail.value;
			const confirm = form.confirmNewEmail.value;

			if (cookieEmail !== current) return 'Current email is incorrect.';
			if (next !== confirm) return 'Emails do not match.';
			if (next === current) return 'New email must be different.';
		}

		if (option === 'password') {
			const current = form.currentPassword.value;
			const next = form.newPassword.value;
			const confirm = form.confirmNewPassword.value;

			if (next !== confirm) return 'Passwords do not match.';
			if (!format.validatePassword(next))
				return 'Password must be at least 6 characters.';
		}

		return null;
	};

	const save = async (option, form) => {
		const error = validate(option, form);
		if (error) {
			setMessage(error);
			setShowError(true);
			return;
		}

		const cookieEmail = getCookie('email');
		const newCred =
			option === 'email' ? form.newEmail.value : form.newPassword.value;

		const currentCred =
			option === 'password' ? form.currentPassword.value : undefined;

		const formData = {
			email: cookieEmail,
			newLoginDetails:
				option === 'email'
					? { email: newCred }
					: { password: newCred, currentPassword: currentCred },
		};

		try {
			const result = await api.auth.editLogin(formData);

			if (result.ok) {
				setMessage(result.message || 'Login information changed successfully.');
				setShowConfirmation(true);
			} else {
				setMessage(result.message || 'Failed to update login information.');
				setShowError(true);
			}
		} catch (err) {
			console.error('Error:', err.message);
		}
	};

	return {
		message,
		showError,
		setShowError,
		showConfirmation,
		save,
	};
}
