import React, { useState } from 'react';
import Step1 from '../Step1/Step1';
import Step2 from '../Step2/Step2';
import Step3 from '../Step3/Step3';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './SetUp.scss';

function SetUp({ step }) {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		// Step 1 data
		name: '',
		url: '',
		address: '',
		// Step 2 data
		allergens: [],
		diets: [],
		// Step 3 data
		menuLayout: '',
	});

	const getProgressBarClass = () => {
		switch (step) {
			case 1:
				return 'one-third';
			case 2:
				return 'two-thirds';
			case 3:
				return 'three-thirds';
			default:
				return '';
		}
	};

	const completeSetUp = async (event) => {
		event.preventDefault();

		try {
			let businessId = localStorage.getItem('businessId');

			// Step 1: Create business if not already created
			if (!businessId) {
				const response = await fetch('http://localhost:5000/api/businesses', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: formData.name,
						url: formData.url,
						address: formData.address,
						allergens: formData.allergens,
						diets: formData.diets,
					}),
				});

				if (!response.ok) {
					const result = await response.json();
					if (result.error?.includes('Business name already exists')) {
						alert(
							'That business name is already in use. Please choose another.',
						);
						return;
					}
					throw new Error('Failed to create business');
				}

				const created = await response.json();
				businessId = created.id;
				localStorage.setItem('businessId', businessId);
			}

			// Step 2: Update business (layout, etc.)
			const updateResponse = await fetch(
				`http://localhost:5000/api/businesses/${businessId}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: formData.name,
						url: formData.url,
						address: formData.address,
						allergens: formData.allergens,
						diets: formData.diets,
						menuLayout: formData.menuLayout,
					}),
				},
			);

			if (!updateResponse.ok) throw new Error('Failed to update business');

			const updatedBusiness = await updateResponse.json();

			document.cookie = 'hasBusiness=true; path=/;';

			// Finish setup
			localStorage.removeItem('justSignedUp');
			navigate('/dashboard', { state: { business: updatedBusiness } });
		} catch (error) {
			console.error('Error completing setup:', error);
		}
	};

	const updateFormData = (stepData) => {
		setFormData((prev) => ({ ...prev, ...stepData }));
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return <Step1 updateFormData={updateFormData} />;
			case 2:
				return <Step2 updateFormData={updateFormData} />;
			case 3:
				return <Step3 updateFormData={updateFormData} />;
			default:
				return <div>Error...</div>;
		}
	};

	const continueSetUp = (event) => {
		event.preventDefault();

		if (step === 1) {
			navigate('/step2');
		} else if (step === 2) {
			navigate('/step3');
		}
	};

	const navigateBack = (event) => {
		event.preventDefault();
		if (step === 1) {
			navigate('/choose-business');
		} else {
			navigate(`/step${step - 1}`);
		}
	};

	const renderBtns = () => {
		switch (step) {
			case 1:
				return (
					<button
						form=''
						type='submit'
						onClick={continueSetUp}
						className='set-up-btn button'
					>
						Continue
					</button>
				);
			case 2:
				return (
					<button
						form=''
						type='submit'
						onClick={continueSetUp}
						className='button'
					>
						Continue
					</button>
				);
			case 3:
				return (
					<button
						form=''
						type='submit'
						onClick={completeSetUp}
						className='button'
					>
						Go To Dashboard
					</button>
				);
			default:
				return <></>;
		}
	};

	return (
		<div className='set-up-container'>
			<div className={`progress-bar ${getProgressBarClass()}`}>
				Step {step}/3
			</div>

			<div className={`step${step}`}>{renderStep()}</div>

			<div className='buttons'>
				<button
					onClick={navigateBack}
					className='button gray-btn back-btn'
				>
					Back
				</button>

				{renderBtns()}
			</div>
		</div>
	);
}

SetUp.propTypes = {
	step: PropTypes.number.isRequired,
};

export default SetUp;
