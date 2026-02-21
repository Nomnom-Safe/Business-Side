// client/src/components/common/FormField/FormField.jsx

import PropTypes from 'prop-types';
import './FormField.scss';

function FormField({
	label,
	name,
	placeholder,
	required = true,
	inputWrapperClassName = 'form-field-input-wrapper',
	inputClassName = '',
	type = 'text',
	children,
	...rest
}) {
	return (
		<div className='form-field-container'>
			<label htmlFor={name}>
				{label} {required && <span className='required'>*</span>}
			</label>

			<div className={inputWrapperClassName}>
				<input
					type={type}
					name={name}
					id={name}
					placeholder={placeholder}
					required={required}
					className={inputClassName}
					{...rest}
				/>

				{/* Optional custom UI (icons, buttons, etc.) */}
				{children}
			</div>
		</div>
	);
}

FormField.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
	required: PropTypes.bool,
	inputWrapperClassName: PropTypes.string,
	inputClassName: PropTypes.string,
	type: PropTypes.string,
	children: PropTypes.node,
};

export default FormField;
