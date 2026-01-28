import GetPasswordField from '../Password/Password';

function ChangePassword() {
	return (
		<>
			<div>
				<GetPasswordField
					name='currentPassword'
					placeholder='Current Password'
				/>
			</div>

			<div>
				<GetPasswordField
					name='newPassword'
					placeholder='New Password'
				/>
			</div>

			<div>
				<GetPasswordField
					name='confirmNewPassword'
					placeholder='Confirm New Password'
				/>
			</div>
		</>
	);
}

export default ChangePassword;
