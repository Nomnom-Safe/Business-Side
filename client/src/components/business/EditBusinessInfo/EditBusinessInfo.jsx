// client/src/components/business/EditBusinessInfo/EditBusinessInfo.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetConfirmationMessage from '../../common/ConfirmationMessage/ConfirmationMessage.jsx';
import AddressFields from '../../common/AddressFields/AddressFields';
import GenerateAllergenList from '../../common/GenerateAllergenList/GenerateAllergenList';
import GenerateDietList from '../../auth/DietList/DietList';
import './EditBusinessInfo.scss';
import api from '../../../api';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.jsx';

const toArray = (val) => {
	if (Array.isArray(val)) return val;
	if (typeof val === 'string' && val.trim()) return val.split(',').map((s) => s.trim()).filter(Boolean);
	return [];
};

const EditBusinessInfo = () => {
	const [businessInfo, setBusinessInfo] = useState({
		id: '',
		name: '',
		address_id: '',
		allergens: [],
		diets: [],
		phone: '',
		hours: [],
		website: '',
		disclaimers: [],
		cuisine: '',
	});
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState('');

	const [addressInfo, setAddressInfo] = useState({
		street: '',
		city: '',
		state: '',
		zipCode: '',
	});

	const [showConfirmation, setShowConfirmation] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	const businessId = localStorage.getItem('businessId');

	useEffect(() => {
		const fetchBusinessInfo = async () => {
			setIsLoading(true);
			if (!businessId) {
				console.error('No Business ID found.');
				setIsLoading(false);
				return;
			}

			try {
				const response = await api.businesses.getById(businessId);
				if (!response.ok || !response.data)
					throw new Error('Failed to fetch business info');

				const business = response.data;

				setBusinessInfo({
					id: business.id,
					name: business.name || '',
					website: business.website || '',
					address_id: business.address_id || '',
					allergens: toArray(business.allergens),
					diets: toArray(business.diets),
					phone: business.phone || '',
					hours: business.hours || [],
					disclaimers: business.disclaimers || [],
					cuisine: business.cuisine || '',
				});

				if (business.address && typeof business.address === 'object') {
					setAddressInfo({
						street: business.address.street || '',
						city: business.address.city || '',
						state: business.address.state || '',
						zipCode: business.address.zipCode || '',
					});
				} else if (business.address_id) {
					const addressRes = await api.addresses.getById(business.address_id);
					if (addressRes.ok && addressRes.data) {
						const addr = addressRes.data;
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
			} finally {
				setIsLoading(false);
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

	const handleAllergenChange = (e, allergenId) => {
		const updated = e.target.checked
			? [...businessInfo.allergens, allergenId]
			: businessInfo.allergens.filter((id) => id !== allergenId);
		handleBusinessChange('allergens', updated);
	};

	const handleDietChange = (e, dietValue) => {
		const updated = e.target.checked
			? [...businessInfo.diets, dietValue]
			: businessInfo.diets.filter((d) => d !== dietValue);
		handleBusinessChange('diets', updated);
	};

	const cancel = (event) => {
		event.preventDefault();
		navigate('/dashboard');
	};

	const save = async (event) => {
		event.preventDefault();
		setIsSaving(true);
		setSaveError('');

		try {
			let addressId = businessInfo.address_id;
			const isLegacyAddressId =
				addressId && typeof addressId === 'string' && addressId.includes(',');

			if (!addressId || isLegacyAddressId) {
				const createRes = await api.addresses.create(addressInfo);
				if (!createRes.ok || !createRes.data)
					throw new Error('Failed to create address');
				addressId = createRes.data.id;
				setBusinessInfo((prev) => ({ ...prev, address_id: addressId }));
			} else {
				const updateRes = await api.addresses.update(addressId, {
					street: addressInfo.street,
					city: addressInfo.city,
					state: addressInfo.state,
					zipCode: addressInfo.zipCode,
				});
				if (!updateRes.ok) throw new Error('Failed to update address');
			}

			const updatedBusiness = {
				id: businessId,
				name: businessInfo.name,
				website: businessInfo.website,
				address_id: addressId,
				allergens: businessInfo.allergens,
				diets: businessInfo.diets,
			};

			const response = await api.businesses.update(businessId, updatedBusiness);
			if (!response.ok) throw new Error('Failed to update business');

			setShowConfirmation(true);
		} catch (error) {
			console.error('Error updating business:', error);
			setSaveError('Something went wrong. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="ebi-loading">
				<LoadingSpinner text="Loading business info…" />
			</div>
		);
	}

	return (
		<div className="ebi-container">
			{showConfirmation && (
				<GetConfirmationMessage
					message="Business information saved successfully."
					destination="/dashboard"
				/>
			)}


			<div className="ebi-header">
				<h1 className="ebi-title">Business Information</h1>
				<p className="ebi-subtitle">
					This information is displayed to your customers.
				</p>
			</div>

			<form className="ebi-form" onSubmit={save}>

				{/* ── Basic Info ───────────────────────────── */}
				<section className="ebi-section">
					<h2 className="ebi-section-title">Basic Info</h2>
					<div className="ebi-field-row">
						<div className="ebi-field">
							<label htmlFor="ebi-name">Business Name</label>
							<input
								id="ebi-name"
								type="text"
								value={businessInfo.name}
								onChange={(e) => handleBusinessChange('name', e.target.value)}
								placeholder="Your business name"
								maxLength={60}
							/>
						</div>
						<div className="ebi-field">
							<label htmlFor="ebi-website">Website URL</label>
							<input
								id="ebi-website"
								type="text"
								value={businessInfo.website}
								onChange={(e) => handleBusinessChange('website', e.target.value)}
								placeholder="https://yourbusiness.com"
							/>
						</div>
					</div>
				</section>

				{/* ── Address ──────────────────────────────── */}
				<section className="ebi-section">
					<h2 className="ebi-section-title">Address</h2>
					<AddressFields
						addressData={addressInfo}
						onAddressChange={handleAddressChange}
					/>
				</section>

				{/* ── Allergens ────────────────────────────── */}
				<section className="ebi-section">
					<h2 className="ebi-section-title">Always-Present Allergens</h2>
					<p className="ebi-section-hint">
						Select allergens that are always present somewhere in your menu.
						Customers with these allergies will be warned.
					</p>
					<div className="ebi-checkbox-grid">
						<GenerateAllergenList
							selectedAllergens={businessInfo.allergens}
							onAllergenChange={handleAllergenChange}
						/>
					</div>
				</section>

				{/* ── Dietary Options ──────────────────────── */}
				<section className="ebi-section">
					<h2 className="ebi-section-title">Dietary Options</h2>
					<p className="ebi-section-hint">
						Select the diets your menu supports. Customers filter by these to
						find businesses like yours.
					</p>
					<div className="ebi-checkbox-grid ebi-checkbox-grid--diets">
						<GenerateDietList
							selectedDiets={businessInfo.diets}
							onDietChange={handleDietChange}
						/>
					</div>
				</section>

				{/* ── Actions ──────────────────────────────── */}
				{saveError && (
					<p className="ebi-save-error" role="alert">{saveError}</p>
				)}

				<div className="ebi-actions">
					<button
						type="button"
						onClick={cancel}
						className="button gray-btn"
					>
						Cancel
					</button>

					<div className="ebi-actions-right">
						<span className="ebi-save-note">
							* Displayed publicly to customers
						</span>
						<button
							type="submit"
							className="button"
							disabled={isSaving}
						>
							{isSaving ? <LoadingSpinner size={18} /> : 'Save Changes'}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default EditBusinessInfo;
