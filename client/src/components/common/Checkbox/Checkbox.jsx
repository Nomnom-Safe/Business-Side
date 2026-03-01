// client/src/components/common/Checkbox/Checkbox.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';

const Checkbox = ({
	label,
	isSelected,
	onChange,
	theme = 'salmon', // 'salmon' | 'mint' | 'turq' etc.
	size = 'medium', // 'small' | 'medium' | 'large'
	disabled = false,
	className = '',
}) => {
	const id = `checkbox-${label}-${theme}-${size}`;

	return (
		<div className={`checkbox-wrapper ${className}`}>
			<input
				type='checkbox'
				id={id}
				checked={isSelected}
				onChange={onChange}
				disabled={disabled}
				className={`checkbox-input checkbox-input--${theme} checkbox-input--${size}`}
			/>
			<label
				htmlFor={id}
				className='checkbox-label'
			>
				{label}
			</label>
		</div>
	);
};

Checkbox.propTypes = {
	label: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	theme: PropTypes.oneOf(['salmon', 'mint', 'turq']),
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	disabled: PropTypes.bool,
	className: PropTypes.string,
};

export default Checkbox;
