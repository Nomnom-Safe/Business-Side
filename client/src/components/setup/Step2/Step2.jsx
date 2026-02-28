import './Step2.scss';
import GenerateAllergenList from '../../common/GenerateAllergenList/GenerateAllergenList';
import GenerateDietList from '../../auth/DietList/DietList';
import { useState, useEffect } from 'react';

function Step2({ updateFormData, initialAllergens, initialDiets, businessName }) {
	const [selectedAllergens, setSelectedAllergens] = useState(() => Array.isArray(initialAllergens) ? initialAllergens : []);
	const [selectedDiets, setSelectedDiets] = useState(() => Array.isArray(initialDiets) ? initialDiets : []);

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
			<h1>Help customers find you</h1>
			{businessName && (businessName.trim()) && (
				<p className="step2-personalization">Almost there, {businessName.trim()}.</p>
			)}
			<div className="step2-optional-callout">
				This step is optional. Skip to go straight to your dashboard and add this later in Business settings.
			</div>

			<form
				name='setUpStep2Form'
				className='step2-form'
			>
				<div className='onboarding-card allergens'>
					<span className='question'>
						Which allergens are always present in your menu items? (Select all that apply.)
					</span>

					<div className='allergen-list'>
						<GenerateAllergenList
							selectedAllergens={selectedAllergens}
							onAllergenChange={handleAllergenChange}
						/>
					</div>
				</div>

				<div className='onboarding-card diets'>
					<span className='question'>
						Which diets do you offer menu items for? (Select all that apply.)
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
