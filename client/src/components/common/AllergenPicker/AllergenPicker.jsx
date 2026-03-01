import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { useAllergens } from '../../../hooks/useAllergens';
import Checkbox from '../Checkbox/Checkbox';
import { getAllergenLabels } from '../../../utils/allergenCache';
import './AllergenPicker.scss';

function AllergenPicker({
	selectedAllergens = [],
	onChange,
	showSelectedTags = true,
	compact = false,
}) {
	const allergens = useAllergens();
	const [labels, setLabels] = useState({});
	const [hoveredId, setHoveredId] = useState(null);

	useEffect(() => {
		async function loadLabels() {
			if (allergens.length > 0) {
				const labelMap = {};
				allergens.forEach((a) => {
					labelMap[a.id] = a.label;
				});
				setLabels(labelMap);
			}
		}
		loadLabels();
	}, [allergens]);

	const handleToggle = (allergenId) => {
		const isSelected = selectedAllergens.includes(allergenId);
		let updated;
		if (isSelected) {
			updated = selectedAllergens.filter((id) => id !== allergenId);
		} else {
			updated = [...selectedAllergens, allergenId];
		}
		onChange(updated);
	};

	const handleRemoveTag = (allergenId) => {
		const updated = selectedAllergens.filter((id) => id !== allergenId);
		onChange(updated);
	};

	return (
		<div
			className={`allergen-picker ${compact ? 'allergen-picker--compact' : ''}`}
		>
			{showSelectedTags && selectedAllergens.length > 0 && (
				<div className='allergen-picker__selected'>
					<span className='allergen-picker__selected-label'>Selected:</span>
					<div className='allergen-picker__tags'>
						{selectedAllergens.map((id) => (
							<span
								key={id}
								className='allergen-picker__tag'
								title={labels[id] || id}
							>
								{labels[id] || id}
								<button
									type='button'
									className='allergen-picker__tag-remove'
									onClick={() => handleRemoveTag(id)}
									aria-label={`Remove ${labels[id] || id}`}
								>
									<FaTimes size={10} />
								</button>
							</span>
						))}
					</div>
				</div>
			)}

			<div className='allergen-picker__grid'>
				{allergens.map((allergen) => {
					const isChecked = selectedAllergens.includes(allergen.id);
					const isHovered = hoveredId === allergen.id;
					return (
						<label
							key={allergen.id}
							className={`allergen-picker__option ${isChecked ? 'allergen-picker__option--selected' : ''}`}
							onMouseEnter={() => setHoveredId(allergen.id)}
							onMouseLeave={() => setHoveredId(null)}
						>
							{isHovered && (
								<span
									className='allergen-picker__tooltip'
									role='tooltip'
								>
									{allergen.label}
								</span>
							)}
							<Checkbox
								label='' // Empty - handled by option-label
								isSelected={isChecked}
								onChange={() => handleToggle(allergen.id)}
								theme='salmon'
								size='medium'
							/>
							<span className='allergen-picker__option-label'>
								{allergen.label}
							</span>
						</label>
					);
				})}
			</div>

			{selectedAllergens.length === 0 && showSelectedTags && (
				<p className='allergen-picker__empty'>No allergens selected</p>
			)}
		</div>
	);
}

AllergenPicker.propTypes = {
	selectedAllergens: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func.isRequired,
	showSelectedTags: PropTypes.bool,
	compact: PropTypes.bool,
};

export default AllergenPicker;
