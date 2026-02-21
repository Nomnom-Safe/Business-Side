// client/src/hooks/useAuthActions.js

import { useNavigate } from 'react-router-dom';
import getCookie from '../utils/cookies.jsx';
import api from '../api';

export function useAuthActions() {
	const navigate = useNavigate();

	// Centralized error handler
	const handleApiError = (result, onError, fallbackMessage) => {
		const message = result?.message || fallbackMessage;
		onError(message);
	};

	// Build Sign Up Payload (moved from SignUpForm)
	const buildSignUpPayload = (values) => ({
		first_name: values.first_name,
		last_name: values.last_name,
		email: values.email,
		password: values.password,
		business_id: '',
		menu_item_layout: 0,
		admin: true,
	});

	// Build Sign In Payload
	const buildSignInPayload = (values) => ({
		email: values.email,
		password: values.password,
	});

	// Sign Up
	const signUp = async (values, onError) => {
		const payload = buildSignUpPayload(values);

		try {
			const result = await api.auth.signUp(payload);

			if (result.ok) {
				localStorage.setItem('justSignedUp', 'true');
				navigate('/choose-business');
			} else {
				handleApiError(result, onError, 'Sign up failed.');
			}
		} catch (err) {
			console.error('Sign up failed:', err);
			onError('Unexpected error during sign up.');
		}
	};

	// Sign In
	const signIn = async (values, onError) => {
		const payload = buildSignInPayload(values);

		try {
			const result = await api.auth.signIn(payload);

			if (result.ok) {
				const data = result.data || {};

				if (data.business_id) {
					localStorage.setItem('businessId', data.business_id);
				}

				// Centralized business logic
				const hasBusiness = getCookie('hasBusiness') === 'true';
				navigate(hasBusiness ? '/dashboard' : '/choose-business');
			} else {
				handleApiError(result, onError, 'Sign in failed.');
			}
		} catch (err) {
			console.error('Sign in failed:', err);
			onError('Unexpected error during sign in.');
		}
	};

	return { signUp, signIn };
}
