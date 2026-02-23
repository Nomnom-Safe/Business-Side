// client/src/components/account/AccountDetails/AccountDetails.jsx

import './AccountDetails.scss';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../../assets/icons/edit.png';
import DetailRow from './DetailRow/DetailRow.jsx';
import useAccountDetails from '../../../hooks/useAccountDetails.js';

function AccountDetails() {
	const navigate = useNavigate();
	const { firstName, lastName, email } = useAccountDetails();

	return (
		<div className='account-details'>
			<div className='account-details__header'>
				<h1>Account Details</h1>

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

			<div className='account-details__card'>
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
		</div>
	);
}

export default AccountDetails;
