import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import './GetAuthForm.scss';
import GetPasswordField from '../Password/Password.jsx';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage.jsx';
import format from '../../../utils/formValidation.js';
import getCookie from '../../../utils/cookies.jsx';
import api from '../../../api';

function GetAuthForm({ formName }) {
	const navigate = useNavigate();
	const [message, setMessage] = useState('Something went wrong');
	const [showError, setShowError] = useState(false);

	const checkCredentials = async (event) => {
		event.preventDefault();
		const form = event.target;

		if (formName === 'signUpForm') {
			const validEmail = format.validateEmail(form.email.value);

			if (!validEmail) {
				setMessage('Invalid email format.');
				setShowError(true);
			} else {
				const passwordsMatch =
					form.password.value === form.confirmPassword.value;

				const validPassword = format.validatePassword(form.password.value);

				if (!passwordsMatch) {
					setMessage('Passwords do not match.');
					setShowError(true);
				} else if (!validPassword) {
					setMessage('Password must be at least 6 characters long.');
					setShowError(true);
				} else {
					await signUp(form);
				}
			}
		} else if (formName === 'signInForm') {
			await logIn(form);
		}
	};

	const signUp = async (form) => {
		const formData = {
			first_name: form.first_name.value,
			last_name: form.last_name.value,
			email: form.email.value,
			password: form.password.value,
			business_id: '',
			menu_item_layout: 0,
			admin: true,
		};

		try {
			const result = await api.auth.signUp(formData);

			if (result.ok) {
				localStorage.setItem('justSignedUp', 'true');
				navigate('/choose-business');
			} else {
				setMessage(result.message || 'Sign up failed.');
				setShowError(true);
			}
		} catch (err) {
			console.error('Error: ', err.message);
		}
	};

	// Logs a user in
	const logIn = async (form) => {
		const formData = {
			email: form.email.value,
			password: form.password.value,
		};

		try {
			const result = await api.auth.signIn(formData);

			if (result.ok) {
				const data = result.data || {};
				// Store business_id if it exists
				if (data.business_id) {
					localStorage.setItem('businessId', data.business_id);
				}

				if (getCookie('hasBusiness') === 'false') {
					navigate('/choose-business');
				} else {
					navigate('/dashboard');
				}
			} else {
				setMessage(result.message || 'Sign in failed.');
				setShowError(true);
			}
		} catch (err) {
			console.error('Error: ', err.message);
		}
	};

	return (
		<form
			name={formName}
			onSubmit={checkCredentials}
			method='POST'
			className='auth-form'
		>
			{showError ? (
				<ErrorMessage
					message={message}
					destination={
						getCookie('hasBusiness') === 'true' ? false : '/choose-business'
					}
					onClose={() => setShowError(false)}
				/>
			) : (
				<></>
			)}

			<h2
				className={formName === 'signUpForm' ? ' sign-up-title' : 'login-title'}
			>
				NomNom Safe
			</h2>

			{formName === 'signUpForm' ? (
				<>
					<div className='form-field-container'>
						<label htmlFor='first_name'>
							First Name <span className='required'>*</span>
						</label>

						<input
							type='text'
							name='first_name'
							placeholder='First Name'
							required
							className='name'
						/>
					</div>

					<div className='form-field-container'>
						<label htmlFor='last_name'>
							Last Name <span className='required'>*</span>
						</label>

						<input
							type='text'
							name='last_name'
							placeholder='Last Name'
							required
							className='name'
						/>
					</div>
				</>
			) : (
				<></>
			)}

			<div className='form-field-container'>
				<label htmlFor='email'>
					Email <span className='required'>*</span>
				</label>

				<input
					type='text'
					name='email'
					placeholder='johndoe@mail.com'
					required
					className='email'
				/>
			</div>

			<GetPasswordField
				name='password'
				placeholder='Password'
			/>

			{/* dynamically generates:
            Confirm Password field and Sign Up button for Sign Up form
            Log In button for Sign In form */}
			{formName === 'signUpForm' ? (
				<>
					<GetPasswordField
						name='confirmPassword'
						placeholder='Confirm Password'
					/>

					<button
						type='submit'
						className='sign-up-btn button'
					>
						Sign Up
					</button>
				</>
			) : (
				<button
					type='submit'
					className='sign-in-btn button'
				>
					Log In
				</button>
			)}
		</form>
	);
}

// Prop validation
GetAuthForm.propTypes = {
	formName: PropTypes.string.isRequired,
};

export default GetAuthForm;
