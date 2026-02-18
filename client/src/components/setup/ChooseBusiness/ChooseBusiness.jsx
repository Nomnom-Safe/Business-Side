import './ChooseBusiness.scss';
import GetConfirmationMessage from '../../common/ConfirmationMessage/ConfirmationMessage.jsx';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage.jsx';
import Select from 'react-select';
import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';

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
				const result = await api.businesses.list();

				if (result.ok && Array.isArray(result.data)) {
					const businesses = result.data
						.filter((business) => business.name !== 'New Business')
						.map((business) => ({
							value: business.id,
							label: business.name,
						}));

					setData(businesses);
				} else {
					setMessage(result.message || 'Failed to load businesses.');
					setShowError(true);
					console.error('Error: response not ok');
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
				const result = await api.auth.setBusiness(formData);

				if (result.ok) {
					if (option === 'existing') {
						localStorage.setItem('businessId', result.data.business_id);

						setMessage(result.message || 'Business selected successfully.');
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
				const createResult = await api.businesses.create({
					name: `New Business - ${Date.now()}`,
					website: '',
					address: '',
					allergens: [],
					diets: [],
				});

				if (!createResult.ok) {
					setMessage(createResult.message || 'Failed to create business');
					setShowError(true);
					return;
				}
				
				const businessId = createResult.data.id;
				localStorage.setItem('businessId', businessId);
				
				// Menu is automatically created by the backend when creating a business
				// No need to create it separately here
				
				// Associate business with user
				const assignResult = await api.auth.setBusiness({
					type: 'new',
					businessId: businessId,
				});

				if (!assignResult.ok) {
					setMessage(
						assignResult.message || 'Failed to assign business to user',
					);
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
