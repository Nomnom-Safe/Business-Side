// client/src/components/auth/ChangeEmail/ChangeEmail.jsx

import './ChangeEmail.scss';
import FormField from '../../common/FormField/FormField.jsx';

function ChangeEmail() {
	return (
		<>
			<FormField
				label='Current Email'
				name='currentEmail'
				type='email'
				placeholder='Current Email'
				required={true}
				maxLength={50}
				className='email'
			/>

			<FormField
				label='New Email'
				name='newEmail'
				type='email'
				placeholder='New Email'
				required={true}
				maxLength={50}
				className='email'
			/>

			<FormField
				label='Confirm New Email'
				name='confirmNewEmail'
				type='email'
				placeholder='Confirm New Email'
				required={true}
				maxLength={50}
				className='email'
			/>
		</>
	);
}

export default ChangeEmail;
