// client/src/components/auth/GetAuthForm/SignUpForm/SignUpForm.jsx

import { useState } from 'react';
import './SignUpForm.scss';

import FormField from '../../../common/FormField/FormField.jsx';
import PasswordFormField from 'client/src/components/common/PasswordFormField/PasswordFormField.jsx';
import ErrorMessage from '../../../common/ErrorMessage/ErrorMessage.jsx';

import { useAuthActions } from '../../../../hooks/useAuthActions.js';
import { validateSignUp } from '../../../../utils/authValidation.js';
import getCookie from '../../../../utils/cookies.jsx';

function SignUpForm() {
	const { signUp } = useAuthActions();

	const [message, setMessage] = useState('');
	const [showError, setShowError] = useState(false);

	const handleError = (msg) => {
		setMessage(msg);
		setShowError(true);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;

		const error = validateSignUp(form);
		if (error) return handleError(error);

		const values = {
			first_name: form.first_name.value,
			last_name: form.last_name.value,
			email: form.email.value,
			password: form.password.value,
			menu_item_layout: 0,
			admin: true,
		};

		await signUp(values, handleError);
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
					destination={
						getCookie('hasBusiness') === 'true' ? false : '/choose-business'
					}
					onClose={() => setShowError(false)}
				/>
			)}

			<h2 className='auth-form-title'>NomNom Safe</h2>

			<FormField
				label='First Name'
				name='first_name'
				placeholder='First Name'
				required={true}
				className={'name'}
			/>

			<FormField
				label='Last Name'
				name='last_name'
				placeholder='Last Name'
				required={true}
				className={'name'}
			/>

			<FormField
				label='Email'
				name='email'
				placeholder='johndoe@mail.com'
				required={true}
				className={'name'}
			/>

			<PasswordFormField
				name='password'
				placeholder='Password'
			/>

			<PasswordFormField
				name='confirmPassword'
				placeholder='Confirm Password'
			/>

			<button
				type='submit'
				className='sign-up-btn button'
			>
				Sign Up
			</button>
		</form>
	);
}

SignUpForm.propTypes = {};

export default SignUpForm;
