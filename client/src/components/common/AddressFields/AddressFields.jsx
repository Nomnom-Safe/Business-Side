// client/src/components/common/AddressFields/AddressFields.jsx

import React from 'react';
import './AddressFields.scss';

function AddressFields({ addressData, onAddressChange }) {
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
				/>
			</div>

			<div className='city-state-zip'>
				<input
					type='text'
					name='city'
					placeholder='City*'
					maxLength={50}
					className='city'
					value={addressData.city}
					onChange={handleChange}
				/>

				<input
					type='text'
					name='state'
					placeholder='State*'
					maxLength={2}
					className='state'
					value={addressData.state}
					onChange={handleChange}
				/>

				<input
					type='text'
					name='zipCode'
					placeholder='ZIP*'
					className='zip'
					value={addressData.zipCode}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
}

export default AddressFields;
