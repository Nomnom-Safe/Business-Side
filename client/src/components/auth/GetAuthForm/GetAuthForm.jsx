// client/src/components/auth/GetAuthForm/GetAuthForm.jsx

import PropTypes from 'prop-types';

import SignUpForm from './SignUpForm/SignUpForm';
import SignInForm from './SignInForm/SignInForm';

function GetAuthForm({ formName }) {
	return formName === 'signUpForm' ? <SignUpForm /> : <SignInForm />;
}

// Prop validation
GetAuthForm.propTypes = {
	formName: PropTypes.oneOf(['signUpForm', 'signInForm']).isRequired,
};

export default GetAuthForm;
