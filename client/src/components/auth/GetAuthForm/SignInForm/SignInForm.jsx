// client/src/components/auth/GetAuthForm/SignInForm/SignInForm.jsx

import { useState } from 'react';
import './SignInForm.scss';

import FormField from '../../../common/FormField/FormField.jsx';
import PasswordFormField from 'client/src/components/common/PasswordFormField/PasswordFormField.jsx';
import ErrorMessage from '../../../common/ErrorMessage/ErrorMessage.jsx';

import { useAuthActions } from '../../../../hooks/useAuthActions.js';
import { validateSignIn } from '../../../../utils/authValidation.js';

function SignInForm() {
	const { signIn } = useAuthActions();

	const [message, setMessage] = useState('');
	const [showError, setShowError] = useState(false);

	const handleError = (msg) => {
		setMessage(msg);
		setShowError(true);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;

		const error = validateSignIn(form);
		if (error) return handleError(error);

		const values = {
			email: form.email.value,
			password: form.password.value,
		};

		await signIn(values, handleError);
	};

	return (
		<form
			onSubmit={handleSubmit}
			method='POST'
			className='auth-form'
		>
			{showError && (
				<ErrorMessage
					message={message}
					destination={false}
					onClose={() => setShowError(false)}
				/>
			)}

			<h2 className='auth-form-title'>NomNom Safe</h2>

			<FormField
				label='Email'
				name='email'
				placeholder='johndoe@mail.com'
				required={true}
				className={'email'}
			/>

			<PasswordFormField
				name='password'
				placeholder='Password'
			/>

			<button
				type='submit'
				className='sign-in-btn button'
			>
				Sign In
			</button>
		</form>
	);
}

SignInForm.propTypes = {};

export default SignInForm;
