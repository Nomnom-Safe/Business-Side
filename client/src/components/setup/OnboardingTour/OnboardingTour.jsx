import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './OnboardingTour.css';

const STEP1_STEPS = [
	{
		element: '.find-business',
		popover: {
			title: 'Find your business fast',
			description:
				"Search by name or address and we'll fill in the details for you. You can still edit everything.",
		},
	},
	{
		element: '.business-info',
		popover: {
			title: 'Your business name & website',
			description:
				'Your business name is required. Website is optional — add it if you have one.',
		},
	},
	{
		element: '.address-section',
		popover: {
			title: 'Where are you located?',
			description:
				"All address fields are required. If you're a food truck, use your current or upcoming location.",
		},
	},
	{
		element: '.set-up-container .buttons',
		popover: {
			title: 'Ready to continue?',
			description:
				"Click Continue when you're done. You can always go back — nothing is lost.",
		},
	},
];

const STEP2_STEPS = [
	{
		element: '.step2-optional-callout',
		popover: {
			title: 'This step is optional',
			description:
				'Skip straight to your dashboard if you prefer. You can add allergens and diets later in settings.',
		},
	},
	{
		element: '.allergens',
		popover: {
			title: 'Allergens in your menu',
			description:
				'Select any allergens that are always present so customers know what to expect.',
		},
	},
	{
		element: '.diets',
		popover: {
			title: 'Diets you cater to',
			description:
				'Select the diets your menu supports. Customers filter by these to find businesses like yours.',
		},
	},
];

function OnboardingTour({ step, onTourEnd }) {
	useEffect(() => {
		const steps = step === 1 ? STEP1_STEPS : STEP2_STEPS;

		const driverObj = driver({
			showProgress: true,
			progressText: '{{current}} of {{total}}',
			popoverClass: 'nomnom-tour-popover',
			nextBtnText: 'Next →',
			prevBtnText: '← Back',
			doneBtnText: 'Done',
			steps,
			onDestroyed: () => {
				onTourEnd();
			},
		});

		driverObj.drive();

		return () => {
			driverObj.destroy();
		};
	}, [step, onTourEnd]);

	return null;
}

export default OnboardingTour;
