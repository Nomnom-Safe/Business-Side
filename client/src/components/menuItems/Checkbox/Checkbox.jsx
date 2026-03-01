// client/src/components/menuItems/Checkbox/Checkbox.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';

const Checkbox = ({
	label,
	isSelected,
	onCheckboxChange,
	disabled = false,
}) => (
	<div className='form-check'>
		<label>
			<input
				type='checkbox'
				name={label}
				checked={isSelected}
				onChange={onCheckboxChange}
				disabled={disabled}
				className='form-check-input'
			/>
			{label}
		</label>
	</div>
);

Checkbox.propTypes = {
	label: PropTypes.string.isRequired,
	isSelected: PropTypes.bool.isRequired,
	onCheckboxChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};

export default Checkbox;
