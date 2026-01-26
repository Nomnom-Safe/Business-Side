import '../../scss/Password.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import PropTypes from 'prop-types';

function GetPasswordField({ name, placeholder }) {
	const [passwordVisible, setPasswordVisible] = useState(false);

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	return (
		<div className='form-field-container'>
			<label key={name}>
				{placeholder} <span className='required'>*</span>
			</label>

			<div className='password-container'>
				{/* dynamically changes input type to hide or show password
          based on state */}
				<input
					type={passwordVisible ? 'text' : 'password'}
					name={name}
					placeholder={placeholder}
					className='password'
					required
					autoComplete='off'
				/>

				{/* dynamically changes eye icon appearance (slash or no slash)
          based on state */}
				<span
					className='eye-icon'
					onClick={togglePasswordVisibility}
				>
					{passwordVisible ? <FaEye /> : <FaEyeSlash />}
				</span>
			</div>
		</div>
	);
}

// Prop validation
GetPasswordField.propTypes = {
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
};

export default GetPasswordField;
