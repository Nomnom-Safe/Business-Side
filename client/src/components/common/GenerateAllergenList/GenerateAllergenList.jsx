// client/src/components/auth/GenerateAllergenList/GenerateAllergenList.jsx

import '../../../styles/global.scss';
import PropTypes from 'prop-types';
import { useAllergens } from '../../../hooks/useAllergens';
import AllergenCheckbox from './AllergenCheckbox';

function GenerateAllergenList({
	selectedAllergens = [],
	onAllergenChange = () => {},
}) {
	const allergens = useAllergens();

	const handleToggle = (id) => (e) => {
		onAllergenChange(e, id);
	};

	return (
		<>
			{allergens.map((allergen) => (
				<AllergenCheckbox
					key={allergen.id}
					allergen={allergen}
					checked={selectedAllergens.includes(allergen.id)}
					onToggle={handleToggle(allergen.id)}
				/>
			))}
		</>
	);
}

GenerateAllergenList.propTypes = {
	/** Array of allergen IDs that should be checked */
	selectedAllergens: PropTypes.arrayOf(PropTypes.string),

	/** Handler fired when a checkbox is toggled */
	onAllergenChange: PropTypes.func,
};

export default GenerateAllergenList;
