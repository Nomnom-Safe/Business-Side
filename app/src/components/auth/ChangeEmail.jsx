import '../../scss/auth.scss';

function ChangeEmail() {
	return (
		<>
			<div className='form-field-container'>
				<label htmlFor='currentEmail'>
					Current Email <span className='required'>*</span>
				</label>

				<input
					type='email'
					name='currentEmail'
					required
					maxLength={50}
					placeholder='Current Email'
					className='current-email'
				/>
			</div>

			<div className='form-field-container'>
				<label htmlFor='newEmail'>
					New Email <span className='required'>*</span>
				</label>

				<input
					type='email'
					name='newEmail'
					required
					maxLength={50}
					placeholder='New Email'
					className='new-email'
				/>
			</div>

			<div className='form-field-container'>
				<label htmlFor='confirmNewEmail'>
					Confirm New Email <span className='required'>*</span>
				</label>

				<input
					type='email'
					name='confirmNewEmail'
					required
					maxLength={50}
					placeholder='Confirm New Email'
					className='new-email'
				/>
			</div>
		</>
	);
}

export default ChangeEmail;
