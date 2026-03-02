import React, { useState, useRef, useEffect, useCallback } from 'react';
import Step1 from '../Step1/Step1';
import Step2 from '../Step2/Step2';
import OnboardingTour from '../OnboardingTour/OnboardingTour';
import { useNavigate } from 'react-router-dom';
import './SetUp.scss';
import api from '../../../api';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage.jsx';
import formValidation from '../../../utils/formValidation';

const US_STATES = [
	'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
	'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
	'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
	'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
	'WI', 'WY',
];

function validateEssentials(formData) {
	const errors = {};
	if (!formValidation.isRequired(formData.name)) {
		errors.name = 'Business name is required.';
	}
	if (formData.website && !formValidation.isValidUrl(formData.website)) {
		errors.website = 'Please enter a valid URL.';
	}
	const addr = formData.address;
	if (!addr || typeof addr !== 'object') {
		errors.address = 'Address is required.';
		return errors;
	}
	if (!formValidation.isRequired(addr.street)) errors.street = 'Street is required.';
	if (!formValidation.isRequired(addr.city)) errors.city = 'City is required.';
	const state = (addr.state || '').trim().toUpperCase();
	if (!state || state.length !== 2) {
		errors.state = 'State is required (2-letter abbreviation).';
	} else if (!US_STATES.includes(state)) {
		errors.state = 'Enter a valid US state abbreviation.';
	}
	if (!/^\d{5}(-\d{4})?$/.test((addr.zipCode || '').trim())) {
		errors.zipCode = 'ZIP is required (##### or #####-####).';
	}
	return errors;
}

function SetUp() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		name: '',
		website: '',
		address: { street: '', city: '', state: '', zipCode: '' },
		allergens: [],
		diets: [],
	});
	const [message, setMessage] = useState('');
	const [showError, setShowError] = useState(false);
	const [validationErrors, setValidationErrors] = useState({});
	const [showSuccess, setShowSuccess] = useState(false);
	const [runTour, setRunTour] = useState(false);
	const stepContainerRef = useRef(null);

	useEffect(() => {
		if (localStorage.getItem('onboarding_tour_seen')) return;
		let attempts = 0;
		const maxAttempts = 30; // ~3s total
		const startWhenReady = () => {
			attempts += 1;
			const hasTarget = document.querySelector('.find-business');
			if (hasTarget) {
				setRunTour(true);
			} else if (attempts < maxAttempts) {
				setTimeout(startWhenReady, 100);
			}
		};
		const t = setTimeout(startWhenReady, 100);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		if (Object.keys(validationErrors).length > 0 && stepContainerRef.current) {
			stepContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}, [validationErrors]);

	const handleTourEnd = useCallback(() => {
		localStorage.setItem('onboarding_tour_seen', 'true');
		setRunTour(false);
	}, []);

	const getProgressBarClass = () => {
		return step === 1 ? 'one-half' : 'two-halves';
	};

	const completeSetUp = async (event) => {
		event.preventDefault();
		const errors = validateEssentials(formData);
		if (Object.keys(errors).length > 0) {
			setValidationErrors(errors);
			setMessage('Please fix the errors below.');
			setShowError(true);
			return;
		}
		setValidationErrors({});
		setShowError(false);

		try {
			const addr = formData.address;
			const state = (addr.state || '').trim().toUpperCase();
			const addressPayload = {
				street: (addr.street || '').trim(),
				city: (addr.city || '').trim(),
				state: US_STATES.includes(state) ? state : (addr.state || '').trim(),
				zipCode: (addr.zipCode || '').trim(),
			};

			const createResult = await api.businesses.create({
				name: formData.name.trim(),
				website: formData.website ? formData.website.trim() : '',
				address: addressPayload,
				allergens: formData.allergens || [],
				diets: formData.diets || [],
			});

			if (!createResult.ok) {
				const errMsg = createResult.data?.message || createResult.message;
				if (errMsg && errMsg.toLowerCase().includes('already exists')) {
					setMessage('That business name is already in use. Please choose another.');
				} else {
					setMessage(errMsg || 'Failed to create business.');
				}
				setShowError(true);
				return;
			}

			const businessId = createResult.data.id;
			localStorage.setItem('businessId', businessId);

			const assignResult = await api.auth.setBusiness({
				type: 'new',
				businessId,
			});

			if (!assignResult.ok) {
				setMessage(assignResult.message || 'Failed to assign business to user.');
				setShowError(true);
				return;
			}

			document.cookie = 'hasBusiness=true; path=/;';
			localStorage.removeItem('justSignedUp');
			setShowSuccess(true);
			// First-win moment: brief celebration then redirect
			setTimeout(() => {
				navigate('/dashboard', { state: { business: createResult.data } });
			}, 1800);
		} catch (error) {
			console.error('Error completing setup:', error);
			setMessage('An unexpected error occurred.');
			setShowError(true);
		}
	};

	const updateFormData = (stepData) => {
		setFormData((prev) => ({ ...prev, ...stepData }));
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<Step1
						formData={formData}
						updateFormData={updateFormData}
						validationErrors={validationErrors}
						setValidationErrors={setValidationErrors}
					/>
				);
			case 2:
				return (
					<Step2
						updateFormData={updateFormData}
						initialAllergens={formData.allergens}
						initialDiets={formData.diets}
						businessName={formData.name}
					/>
				);
			default:
				return <div>Error...</div>;
		}
	};

	const continueSetUp = (event) => {
		event.preventDefault();
		if (step === 1) {
			const errors = validateEssentials(formData);
			if (Object.keys(errors).length > 0) {
				setValidationErrors(errors);
				setMessage('Please fix the errors below.');
				setShowError(true);
				return;
			}
			setValidationErrors({});
			setShowError(false);
			setStep(2);
		}
	};

	const navigateBack = (event) => {
		event.preventDefault();
		setValidationErrors({});
		if (step === 1) {
			navigate('/choose-business');
		} else {
			setStep(1);
		}
	};

	const renderBtns = () => {
		if (step === 1) {
			return (
				<button
					form=""
					type="submit"
					onClick={continueSetUp}
					className="set-up-btn button"
				>
					Continue
				</button>
			);
		}
		return (
			<div className="buttons-right">
				<button
					type="button"
					onClick={completeSetUp}
					className="button gray-btn"
				>
					Skip for now
				</button>
				<button
					form=""
					type="submit"
					onClick={completeSetUp}
					className="button"
				>
					Continue to dashboard
				</button>
			</div>
		);
	};

	return (
		<div className="set-up-container">
			{runTour && <OnboardingTour step={step} onTourEnd={handleTourEnd} />}
			{showSuccess ? (
				<div className="onboarding-success" role="status" aria-live="polite">
					<span className="onboarding-success-check" aria-hidden="true">&#10003;</span>
					<h2 className="onboarding-success-title">You&apos;re all set!</h2>
					<p className="onboarding-success-copy">Taking you to your dashboard…</p>
				</div>
			) : (
				<>
			{showError && message ? (
				<ErrorMessage
					message={message}
					destination={0}
					onClose={() => setShowError(false)}
				/>
			) : null}
			<div className={`progress-bar ${getProgressBarClass()}`}>
				{step === 1 ? 'Step 1/2 — Business info' : 'Step 2/2 — Allergens & diets'}
			</div>

			<div ref={stepContainerRef} className={`step${step}`}>{renderStep()}</div>

			<div className="buttons">
				<button
					onClick={navigateBack}
					className="button gray-btn back-btn"
				>
					Back
				</button>
				{renderBtns()}
			</div>
				</>
			)}
		</div>
	);
}

export default SetUp;
