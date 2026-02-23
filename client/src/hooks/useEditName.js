// client/src/hooks/useEditName.js

import { useState } from 'react';
import api from '../api';
import getCookie from '../utils/cookies.jsx';
import { parseFullName } from '../utils/parseFullName.js';

export function useEditName() {
	const fullName = getCookie('fullName') || '';
	const email = getCookie('email') || '';

	const [originalFirst, originalLast] = parseFullName(fullName);

	const [first, setFirst] = useState(originalFirst);
	const [last, setLast] = useState(originalLast);

	const [message, setMessage] = useState('');
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	const nameChanged =
		first.trim() !== originalFirst.trim() ||
		last.trim() !== originalLast.trim();

	const handleSave = async (e) => {
		e.preventDefault();
		setError(false);
		setSuccess(false);

		if (!nameChanged) {
			setMessage('No changes to save.');
			setError(true);
			return;
		}

		if (!first.trim()) {
			setMessage('First name is required.');
			setError(true);
			return;
		}

		try {
			const payload = {
				email,
				newLoginDetails: {
					first_name: first.trim(),
					last_name: last.trim(),
				},
			};

			const result = await api.auth.editLogin(payload);

			if (result.ok) {
				const newFullName = encodeURIComponent(
					first.trim() + (last.trim() ? ' ' + last.trim() : ''),
				);
				document.cookie = `fullName=${newFullName};path=/`;

				setMessage('Name updated successfully.');
				setSuccess(true);
			} else {
				setMessage(result.message || 'Failed to update name.');
				setError(true);
			}
		} catch (err) {
			console.error(err);
			setMessage('Failed to update name.');
			setError(true);
		}
	};

	return {
		first,
		last,
		setFirst,
		setLast,
		nameChanged,
		message,
		error,
		success,
		handleSave,
	};
}
