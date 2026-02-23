// client/src/components/account/EditAccount/EditAccount.jsx

import './EditAccount.scss';
import ChangeEmail from '../ChangeEmail/ChangeEmail.jsx';
import ChangePassword from '../ChangePassword/ChangePassword.jsx';
import FormField from '../../common/FormField/FormField.jsx';
import GetConfirmationMessage from '../../common/ConfirmationMessage/ConfirmationMessage.jsx';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage.jsx';
import SaveButton from '../../common/SaveButton/SaveButton.jsx';
import EditSection from '../EditSection/EditSection.jsx';
import { useEditLoginInfo } from '../../../hooks/useEditLoginInfo.js';
import { useEditName } from '../../../hooks/useEditName.js';
import { useState } from 'react';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.jsx';

function EditAccount() {
	const {
		first,
		last,
		setFirst,
		setLast,
		nameChanged,
		message: nameMessage,
		error: nameError,
		success: nameSuccess,
		handleSave,
	} = useEditName();
	const [isSavingName, setIsSavingName] = useState(false);
	const [isSavingEmail, setIsSavingEmail] = useState(false);
	const [isSavingPassword, setIsSavingPassword] = useState(false);

	const { message, showError, setShowError, showConfirmation, save } =
		useEditLoginInfo();

	return (
		<div className='edit-account'>
			{showConfirmation && (
				<GetConfirmationMessage
					message={message}
					destination='/dashboard'
				/>
			)}

			{showError && (
				<ErrorMessage
					message={message}
					destination={false}
					onClose={() => setShowError(false)}
				/>
			)}

			<h1>Edit Account</h1>

			<EditSection
				title='Name'
				error={
					nameError && (
						<ErrorMessage
							message={nameMessage}
							destination={false}
							onClose={() => {}}
						/>
					)
				}
				success={
					nameSuccess && (
						<GetConfirmationMessage
							message={nameMessage}
							destination={false}
						/>
					)
				}
			>
				<form
					onSubmit={async (e) => {
						setIsSavingName(true);
						try {
							await handleSave(e);
						} finally {
							setIsSavingName(false);
						}
					}}
					className='edit-account__name-form'
				>
					<FormField
						label='First Name'
						value={first}
						onChange={(e) => setFirst(e.target.value)}
					/>
					<FormField
						label='Last Name'
						value={last}
						onChange={(e) => setLast(e.target.value)}
					/>
					<SaveButton
						disabled={!nameChanged}
						loading={isSavingName}
					>
						Save Name
					</SaveButton>
				</form>
			</EditSection>

			<EditSection title='Change Email'>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setIsSavingEmail(true);
						try {
							await save('email', e.target);
						} finally {
							setIsSavingEmail(false);
						}
					}}
					className='edit-account__form'
				>
					<ChangeEmail />
					<SaveButton loading={isSavingEmail}>Save Email</SaveButton>
				</form>
			</EditSection>

			<EditSection title='Change Password'>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setIsSavingPassword(true);
						try {
							await save('password', e.target);
						} finally {
							setIsSavingPassword(false);
						}
					}}
					className='edit-account__form'
				>
					<ChangePassword />
					<SaveButton loading={isSavingPassword}>Save Password</SaveButton>
				</form>
			</EditSection>
		</div>
	);
}

export default EditAccount;
