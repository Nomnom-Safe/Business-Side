// client/src/components/business/EditBusinessInfo/EditBusinessInfo.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetConfirmationMessage from '../../common/ConfirmationMessage/ConfirmationMessage.jsx';
import AddressFields from '../../common/AddressFields/AddressFields';
import './EditBusinessInfo.scss';

const EditBusinessInfo = () => {
	const [businessInfo, setBusinessInfo] = useState({
		id: '',
		name: '',
		address_id: '',
		allergens: '',
		diets: '',
		phone: '',
		hours: [],
		website: '',
		disclaimers: [],
		cuisine: '',
	});

	const [addressInfo, setAddressInfo] = useState({
		street: '',
		city: '',
		state: '',
		zipCode: '',
	});

	const [showConfirmation, setShowConfirmation] = useState(false);
	const navigate = useNavigate();

	const businessId = localStorage.getItem('businessId'); // Get from localStorage

	useEffect(() => {
		const fetchBusinessInfo = async () => {
			if (!businessId) {
				console.error('No Business ID found.');
				return;
			}

			try {
				// Fetch business
				const response = await fetch(
					`http://localhost:5000/api/businesses/${businessId}`,
				);
				if (!response.ok) throw new Error('Failed to fetch business info');

				const business = await response.json();

				setBusinessInfo({
					id: business.id,
					name: business.name || '',
					website: business.website || '',
					address_id: business.address_id || '',
					allergens: business.allergens ? business.allergens.join(', ') : '',
					diets: business.diets ? business.diets.join(', ') : '',
					phone: business.phone || '',
					hours: business.hours || [],
					disclaimers: business.disclaimers || [],
					cuisine: business.cuisine || '',
				});

				// Fetch address separately
				if (business.address_id) {
					const addressRes = await fetch(
						`http://localhost:5000/api/addresses/${business.address_id}`,
					);
					if (addressRes.ok) {
						const addr = await addressRes.json();
						setAddressInfo({
							street: addr.street || '',
							city: addr.city || '',
							state: addr.state || '',
							zipCode: addr.zipCode || '',
						});
					}
				}
			} catch (error) {
				console.error('Error fetching business info:', error);
			}
		};

		fetchBusinessInfo();
	}, [businessId]);

	const handleBusinessChange = (field, value) => {
		setBusinessInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddressChange = (updatedAddress) => {
		setAddressInfo(updatedAddress);
	};

	const cancel = (event) => {
		event.preventDefault();
		navigate('/dashboard');
	};

	const save = async (event) => {
		event.preventDefault();

		try {
			let addressId = businessInfo.address_id;

			// If no address_id exists, create a new address doc
			if (!addressId) {
				const createRes = await fetch(`http://localhost:5000/api/addresses`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(addressInfo),
				});

				if (!createRes.ok) throw new Error('Failed to create address');

				const created = await createRes.json();
				addressId = created.id;

				setBusinessInfo((prev) => ({ ...prev, address_id: addressId }));
			} else {
				// Update existing address
				const updateRes = await fetch(
					`http://localhost:5000/api/addresses/${addressId}`,
					{
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							id: addressId,
							street: addressInfo.street,
							city: addressInfo.city,
							state: addressInfo.state,
							zipCode: addressInfo.zipCode,
						}),
					},
				);

				if (!updateRes.ok) throw new Error('Failed to update address');
			}

			const updatedBusiness = {
				id: businessId,
				name: businessInfo.name,
				website: businessInfo.website,
				address_id: addressId,
			};

			// Update business info
			const response = await fetch(
				`http://localhost:5000/api/businesses/${businessId}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updatedBusiness),
				},
			);

			if (!response.ok) throw new Error('Failed to update business');

			setShowConfirmation(true);
		} catch (error) {
			console.error('Error updating business:', error);
		}
	};

	return (
		<form className='edit-business-info-container'>
			{showConfirmation ? (
				<GetConfirmationMessage
					message='Business information changed successfully.'
					destination='/dashboard'
				/>
			) : (
				<></>
			)}

			<h1>Edit Business Information</h1>

			<div className='edit-business-info-form-fields'>
				<div className='logo-upload'>
					<div className='upload-box'>
						↑<br />
						Upload
						<br />
						Business
						<br />
						Logo
					</div>
				</div>

				<div className='form-column'>
					<div className='form-field-container'>
						<label>Business Name</label>
						<input
							type='text'
							value={businessInfo.name}
							onChange={(e) => handleBusinessChange('name', e.target.value)}
						/>
					</div>

					<div className='form-field-container'>
						<label>Website URL</label>
						<input
							type='text'
							value={businessInfo.website}
							onChange={(e) => handleBusinessChange('website', e.target.value)}
						/>
					</div>

					<div className='form-field-container'>
						<label>Address</label>
						<AddressFields
							addressData={addressInfo}
							onAddressChange={handleAddressChange}
						/>
					</div>
				</div>

				<div className='form-column'>
					<div className='form-field-container'>
						<label>Business Disclaimer</label>
						<input
							type='text'
							placeholder='(Ignored for now)'
							disabled
						/>
					</div>

					<div className='form-field-container'>
						<label>Unavoidable Allergies</label>
						<input
							type='text'
							placeholder='example: Tree Nuts'
							value={businessInfo.allergens}
							onChange={(e) =>
								handleBusinessChange('allergens', e.target.value)
							}
							disabled
						/>
					</div>

					<div className='form-field-container'>
						<label>Special Preparations</label>
						<input
							type='text'
							placeholder='example: Kosher'
							value={businessInfo.diets}
							onChange={(e) => handleBusinessChange('diets', e.target.value)}
							disabled
						/>
					</div>
				</div>
			</div>

			<div className='buttons edit-business-info'>
				<div>
					<button
						type='button'
						onClick={cancel}
						className='button gray-btn cancel-btn'
					>
						Cancel
					</button>
				</div>

				<div className='save-section'>
					<span className='save-note'>
						* This information will be displayed to users of the app
					</span>

					<button
						type='submit'
						onClick={save}
						className='button'
					>
						Save
					</button>
				</div>
			</div>
		</form>
	);
};

export default EditBusinessInfo;
