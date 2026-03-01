import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import '../../../styles/global.scss';
import './AddMenuItem.scss';
import Checkbox from '../../common/Checkbox/Checkbox';
import AllergenPicker from '../../common/AllergenPicker';
import ManageCategoriesModal from '../../common/ManageCategoriesModal';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner.jsx';
import { useToast } from '../../../context/ToastContext';

const STORAGE_KEY_LAST_CATEGORY = 'addMenuItem_lastCategory';

const ITEM_TYPES = [
	{ value: 'appetizer', label: 'Appetizer' },
	{ value: 'entree', label: 'Entree' },
	{ value: 'side', label: 'Side' },
	{ value: 'dessert', label: 'Dessert' },
	{ value: 'drink', label: 'Drink' },
];

const initialFormState = {
	name: '',
	ingredients: '',
	description: '',
	selectedAllergens: [],
	item_types: ['entree'],
	price: '',
	price_description: '',
	is_available: true,
};

const AddMenuItemForm = () => {
	const { showSuccess, showError } = useToast();
	const [masterMenuID, setMasterMenuID] = useState('');
	const [formData, setFormData] = useState(initialFormState);
	const [isSaving, setIsSaving] = useState(false);
	const [sectionsOpen, setSectionsOpen] = useState({
		basics: true,
		details: true,
		allergens: true,
	});
	const [categories, setCategories] = useState([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);
	const [showManageCategories, setShowManageCategories] = useState(false);
	const businessId = localStorage.getItem('businessId');
	const location = useLocation();
	const menuID = location.state?.menuID;
	const menuTitle = location.state?.menuTitle;
	const duplicateItem = location.state?.duplicateItem;
	const navigate = useNavigate();

	// Fetch custom categories for this business
	useEffect(() => {
		if (!businessId) return;
		setIsLoadingCategories(true);
		api.categories
			.list(businessId)
			.then((result) => {
				if (result.ok && Array.isArray(result.data)) setCategories(result.data);
			})
			.finally(() => setIsLoadingCategories(false));
	}, [businessId, showManageCategories]);

	// Pre-fill from duplicate or last category
	useEffect(() => {
		const storedMasterID = localStorage.getItem('masterMenu_ID');
		if (storedMasterID) setMasterMenuID(storedMasterID);
		if (duplicateItem && duplicateItem.id) {
			const types =
				Array.isArray(duplicateItem.item_types) &&
				duplicateItem.item_types.length > 0
					? [...duplicateItem.item_types]
					: [duplicateItem.item_type || 'entree'];
			setFormData({
				name: (duplicateItem.name || '').trim()
					? `${duplicateItem.name} (copy)`
					: '',
				ingredients: duplicateItem.ingredients || '',
				description: duplicateItem.description || '',
				selectedAllergens: Array.isArray(duplicateItem.allergens)
					? [...duplicateItem.allergens]
					: [],
				item_types: types,
				price: duplicateItem.price != null ? String(duplicateItem.price) : '',
				price_description: duplicateItem.price_description || '',
				is_available: duplicateItem.is_available !== false,
			});
			return;
		}
		const lastCat = sessionStorage.getItem(STORAGE_KEY_LAST_CATEGORY);
		if (lastCat) {
			setFormData((prev) => ({
				...prev,
				item_types: [lastCat],
			}));
		}
	}, [duplicateItem]);

	const toggleSection = (key) => {
		setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAllergenChange = (newAllergenIds) => {
		setFormData((prev) => ({
			...prev,
			selectedAllergens: newAllergenIds,
		}));
	};

	const resetForm = () => {
		setFormData(initialFormState);
	};

	const validateForm = () => {
		if (!formData.name || formData.name.trim() === '') {
			showError('Please enter a name for the menu item.');
			return false;
		}
		return true;
	};

	const saveItem = async () => {
		if (!validateForm()) return false;

		setIsSaving(true);
		try {
			const storedMenuId = localStorage.getItem('currentMenuId');
			const targetMenuId = menuID || storedMenuId || masterMenuID;

			const priceValue =
				formData.price !== '' ? parseFloat(formData.price) : null;

			const itemTypes =
				Array.isArray(formData.item_types) && formData.item_types.length > 0
					? formData.item_types
					: ['entree'];
			const response = await api.menuItems.addMenuItem({
				name: formData.name.trim(),
				description: formData.description.trim(),
				ingredients: formData.ingredients.trim(),
				allergens: formData.selectedAllergens,
				menu_id: targetMenuId,
				item_type: itemTypes[0],
				item_types: itemTypes,
				price: priceValue,
				price_description: formData.price_description.trim(),
				is_available: formData.is_available,
			});

			if (response.ok) {
				return true;
			} else {
				showError('Failed to save item.');
				return false;
			}
		} catch (err) {
			console.error('Error saving menu item:', err);
			showError('Failed to save item.');
			return false;
		} finally {
			setIsSaving(false);
		}
	};

	const persistCategory = () => {
		const first = formData.item_types?.[0];
		if (first) sessionStorage.setItem(STORAGE_KEY_LAST_CATEGORY, first);
	};

	const handleSaveAndClose = async () => {
		const success = await saveItem();
		if (success) {
			persistCategory();
			showSuccess('Item saved successfully!');
			navigate('/menuitems', {
				state: { menuTitle: menuTitle },
			});
		}
	};

	const handleSaveAndAddAnother = async () => {
		const success = await saveItem();
		if (success) {
			persistCategory();
			showSuccess('Item saved! Add another item.');
			resetForm();
		}
	};

	const toMenu = () => {
		navigate('/menuitems', {
			state: { menuTitle: menuTitle },
		});
	};

	// Keyboard: Ctrl+Enter = Save & Close, Escape = cancel
	const saveAndCloseRef = useRef(handleSaveAndClose);
	const toMenuRef = useRef(toMenu);
	saveAndCloseRef.current = handleSaveAndClose;
	toMenuRef.current = toMenu;
	useEffect(() => {
		const onKeyDown = (e) => {
			if (e.key === 'Escape') {
				toMenuRef.current();
				return;
			}
			if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
				e.preventDefault();
				saveAndCloseRef.current();
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<div className='add-menu-item'>
			{isLoadingCategories ? (
				<div className='add-menu-item__loading'>
					<LoadingSpinner text='Loading categories...' />
				</div>
			) : null}
			<div className='add-menu-item__header'>
				<button
					className='button gray-btn'
					onClick={toMenu}
				>
					Cancel
				</button>
				<h1 className='add-menu-item__title'>Add Menu Item</h1>
				<div className='add-menu-item__header-spacer' />
			</div>

			<div className='add-menu-item__form-container'>
				<form
					className='add-menu-item__form'
					onSubmit={(e) => e.preventDefault()}
				>
					<div className='add-menu-item__sections'>
						<section className='add-menu-item__section'>
							<button
								type='button'
								className='add-menu-item__section-header'
								onClick={() => toggleSection('basics')}
								aria-expanded={sectionsOpen.basics}
							>
								{sectionsOpen.basics ? (
									<FaChevronDown size={14} />
								) : (
									<FaChevronRight size={14} />
								)}
								<span>Basics</span>
							</button>
							{sectionsOpen.basics && (
								<div className='add-menu-item__form-grid add-menu-item__form-grid--single'>
									<div className='add-menu-item__left-column'>
										<div className='add-menu-item__field'>
											<label
												htmlFor='name'
												className='add-menu-item__label'
											>
												Name <span className='required'>*</span>
											</label>
											<input
												type='text'
												id='name'
												name='name'
												value={formData.name}
												onChange={handleInputChange}
												className='add-menu-item__input'
												placeholder='Enter item name'
												autoFocus
											/>
										</div>
										<div className='add-menu-item__field'>
											<div className='add-menu-item__category-row'>
												<label className='add-menu-item__label'>Category</label>
												<button
													type='button'
													className='add-menu-item__link-btn'
													onClick={() => setShowManageCategories(true)}
												>
													Manage categories
												</button>
											</div>
											<div className='add-menu-item__category-multi'>
												<div className='add-menu-item__category-chips'>
													{(formData.item_types || []).map((id) => {
														const builtIn = ITEM_TYPES.find(
															(t) => t.value === id,
														);
														const custom = categories.find((c) => c.id === id);
														const label = builtIn
															? builtIn.label
															: custom?.label || id;
														return (
															<span
																key={id}
																className='add-menu-item__chip'
															>
																{label}
																<button
																	type='button'
																	className='add-menu-item__chip-remove'
																	onClick={() => {
																		setFormData((prev) => {
																			const next = (
																				prev.item_types || []
																			).filter((x) => x !== id);
																			return {
																				...prev,
																				item_types: next.length
																					? next
																					: ['entree'],
																			};
																		});
																	}}
																	aria-label={`Remove ${label}`}
																>
																	&times;
																</button>
															</span>
														);
													})}
												</div>
												<select
													className='add-menu-item__select add-menu-item__category-select'
													value=''
													onChange={(e) => {
														const id = e.target.value;
														if (!id) return;
														setFormData((prev) => {
															const next = prev.item_types || [];
															if (next.includes(id)) return prev;
															return { ...prev, item_types: [...next, id] };
														});
														e.target.value = '';
													}}
													aria-label='Add category'
												>
													<option value=''>+ Add category</option>
													{ITEM_TYPES.map((t) => (
														<option
															key={t.value}
															value={t.value}
														>
															{t.label}
														</option>
													))}
													{categories.map((c) => (
														<option
															key={c.id}
															value={c.id}
														>
															{c.label}
														</option>
													))}
												</select>
											</div>
										</div>
										<div className='add-menu-item__row'>
											<div className='add-menu-item__field add-menu-item__field--half'>
												<label
													htmlFor='price'
													className='add-menu-item__label'
												>
													Price
												</label>
												<div className='add-menu-item__price-input'>
													<span className='add-menu-item__price-symbol'>$</span>
													<input
														type='number'
														id='price'
														name='price'
														value={formData.price}
														onChange={handleInputChange}
														className='add-menu-item__input'
														placeholder='0.00'
														step='0.01'
														min='0'
													/>
												</div>
											</div>
											<div className='add-menu-item__field add-menu-item__field--half'>
												<label
													htmlFor='price_description'
													className='add-menu-item__label'
												>
													Price Note
												</label>
												<input
													type='text'
													id='price_description'
													name='price_description'
													value={formData.price_description}
													onChange={handleInputChange}
													className='add-menu-item__input'
													placeholder='e.g., Market Price'
												/>
											</div>
										</div>
									</div>
								</div>
							)}
						</section>

						<section className='add-menu-item__section'>
							<button
								type='button'
								className='add-menu-item__section-header'
								onClick={() => toggleSection('details')}
								aria-expanded={sectionsOpen.details}
							>
								{sectionsOpen.details ? (
									<FaChevronDown size={14} />
								) : (
									<FaChevronRight size={14} />
								)}
								<span>Details</span>
							</button>
							{sectionsOpen.details && (
								<div className='add-menu-item__form-grid add-menu-item__form-grid--single'>
									<div className='add-menu-item__left-column'>
										<div className='add-menu-item__field'>
											<label
												htmlFor='description'
												className='add-menu-item__label'
											>
												Description
											</label>
											<textarea
												id='description'
												name='description'
												value={formData.description}
												onChange={handleInputChange}
												className='add-menu-item__textarea'
												placeholder='Brief description of the item'
												rows='3'
											/>
										</div>
										<div className='add-menu-item__field'>
											<label
												htmlFor='ingredients'
												className='add-menu-item__label'
											>
												Ingredients
											</label>
											<textarea
												id='ingredients'
												name='ingredients'
												value={formData.ingredients}
												onChange={handleInputChange}
												className='add-menu-item__textarea'
												placeholder='List the ingredients'
												rows='4'
											/>
											<p className='add-menu-item__hint'>
												Search on the menu items page will find items by any
												text in name, description, or ingredients. No special
												format required.
											</p>
										</div>
									</div>
								</div>
							)}
						</section>

						<section className='add-menu-item__section'>
							<button
								type='button'
								className='add-menu-item__section-header'
								onClick={() => toggleSection('allergens')}
								aria-expanded={sectionsOpen.allergens}
							>
								{sectionsOpen.allergens ? (
									<FaChevronDown size={14} />
								) : (
									<FaChevronRight size={14} />
								)}
								<span>Allergens & availability</span>
							</button>
							{sectionsOpen.allergens && (
								<div className='add-menu-item__form-grid add-menu-item__form-grid--single'>
									<div className='add-menu-item__right-column'>
										<div className='add-menu-item__field'>
											<label className='add-menu-item__label'>Allergens</label>
											<AllergenPicker
												selectedAllergens={formData.selectedAllergens}
												onChange={handleAllergenChange}
												showSelectedTags={true}
											/>
										</div>
										<div className='add-menu-item__field'>
											<label className='add-menu-item__toggle-label'>
												<Checkbox
													label='' // Empty - handled by option-label
													isSelected={formData.is_available}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															is_available: e.target.checked,
														}))
													}
													theme='mint'
													size='medium'
												/>
												<span className='add-menu-item__toggle-text'>
													{formData.is_available ? 'Available' : 'Unavailable'}
												</span>
											</label>
											<p className='add-menu-item__toggle-hint'>
												Unavailable items won't appear on your public menu
											</p>
										</div>
									</div>
								</div>
							)}
						</section>
					</div>

					<div className='add-menu-item__actions add-menu-item__actions--sticky'>
						<button
							type='button'
							className='button add-menu-item__btn-secondary'
							onClick={handleSaveAndAddAnother}
							disabled={isSaving}
						>
							{isSaving ? 'Saving...' : 'Save & Add Another'}
						</button>
						<button
							type='button'
							className='button add-menu-item__btn-primary'
							onClick={handleSaveAndClose}
							disabled={isSaving}
						>
							{isSaving ? 'Saving...' : 'Save & Close'}
						</button>
					</div>
				</form>
			</div>
			<ManageCategoriesModal
				isOpen={showManageCategories}
				onClose={() => setShowManageCategories(false)}
				businessId={businessId}
				onSaved={() => {
					api.categories.list(businessId).then((r) => {
						if (r.ok && Array.isArray(r.data)) setCategories(r.data);
					});
				}}
			/>
		</div>
	);
};

export default AddMenuItemForm;
