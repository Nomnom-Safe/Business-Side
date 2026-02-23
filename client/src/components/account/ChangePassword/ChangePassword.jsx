// client/src/components/account/ChangePassword/ChangePassword.jsx

import PasswordFormField from 'client/src/components/common/PasswordFormField/PasswordFormField.jsx';

function ChangePassword() {
	return (
		<>
			<div>
				<PasswordFormField
					name='currentPassword'
					placeholder='Current Password'
				/>
			</div>

			<div>
				<PasswordFormField
					name='newPassword'
					placeholder='New Password'
				/>
			</div>

			<div>
				<PasswordFormField
					name='confirmNewPassword'
					placeholder='Confirm New Password'
				/>
			</div>
		</>
	);
}

export default ChangePassword;
