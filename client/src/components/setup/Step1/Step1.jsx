// client/src/components/setup/Step1/Step1.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import AddressFields from '../../common/AddressFields/AddressFields';
import api from '../../../api';
import './Step1.scss';

const DEBOUNCE_MS = 300;

const defaultAddress = { street: '', city: '', state: '', zipCode: '' };

function Step1({ formData, updateFormData, validationErrors = {}, setValidationErrors }) {
	const name = formData?.name ?? '';
	const website = formData?.website ?? '';
	const address = formData?.address && typeof formData.address === 'object'
		? { ...defaultAddress, ...formData.address }
		: defaultAddress;

	const [showTips, setShowTips] = useState(false);
	const [placeSearch, setPlaceSearch] = useState('');
	const [placeSuggestions, setPlaceSuggestions] = useState([]);
	const [placeLoading, setPlaceLoading] = useState(false);
	const [placeDetailsLoading, setPlaceDetailsLoading] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const debounceRef = useRef(null);
	const sessionTokenRef = useRef(null);

	const handleChange = (e) => {
		const { name: fieldName, value } = e.target;
		if (typeof setValidationErrors === 'function' && validationErrors[fieldName]) {
			setValidationErrors((prev) => ({ ...prev, [fieldName]: null }));
		}
		if (fieldName === 'name') {
			updateFormData({ name: value });
		} else if (fieldName === 'website') {
			updateFormData({ website: value });
		}
	};

	const handleAddressChange = (updatedAddress) => {
		if (typeof setValidationErrors === 'function') {
			setValidationErrors((prev) => {
				const next = { ...prev };
				['street', 'city', 'state', 'zipCode', 'address'].forEach((k) => delete next[k]);
				return next;
			});
		}
		updateFormData({ address: updatedAddress });
	};

	const fetchSuggestions = useCallback(async (input) => {
		const trimmed = (input || '').trim();
		if (!trimmed) {
			setPlaceSuggestions([]);
			return;
		}
		setPlaceLoading(true);
		try {
			const token = sessionTokenRef.current || '';
			const res = await api.places.autocomplete(trimmed, token);
			if (res.ok && res.data && Array.isArray(res.data.predictions)) {
				setPlaceSuggestions(res.data.predictions);
				setShowSuggestions(true);
			} else {
				setPlaceSuggestions([]);
			}
		} catch {
			setPlaceSuggestions([]);
		} finally {
			setPlaceLoading(false);
		}
	}, []);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		const trimmed = (placeSearch || '').trim();
		if (!trimmed) {
			setPlaceSuggestions([]);
			setPlaceLoading(false);
			return;
		}
		debounceRef.current = setTimeout(() => fetchSuggestions(placeSearch), DEBOUNCE_MS);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [placeSearch, fetchSuggestions]);

	const onSelectPlace = async (placeId, description) => {
		setShowSuggestions(false);
		setPlaceSuggestions([]);
		setPlaceSearch(description || '');
		setPlaceDetailsLoading(true);
		try {
			const res = await api.places.details(placeId);
			if (res.ok && res.data) {
				const { name: placeName, website: placeWebsite, address: placeAddress } = res.data;
				updateFormData({
					name: placeName || '',
					website: placeWebsite || '',
					address: placeAddress && typeof placeAddress === 'object'
						? {
							street: placeAddress.street || '',
							city: placeAddress.city || '',
							state: placeAddress.state || '',
							zipCode: placeAddress.zipCode || '',
						}
						: { ...defaultAddress },
				});
			}
		} catch {
			// Keep form as-is on error
		} finally {
			setPlaceDetailsLoading(false);
			sessionTokenRef.current = null;
		}
	};

	const onPlaceSearchFocus = () => {
		if (placeSuggestions.length > 0) setShowSuggestions(true);
	};

	const onPlaceSearchBlur = () => {
		setTimeout(() => setShowSuggestions(false), 200);
	};

	return (
		<>
			<h1>Basic Business Information</h1>

			<div className="onboarding-card find-business">
				<label htmlFor="find-business-input" className="question">
					Find your business
				</label>
				<p className="find-business-hint">Start by searching for your business or address.</p>
				<div className="find-business-input-wrap">
					<input
						id="find-business-input"
						type="text"
						placeholder="Search for your business or address..."
						className="find-business-input"
						value={placeSearch}
						onChange={(e) => setPlaceSearch(e.target.value)}
						onFocus={onPlaceSearchFocus}
						onBlur={onPlaceSearchBlur}
						aria-autocomplete="list"
						aria-expanded={showSuggestions && placeSuggestions.length > 0}
						aria-controls="place-suggestions-list"
					/>
					{placeLoading && <span className="find-business-loading" aria-live="polite">Searching…</span>}
					{placeDetailsLoading && <span className="find-business-loading" aria-live="polite">Loading details…</span>}
					{showSuggestions && placeSuggestions.length > 0 && (
						<ul id="place-suggestions-list" className="place-suggestions" role="listbox">
							{placeSuggestions.map((p) => (
								<li
									key={p.place_id}
									role="option"
									className="place-suggestion"
									onMouseDown={(e) => { e.preventDefault(); onSelectPlace(p.place_id, p.description); }}
								>
									{p.description}
								</li>
							))}
						</ul>
					)}
				</div>
				<p className="find-business-attribution">Powered by Google</p>
			</div>

			{(name || address?.street) && (
				<p className="review-edit-copy">We&apos;ve filled in the details below. Review and edit if needed.</p>
			)}

			<form
				name='setUpStep1Form'
				className='step1-form'
			>
				<div className="onboarding-card business-info">
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
								aria-required='true'
								className='business-name'
								onChange={handleChange}
								value={name}
								aria-invalid={!!validationErrors.name}
								aria-describedby={validationErrors.name ? 'name-error' : undefined}
							/>
							{validationErrors.name && (
								<span id='name-error' className='field-error' role='alert'>{validationErrors.name}</span>
							)}
						</div>

						<div>
							<input
								type='text'
								name='website'
								placeholder='Web Profile URL'
								className='website'
								onChange={handleChange}
								value={website}
								aria-invalid={!!validationErrors.website}
								aria-describedby={validationErrors.website ? 'website-error' : undefined}
							/>
							{validationErrors.website && (
								<span id='website-error' className='field-error' role='alert'>{validationErrors.website}</span>
							)}
						</div>
					</div>
				</div>

				<div className="onboarding-card address-section">
					<span className='question'>
						Please enter your business's address:
					</span>
					<p className="address-hint">All address fields are required.</p>

					<AddressFields
						addressData={address}
						onAddressChange={handleAddressChange}
						validationErrors={validationErrors}
					/>
				</div>

				<div className="notes-collapsible">
					<button
						type="button"
						className="notes-toggle"
						onClick={() => setShowTips((prev) => !prev)}
						aria-expanded={showTips}
						aria-controls="step1-tips"
					>
						{showTips ? 'Hide tips' : 'Tips & notes'}
					</button>
					{showTips && (
						<div id="step1-tips" className="notes" role="region" aria-label="Tips and notes">
							<h2>Please Note:</h2>
							<ul>
								<li>
									Information given in this section will be shown publicly to the
									users (your customers). Please only give info you want them to
									see.
								</li>
								<li>
									If you are a mobile food truck service, please put your most
									recent or upcoming location, or the location of an event, in the
									address fields. This location can be changed anytime via business settings.
								</li>
							</ul>
						</div>
					)}
				</div>
			</form>
		</>
	);
}

export default Step1;
