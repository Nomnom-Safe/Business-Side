import './UserMaintenance.scss';
import AdminTable from '../AdminTable/AdminTable.jsx';
import GetConfirmationMessage from '../../common/ConfirmationMessage/ConfirmationMessage.jsx';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserMaintenance() {
	const [message, setMessage] = useState('Something went wrong');
	const [showError, setShowError] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const navigate = useNavigate();

	const addUserAccess = async (event) => {
		event.preventDefault();

		const form = event.target;
		const data = {
			email: form.userEmail.value,
			status: form.status.value,
		};

		try {
			const response = await fetch(
				'http://localhost:5000/api/admin/add-user-access',
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				},
			);
			const result = await response.json();

			setMessage(result.message);

			if (response.ok) {
				setShowConfirmation(true);
			} else {
				setShowError(true);
			}
		} catch (err) {
			console.error('Error:', err.message);
		}
	};

	return (
		<div className='admin-container'>
			{showConfirmation ? (
				<GetConfirmationMessage
					message={message}
					destination={0}
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

			<h1 className='admin-header'>
				<button
					onClick={() => {
						navigate('/dashboard');
					}}
					className='button gray-btn back-btn'
				>
					Back to Dashboard
				</button>
				User Maintenance
			</h1>

			<div className='user-maintenance-container'>
				<form
					name='addUserForm'
					method='POST'
					onSubmit={addUserAccess}
					className='add-user-form'
				>
					<div className='add-user-container'>
						<div className='question'>Add a user:</div>

						<div>
							<input
								type='email'
								name='userEmail'
								placeholder='User Email*'
								required
								maxLength={50}
								className='user-email'
							/>
						</div>
					</div>

					<div className='add-user-status-container'>
						<div className='question'>Select user status:</div>

						<label
							key='user'
							className='radio-label'
						>
							<input
								type='radio'
								name='status'
								value='user'
								required
							/>
							User
						</label>

						<label
							key='admin'
							className='radio-label'
						>
							<input
								type='radio'
								name='status'
								value='admin'
							/>
							Admin
						</label>
					</div>

					<button
						type='submit'
						className='button add-user-btn'
					>
						Add User
					</button>
				</form>

				<div className='admin-table-container'>
					<AdminTable />
				</div>
			</div>
		</div>
	);
}

export default UserMaintenance;
