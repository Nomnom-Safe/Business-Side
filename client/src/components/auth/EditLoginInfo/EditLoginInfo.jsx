// client/src/components/auth/EditLoginInfo/EditLoginInfo.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChangeEmail from '../ChangeEmail/ChangeEmail.jsx';
import ChangePassword from '../ChangePassword/ChangePassword.jsx';
import GetConfirmationMessage from '../../common/ConfirmationMessage/ConfirmationMessage.jsx';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage.jsx';

import { useEditLoginInfo } from '../../../hooks/useEditLoginInfo.js';
import './EditLoginInfo.scss';

function EditLoginInfo() {
	const [option, setOption] = useState('');
	const { message, showError, setShowError, showConfirmation, save } =
		useEditLoginInfo();

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

	const handleSubmit = (event) => {
		event.preventDefault();
		save(option, event.target);
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
					onSubmit={handleSubmit}
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
