import { useEffect, useState } from 'react';
import { getAllergens } from '../../../utils/allergenCache';
import '../../../styles/global.scss';

function GenerateAllergenList({
	selectedAllergens = [],
	onAllergenChange = () => {},
}) {
	const [allergens, setAllergens] = useState([]);

	useEffect(() => {
		async function load() {
			const { arr } = await getAllergens(); // arr = [{ id, label }]
			setAllergens(arr);
		}
		load();
	}, []);

	return (
		<>
			{allergens.map((allergen) => (
				<label
					key={allergen.id}
					className='allergen-label'
				>
					<input
						type='checkbox'
						name='allergens'
						value={allergen.id}
						className='checkbox'
						checked={selectedAllergens.includes(allergen.id)}
						onChange={(e) => onAllergenChange(e, allergen.id)}
					/>
					{allergen.label}
				</label>
			))}
		</>
	);
}

export default GenerateAllergenList;
