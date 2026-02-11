import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetConfirmationMessage from '../../common/ConfirmationMessage/ConfirmationMessage.jsx';
import './EditBusinessInfo.scss';
import api from '../../../api';

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
				const result = await api.businesses.getById(businessId);
				if (!result.ok || !result.data) throw new Error('Failed to fetch business info');

				const data = result.data;

				setBusinessInfo({
					id: data.id,
					name: data.name || '',
					website: data.website || '',
					address_id: data.address_id || '',
					allergens: data.allergens ? data.allergens.join(', ') : '',
					diets: data.diets ? data.diets.join(', ') : '',
					phone: data.phone || '',
					hours: data.hours || [],
					disclaimers: data.disclaimers || [],
					cuisine: data.cuisine || '',
				});
			} catch (error) {
				console.error('Error fetching business info:', error);
			}
		};

		fetchBusinessInfo();
	}, [businessId]);

	const handleChange = (field, value) => {
		setBusinessInfo((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const cancel = (event) => {
		event.preventDefault();
		navigate('/dashboard');
	};

	const save = async (event) => {
		event.preventDefault();

		try {
			const updatedData = {
				id: businessId,
				name: businessInfo.name,
				website: businessInfo.website,
			};

			const result = await api.businesses.update(businessId, updatedData);

			if (!result.ok) throw new Error('Failed to update business');

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
							onChange={(e) => handleChange('name', e.target.value)}
						/>
					</div>

					<div className='form-field-container'>
						<label>Website URL</label>
						<input
							type='text'
							value={businessInfo.website}
							onChange={(e) => handleChange('website', e.target.value)}
						/>
					</div>

					<div className='form-field-container'>
						<label>Address</label>
						<input
							type='text'
							value={businessInfo.address}
							onChange={(e) => handleChange('address', e.target.value)}
							disabled
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
							onChange={(e) => handleChange('allergens', e.target.value)}
							disabled
						/>
					</div>

					<div className='form-field-container'>
						<label>Special Preparations</label>
						<input
							type='text'
							placeholder='example: Kosher'
							value={businessInfo.diets}
							onChange={(e) => handleChange('diets', e.target.value)}
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
