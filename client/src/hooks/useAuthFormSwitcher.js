// client/src/hooks/useAuthFormSwitcher.js

import { useState, useCallback } from 'react';

export function useAuthFormSwitcher(initial = 'signUpForm') {
	const [formType, setFormType] = useState(initial);

	const isSignUpForm = formType === 'signUpForm';
	const isSignInForm = formType === 'signInForm';

	const showSignUpForm = useCallback(() => setFormType('signUpForm'), []);
	const showSignInForm = useCallback(() => setFormType('signInForm'), []);

	return {
		formType,
		isSignUpForm,
		isSignInForm,
		showSignUpForm,
		showSignInForm,
	};
}
