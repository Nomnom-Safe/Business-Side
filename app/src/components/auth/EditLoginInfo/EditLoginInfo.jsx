import { useState } from 'react';
import ChangeEmail from '../ChangeEmail/ChangeEmail.jsx';
import ChangePassword from '../ChangePassword/ChangePassword.jsx';
import GetConfirmationMessage from '../../ConfirmationMessage.jsx';
import ErrorMessage from '../../ErrorMessage.jsx';
import getCookie from '../../../utils/cookies.jsx';
import format from '../../../utils/form-validation.js';
import './EditLoginInfo.scss';
import { useNavigate } from 'react-router-dom';

function EditLoginInfo() {
	const [option, setOption] = useState('');
	const [message, setMessage] = useState('');
	const [showError, setShowError] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const navigate = useNavigate();

	const getEditLoginForm = (option) => {
		switch (option) {
			case 'email':
				return <ChangeEmail />;
			case 'password':
				return <ChangePassword />;
			default:
				return <></>;
		}
	};

	const save = async (event) => {
		event.preventDefault();
		var proceed = false;
		const form = event.target;
		const cookieEmail = getCookie('email');
		var newCred;
		var confirmNewCred;
		var currentCred;

		if (option === 'email') {
			newCred = form.newEmail.value;
			confirmNewCred = form.confirmNewEmail.value;
			currentCred = form.currentEmail.value;

			if (cookieEmail !== currentCred) {
				setMessage('Current email is incorrect.');
				setShowError(true);
			} else if (newCred !== confirmNewCred) {
				setMessage('Emails do not match.');
				setShowError(true);
			} else if (newCred === currentCred) {
				setMessage('New email must be different from current email.');
				setShowError(true);
			} else {
				proceed = true;
			}
		} else if (option === 'password') {
			newCred = form.newPassword.value;
			confirmNewCred = form.confirmNewPassword.value;
			currentCred = form.currentPassword.value;

			if (newCred !== confirmNewCred) {
				setMessage('Passwords do not match.');
				setShowError(true);
			} else if (!format.validatePassword(newCred)) {
				setMessage('Password must be at least 6 characters long.');
				setShowError(true);
			} else {
				proceed = true;
			}
		}

		if (proceed) {
			const formData = {
				credType: option,
				currentCred: currentCred,
				newCred: newCred,
			};

			try {
				const response = await fetch(
					'http://localhost:5000/api/auth/edit-login',
					{
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(formData),
					},
				);

				const result = await response.json();

				if (response.ok) {
					setMessage(result.message);
					setShowConfirmation(true);
				} else {
					setMessage(result.message);
					setShowError(true);
				}
			} catch (err) {
				console.error('Error: ', err.message);
			}
		}
	};

	return (
		<div className='edit-login-info-page-container'>
			{showConfirmation ? (
				<GetConfirmationMessage
					message={`Login ${option} changed successfully.`}
					destination='/dashboard'
				/>
			) : (
				<></>
			)}

			{showError ? (
				<ErrorMessage
					message={message}
					destination={false}
					onClose={() => setShowError(false)}
				/>
			) : (
				<></>
			)}

			<h1>
				<button
					onClick={() => {
						navigate('/dashboard');
					}}
					className='button gray-btn back-btn'
				>
					Back to Dashboard
				</button>
				Edit Login Information
			</h1>

			<div className='edit-login-info-form-container'>
				<form
					name='editLoginInfoForm'
					method='POST'
					onSubmit={save}
					className='edit-login-info-form'
				>
					<div>
						<span className='question'>Which would you like to change?</span>

						<div>
							<label
								key='email'
								className='radio-label'
							>
								<input
									type='radio'
									name='editLoginInfo'
									value='email'
									onChange={() => setOption('email')}
								/>
								Email
							</label>

							<label
								key='password'
								className='radio-label'
							>
								<input
									type='radio'
									name='editLoginInfo'
									value='password'
									onChange={() => setOption('password')}
								/>
								Password
							</label>
						</div>
					</div>

					<div className='edit-login-info-container'>
						{getEditLoginForm(option)}

						{option ? (
							<button
								type='submit'
								className='save-btn button'
							>
								Save
							</button>
						) : (
							<></>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditLoginInfo;
