// AllergenCheckbox.jsx

import PropTypes from 'prop-types';

function AllergenCheckbox({ allergen, checked, onToggle }) {
	return (
		<label className='allergen-label'>
			<input
				type='checkbox'
				name='allergens'
				value={allergen.id}
				className='checkbox'
				checked={checked}
				onChange={onToggle}
			/>
			{allergen.label}
		</label>
	);
}

AllergenCheckbox.propTypes = {
	/** Allergen object with id + label */
	allergen: PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	}).isRequired,

	/** Whether the checkbox is selected */
	checked: PropTypes.bool.isRequired,

	/** Handler for toggling this checkbox */
	onToggle: PropTypes.func.isRequired,
};

export default AllergenCheckbox;
