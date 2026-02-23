import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../../../assets/icons/avatar.png';
import editIcon from '../../../assets/icons/edit.png';
import logoutIcon from '../../../assets/icons/logout.png';
import accountIcon from '../../../assets/icons/account.png';
// ARCHIVED: Admin Features - Not part of MVP (single user per business)
// import userMaintenanceIcon from '../../../assets/icons/user-maintenance.png';
import getCookie from '../../../utils/cookies';
import api from '../../../api';
import './ProfileIcon.scss';

export default function ProfileIcon() {
	const navigate = useNavigate();
	// ARCHIVED: Admin Features - Not part of MVP (single user per business)
	// const isAdmin = getCookie('isAdmin') === 'true';
	const hasBusiness = getCookie('hasBusiness') === 'true';

	// Define states
	const [isOpen, setIsOpen] = useState(false);
	const [confirmation, setConfirmation] = useState(false);

	const toggleDropdown = () => setIsOpen(!isOpen);

	// ARCHIVED: Admin Features - Not part of MVP (single user per business)
	// const toUserMaintenance = (event) => {
	// 	event.preventDefault();
	// 	setIsOpen(false);
	// 	navigate('/user-maintenance');
	// };

	const toAccountDetails = (event) => {
		event.preventDefault();
		setIsOpen(false);
		navigate('/account');
	};

	const toEditBusinessInfo = (event) => {
		event.preventDefault();
		setIsOpen(false);
		navigate('/edit-business-info');
	};

	const logout = async (event) => {
		event.preventDefault();

		try {
			const result = await api.auth.logout();

			if (result.ok) {
				setIsOpen(false);
				setConfirmation(true);
			} else {
				console.log('Response from server not ok');
			}
		} catch (err) {
			console.error(err);
		}
	};

	const toLogin = (event) => {
		event.preventDefault();
		setConfirmation(false);
		navigate('/');
	};

	return (
		<>
			{confirmation ? (
				<div className='confirmation-container'>
					You have been logged out successfully.
					<button
						type='button'
						onClick={toLogin}
						className='button'
					>
						Ok
					</button>
				</div>
			) : (
				<></>
			)}

			<div className='profile-icon-container'>
				<img
					src={avatar}
					alt='User Profile'
					className='avatar-icon'
					onClick={toggleDropdown}
				/>

				{isOpen && (
					<div className='dropdown-menu'>
						<div className='dropdown-user-info'>
							<span>{getCookie('fullName')}</span>
							<span>{getCookie('email')}</span>
						</div>

						{/* ARCHIVED: Admin Features - Not part of MVP (single user per business) 
							{isAdmin && hasBusiness ? (
								<div
									onClick={toUserMaintenance}
									className='dropdown-item'
								>
									<img
										src={userMaintenanceIcon}
										alt='User Maintenance Icon'
									/>
									<span>User Maintenance</span>
								</div>
							) : (
								<></>
							)}
						*/}

						{hasBusiness ? (
							<>
								<div
									onClick={toAccountDetails}
									className='dropdown-item'
								>
									<img
										src={accountIcon}
										alt='Account Details'
									/>
									<span>Account Details</span>
								</div>

								<div
									onClick={toEditBusinessInfo}
									className='dropdown-item'
								>
									<img
										src={editIcon}
										alt='Edit Business'
									/>
									<span>Edit Business Info</span>
								</div>
							</>
						) : (
							<></>
						)}

						<div
							onClick={logout}
							className='dropdown-item'
						>
							<img
								src={logoutIcon}
								alt='Logout'
							/>
							<span>Log Out</span>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
