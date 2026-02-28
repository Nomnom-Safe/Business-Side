// client/src/components/common/AddressFields/AddressFields.jsx

import React from 'react';
import './AddressFields.scss';

function AddressFields({ addressData, onAddressChange, validationErrors = {} }) {
	const handleChange = (e) => {
		const { name, value } = e.target;
		onAddressChange({ ...addressData, [name]: value });
	};

	return (
		<div className='address-container'>
			<div>
				<input
					type='text'
					name='street'
					placeholder='Street Address*'
					className='street-address'
					value={addressData.street}
					onChange={handleChange}
					aria-required='true'
					aria-invalid={!!validationErrors.street}
					aria-describedby={validationErrors.street ? 'street-error' : undefined}
				/>
				{validationErrors.street && (
					<span id='street-error' className='field-error' role='alert'>{validationErrors.street}</span>
				)}
			</div>

		<div className='city-state-zip'>
			<div className='addr-field-group addr-field-city'>
				<input
					type='text'
					name='city'
					placeholder='City*'
					maxLength={50}
					className='city'
					value={addressData.city}
					onChange={handleChange}
					aria-required='true'
					aria-invalid={!!validationErrors.city}
					aria-describedby={validationErrors.city ? 'city-error' : undefined}
				/>
				{validationErrors.city && (
					<span id='city-error' className='field-error' role='alert'>{validationErrors.city}</span>
				)}
			</div>

			<div className='addr-field-group addr-field-state'>
				<input
					type='text'
					name='state'
					placeholder='ST*'
					maxLength={2}
					className='state'
					value={addressData.state}
					onChange={handleChange}
					aria-required='true'
					aria-invalid={!!validationErrors.state}
					aria-describedby={validationErrors.state ? 'state-error' : undefined}
				/>
				{validationErrors.state && (
					<span id='state-error' className='field-error' role='alert'>{validationErrors.state}</span>
				)}
			</div>

			<div className='addr-field-group addr-field-zip'>
				<input
					type='text'
					name='zipCode'
					placeholder='ZIP*'
					className='zip'
					value={addressData.zipCode}
					onChange={handleChange}
					aria-required='true'
					aria-invalid={!!validationErrors.zipCode}
					aria-describedby={validationErrors.zipCode ? 'zipCode-error' : undefined}
				/>
				{validationErrors.zipCode && (
					<span id='zipCode-error' className='field-error' role='alert'>{validationErrors.zipCode}</span>
				)}
			</div>
		</div>
		</div>
	);
}

export default AddressFields;
