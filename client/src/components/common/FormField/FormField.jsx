// client/src/components/common/FormField/FormField.jsx

import PropTypes from 'prop-types';
import './FormField.scss';

function FormField({
	label,
	name,
	placeholder,
	required = true,
	className = '',
}) {
	return (
		<div className='form-field-container'>
			<label htmlFor={name}>
				{label} {required && <span className='required'>*</span>}
			</label>

			<input
				type='text'
				name={name}
				id={name}
				placeholder={placeholder}
				required={required}
				className={className}
			/>
		</div>
	);
}

FormField.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
	required: PropTypes.bool,
	className: PropTypes.string,
};

export default FormField;
