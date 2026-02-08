import './ChooseBusiness.scss';
import GetConfirmationMessage from '../../common/ConfirmationMessage/ConfirmationMessage.jsx';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage.jsx';
import Select from 'react-select';
import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChooseBusiness() {
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [option, setOption] = useState('');
	const [message, setMessage] = useState('Something went wrong.');
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showError, setShowError] = useState(false);

	// Get a list of all business names and IDs from the DB
	React.useEffect(() => {
		const getBusinessNames = async () => {
			try {
				const response = await fetch('http://localhost:5000/api/businesses/', {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				const result = await response.json();

				if (response.ok) {
					const businesses = result
						.filter((business) => business.name !== 'New Business')
						.map((business) => ({
							value: business.id,
							label: business.name,
						}));

					setData(businesses);
				} else {
					setMessage(result.message);
					setShowError(true);
					console.error('Error: response not ok:', response.error);
				}
			} catch (err) {
				console.error('Error: ', err.message);
			}
		};

		getBusinessNames();
	}, []);

	const setBusiness = async (event) => {
		event.preventDefault();

		const form = event.target;
		var formData = { type: option };

		if (option === 'existing') {
			const selectedBusinessId = form.selectedBusiness.value;
			formData = {
				...formData,
				business_id: selectedBusinessId,
			};

			try {
				const response = await fetch(
					'http://localhost:5000/api/auth/set-business',
					{
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(formData),
					},
				);
				const result = await response.json();

				if (response.ok) {
					if (option === 'existing') {
						localStorage.setItem('business_id', result.business_id);

						setMessage(result.message);
						setShowConfirmation(true);
					} else {
						setMessage('Something went wrong.');
						setShowError(true);
					}
				} else {
					setMessage(result.message);
					setShowError(true);
				}
			} catch (err) {
				console.error('Error: ', err.message);
			}
		} else if (option === 'new') {
			// Create new business and master menu immediately
			try {
				const createBusinessResponse = await fetch(
					'http://localhost:5000/api/businesses',
					{
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							name: 'New Business',
							url: '',
							address: '',
							allergens: [],
							diets: [],
						}),
					},
				);

				const result = await createBusinessResponse.json();
				if (!createBusinessResponse.ok) {
					// setMessage(result.message);
					setMessage('Failed to create business');
					setShowError(true);
					return;
				}

				const createdBusiness = await createBusinessResponse.json();
				const businessId = createdBusiness.id;
				localStorage.setItem('business_id', businessId);

				// Create master menu
				const createMenuResponse = await fetch(
					'http://localhost:5000/api/menus',
					{
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							title: 'Master Menu',
							description: 'This menu will be shown to customers',
							restaurant: businessId,
							menuItems: [],
						}),
					},
				);

				if (!createMenuResponse.ok) {
					const result = await createMenuResponse.json();
					setMessage(result.message || 'Failed to create menu');
					setShowError(true);
					return;
				}

				// Associate business with user
				const assignResponse = await fetch(
					'http://localhost:5000/api/auth/set-business',
					{
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							type: 'new',
							business_id: businessId,
						}),
					},
				);

				if (!assignResponse.ok) {
					const result = await assignResponse.json();
					setMessage(result.message || 'Failed to assign business to user');
					setShowError(true);
					return;
				}

				// Redirect to step 1
				navigate('/step1');
			} catch (err) {
				console.error('Error: ', err.message);
				setMessage('Unexpected error while creating business.');
				setShowError(true);
			}
		}
	};

	return (
		<div className='set-up-container'>
			{showConfirmation ? (
				<GetConfirmationMessage
					message={message}
					destination={option === 'new' ? '/step1' : '/dashboard'}
				/>
			) : (
				<></>
			)}

			{showError ? (
				<ErrorMessage
					message={message}
					destination={0}
				/>
			) : (
				<></>
			)}

			<h1 className=''>Choose Business</h1>

			<form
				name='chooseBusinessForm'
				onSubmit={setBusiness}
				className='choose-business-form'
			>
				<div className='choose-business-container'>
					<div className='choose-business'>
						<div className='question'>
							Do you want to create a new business or join an existing one?
						</div>

						<div>
							<label
								key='new'
								className='radio-label'
							>
								<input
									type='radio'
									name='business'
									value='new'
									required
									onChange={() => setOption('new')}
								/>
								Create a new business
							</label>

							<label
								key='existing'
								className='radio-label'
							>
								<input
									type='radio'
									name='business'
									value='existing'
									onChange={() => setOption('existing')}
								/>
								Join an existing business
							</label>
						</div>
					</div>

					{option === 'existing' ? (
						<div className='business-options'>
							<div className='question'>Select a business:</div>

							<Select
								options={data}
								name='selectedBusiness'
								classNamePrefix='business'
							/>
						</div>
					) : (
						<></>
					)}
				</div>

				<div className='buttons'>
					<button
						type='submit'
						className='button'
					>
						Next
					</button>
				</div>
			</form>
		</div>
	);
}

export default ChooseBusiness;
