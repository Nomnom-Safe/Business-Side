import '../../scss/styles.scss';

function GenerateAllergenList({
	selectedAllergens = [],
	onAllergenChange = () => {},
}) {
	const allergens = [
		{ label: 'Lactose (milk)', value: 'lactose' },
		{ label: 'Gluten', value: 'gluten' },
		{ label: 'Meat', value: 'meat' },
		{ label: 'Fish', value: 'fish' },
		{ label: 'Animal Products', value: 'animalProducts' },
		{ label: 'Eggs', value: 'eggs' },
		{ label: 'Shellfish', value: 'shellfish' },
		{ label: 'Tree Nuts', value: 'treeNuts' },
		{ label: 'Peanuts', value: 'peanuts' },
	];

	return (
		<>
			{allergens.map((allergen) => (
				<label
					key={allergen.value}
					className='allergen-label'
				>
					<input
						type='checkbox'
						name='allergens'
						value={allergen.value}
						className='checkbox'
						checked={selectedAllergens.includes(allergen.value)}
						onChange={(e) => onAllergenChange(e, allergen.value)}
					/>
					{allergen.label}
				</label>
			))}
		</>
	);
}

export default GenerateAllergenList;
