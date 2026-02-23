// client/src/components/common/PasswordFormField/PasswordFormField.jsx

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import FormField from '../../common/FormField/FormField.jsx';
import './PasswordFormField.scss';

function PasswordFormField({ name, placeholder, autoComplete = 'off' }) {
	const [passwordVisible, setPasswordVisible] = useState(false);

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	return (
		<FormField
			label={placeholder}
			name={name}
			placeholder={placeholder}
			type={passwordVisible ? 'text' : 'password'}
			required={true}
			inputWrapperClassName='password-container'
			inputClassName='password'
			autoComplete={autoComplete}
		>
			<button
				type='button'
				className='eye-icon'
				onClick={togglePasswordVisibility}
				aria-label={passwordVisible ? 'Hide password' : 'Show password'}
			>
				{passwordVisible ? <FaEye /> : <FaEyeSlash />}
			</button>
		</FormField>
	);
}

// Prop validation
PasswordFormField.propTypes = {
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
	autoComplete: PropTypes.string,
};

export default PasswordFormField;
