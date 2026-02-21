import PasswordFormField from '../PasswordFormField/PasswordFormField';

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
