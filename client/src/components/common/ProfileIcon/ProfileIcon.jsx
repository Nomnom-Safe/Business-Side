import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from '../../../assets/icons/avatar.png';
import editLoginIcon from '../../../assets/icons/edit_login.png';
import editBusinessIcon from '../../../assets/icons/edit_business.png';
import logoutIcon from '../../../assets/icons/logout.png';
// ARCHIVED: Admin Features - Not part of MVP (single user per business)
// import userMaintenanceIcon from '../../../assets/icons/user-maintenance.png';
import getCookie from '../../../utils/cookies';
import './ProfileIcon.scss';

export default function ProfileIcon() {
	const navigate = useNavigate();
	const isAdmin = getCookie('isAdmin') === 'true';
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

	const toEditLoginInfo = (event) => {
		event.preventDefault();
		setIsOpen(false);
		navigate('/edit-login-info');
	};

	const toEditBusinessInfo = (event) => {
		event.preventDefault();
		setIsOpen(false);
		navigate('/edit-business-info');
	};

	const logout = async (event) => {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:5000/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
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

					{/* ARCHIVED: Admin Features - Not part of MVP (single user per business) */}
					{/* {isAdmin && hasBusiness ? (
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
					)} */}

						{hasBusiness ? (
							<>
								<div
									onClick={toEditLoginInfo}
									className='dropdown-item'
								>
									<img
										src={editLoginIcon}
										alt='Edit Login'
									/>
									<span>Edit Login Info</span>
								</div>

								<div
									onClick={toEditBusinessInfo}
									className='dropdown-item'
								>
									<img
										src={editBusinessIcon}
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
