// client/src/components/account/AccountDetails/AccountDetails.jsx

import './AccountDetails.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import editIcon from '../../../assets/icons/edit.png';
import DetailRow from './DetailRow/DetailRow.jsx';
import useAccountDetails from '../../../hooks/useAccountDetails.js';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.jsx';

function AccountDetails() {
	const navigate = useNavigate();
	const { firstName, lastName, email } = useAccountDetails();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// small initial loading state while reading cookies
		setIsLoading(false);
	}, []);

	return (
		<div className='account-details'>
			{isLoading ? <LoadingSpinner text='Loading account...' /> : null}
			<div className='account-details__header'>
				<h1>Account Details</h1>
			</div>

			<div className='account-details__card'>
				<div className='detail-rows-container'>
					<DetailRow
						label='First Name'
						value={firstName}
					/>
					<DetailRow
						label='Last Name'
						value={lastName}
					/>
					<DetailRow
						label='Email'
						value={email}
					/>
				</div>

				<div>
					<button
						className='account-details__edit-btn'
						title='Edit account'
						onClick={() => navigate('/account/edit')}
					>
						<img
							src={editIcon}
							alt='Edit Business'
						/>
					</button>
				</div>
			</div>
		</div>
	);
}

export default AccountDetails;
