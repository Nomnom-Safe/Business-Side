import './Step2.scss';
import GenerateAllergenList from '../../auth/AllergenList';
import GenerateDietList from '../../auth/DietList';
import { useState, useEffect } from 'react';

function Step2({ updateFormData }) {
	const [selectedAllergens, setSelectedAllergens] = useState([]);
	const [selectedDiets, setSelectedDiets] = useState([]);

	// Handle allergen checkbox change
	const handleAllergenChange = (e, allergen) => {
		if (e.target.checked) {
			setSelectedAllergens((prev) => [...prev, allergen]);
		} else {
			setSelectedAllergens((prev) => prev.filter((a) => a !== allergen));
		}
	};

	// Handle diet checkbox change
	const handleDietChange = (e, diet) => {
		if (e.target.checked) {
			setSelectedDiets((prev) => [...prev, diet]);
		} else {
			setSelectedDiets((prev) => prev.filter((d) => d !== diet));
		}
	};

	// Whenever allergens or diets change, update the main formData
	useEffect(() => {
		updateFormData({
			allergens: selectedAllergens,
			diets: selectedDiets,
		});
	}, [selectedAllergens, selectedDiets]);

	return (
		<>
			<h1>Your Menu</h1>

			<form
				name='setUpStep2Form'
				className='step2-form'
			>
				<div className='allergens'>
					<span className='question'>
						Do your menu items always contain certain allergens?
					</span>

					<div className='allergen-list'>
						<GenerateAllergenList
							selectedAllergens={selectedAllergens}
							onAllergenChange={handleAllergenChange}
						/>
					</div>
				</div>

				<div className='diets'>
					<span className='question'>
						Do you use any special preparation techniques or provide menu items
						for any diets?
					</span>

					<div className='diet-list'>
						<GenerateDietList
							selectedDiets={selectedDiets}
							onDietChange={handleDietChange}
						/>
					</div>
				</div>
			</form>
		</>
	);
}

export default Step2;
