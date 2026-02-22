// client/src/components/auth/AuthFormSwitcher/AuthFormSwitcher.jsx

import GetAuthForm from '../GetAuthForm/GetAuthForm.jsx';
import SwapPrompt from './SwapPrompt.jsx';
import { useAuthFormSwitcher } from '../../../hooks/useAuthFormSwitcher.js';
import './AuthFormSwitcher.scss';

function AuthFormSwitcher() {
	const { formType, isSignUpForm, showSignInForm, showSignUpForm } =
		useAuthFormSwitcher('signUpForm');

	return (
		<div className={isSignUpForm ? 'sign-up-container' : 'sign-in-container'}>
			<div className={isSignUpForm ? 'sign-up' : 'sign-in'}>
				<GetAuthForm formName={formType} />

				{isSignUpForm ? (
					<SwapPrompt
						message='Already have an account?'
						actionLabel='Sign in'
						onClick={showSignInForm}
					/>
				) : (
					<SwapPrompt
						message="Don't have an account?"
						actionLabel='Sign Up'
						onClick={showSignUpForm}
					/>
				)}
			</div>

			{isSignUpForm ? (
				<h1 className='welcome'>Welcome to NomNom Safe!</h1>
			) : (
				<></>
			)}
		</div>
	);
}

export default AuthFormSwitcher;
