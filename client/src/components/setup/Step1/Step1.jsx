// client/src/components/setup/Step1/Step1.jsx

import { useState, useEffect } from 'react';
import AddressFields from '../../common/AddressFields/AddressFields';
import './Step1.scss';

function Step1({ updateFormData }) {
	const [localData, setLocalData] = useState({
		name: '',
		website: '',
		address: { street: '', city: '', state: '', zipCode: '' },
	});

	useEffect(() => {
		updateFormData({
			name: localData.name,
			website: localData.website,
			address: localData.address,
		});
	}, [localData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setLocalData((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddressChange = (updatedAddress) => {
		setLocalData((prev) => ({ ...prev, address: updatedAddress }));
	};

	return (
		<>
			<h1>Basic Business Information</h1>

			<form
				name='setUpStep1Form'
				className='step1-form'
			>
				<div className='business-info'>
					<span className='question'>
						Please enter your business name and website URL (if applicable):
					</span>

					<div className='name-website-container'>
						<div>
							<input
								type='text'
								name='name'
								placeholder='Business Name*'
								maxLength={30}
								required
								className='business-name'
								onChange={handleChange}
							/>
						</div>

						<div>
							<input
								type='text'
								name='website'
								placeholder='Web Profile URL'
								className='website'
								onChange={handleChange}
							/>
						</div>
					</div>

					<span className='question'>
						Please enter your business's address:
					</span>

					<AddressFields
						addressData={localData.address}
						onAddressChange={handleAddressChange}
					/>
				</div>

				<div className='notes'>
					<h2>Please Note:</h2>

					<ul>
						<li>
							Information given in this section will be shown publicly to the
							users (your customers). Please only give info you want them to
							see.
						</li>
						<br />
						<li>
							If you are a mobile food truck service, please put your most
							recent or upcoming location, or the location of an event, in the
							“Location Address” box. This location can be changed at anytime
							via the “business info” settings.
						</li>
						<br />
						{/* <li>
							Additional locations can be added later in the
							business info settings.
						</li> */}
					</ul>
				</div>
			</form>
		</>
	);
}

export default Step1;
