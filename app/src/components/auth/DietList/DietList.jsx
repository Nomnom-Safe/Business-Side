import '../../scss/global.scss';

function GenerateDietList({ selectedDiets = [], onDietChange = () => {} }) {
	const diets = [
		{ label: 'Keto', value: 'keto' },
		{ label: 'Vegan', value: 'vegan' },
		{ label: 'Vegetarian', value: 'vegetarian' },
		{ label: 'Halal', value: 'halal' },
		{ label: 'Kosher', value: 'kosher' },
		{ label: 'Pescatarian', value: 'pescatarian' },
	];

	return (
		<>
			{diets.map((diet) => (
				<label
					key={diet.value}
					className='diet-label'
				>
					<input
						type='checkbox'
						name='diets'
						value={diet.value}
						className='checkbox'
						checked={selectedDiets.includes(diet.value)}
						onChange={(e) => onDietChange(e, diet.value)}
					/>
					{diet.label}
				</label>
			))}
		</>
	);
}

export default GenerateDietList;
