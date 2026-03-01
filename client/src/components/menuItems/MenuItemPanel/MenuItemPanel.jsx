import { useState, useEffect } from 'react';
import {
	FaPencilAlt,
	FaTrash,
	FaEye,
	FaEyeSlash,
	FaTimes,
	FaCheck,
	FaCopy,
} from 'react-icons/fa';
import '../../../styles/global.scss';
import './MenuItemPanel.scss';
import { getAllergenLabels } from '../../../utils/allergenCache';
import api from '../../../api';
import AllergenPicker from '../../common/AllergenPicker';
import Checkbox from '../../common/Checkbox/Checkbox';
import { useToast } from '../../../context/ToastContext';

const ITEM_TYPES = [
	{ value: 'appetizer', label: 'Appetizer' },
	{ value: 'entree', label: 'Entree' },
	{ value: 'side', label: 'Side' },
	{ value: 'dessert', label: 'Dessert' },
	{ value: 'drink', label: 'Drink' },
];

const MenuItemPanel = ({
	item,
	menuID,
	menuTitle,
	categoryOptions = [],
	onSave,
	onDelete,
	onDuplicate,
}) => {
	const { showSuccess, showError: showToastError } = useToast();
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [formData, setFormData] = useState({ ...item });
	const [allergenLabels, setAllergenLabels] = useState([]);
	const [selectedAllergenIds, setSelectedAllergenIds] = useState([]);

	useEffect(() => {
		let mounted = true;
		const loadAllergenLabels = async () => {
			try {
				if (item?.allergens?.length > 0) {
					const ids = item.allergens.map((a) =>
						typeof a === 'string' ? a.toLowerCase() : a.id,
					);
					const labels = await getAllergenLabels(ids);
					if (mounted) setAllergenLabels(labels);
				} else {
					if (mounted) setAllergenLabels([]);
				}
			} catch (err) {
				console.error('Could not load allergen labels', err);
			}
		};
		loadAllergenLabels();
		return () => {
			mounted = false;
		};
	}, [item]);

	const enterEditMode = () => {
		const types =
			item.item_types ||
			(item.item_type != null ? [item.item_type] : ['entree']);
		setFormData({
			...item,
			item_type: types[0],
			item_types: types,
		});
		const ids =
			item.allergens?.map((a) => (typeof a === 'string' ? a : a.id)) || [];
		setSelectedAllergenIds(ids);
		setIsEditing(true);
	};

	const cancelEdit = () => {
		setFormData({ ...item });
		setIsEditing(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		if (!formData.name || formData.name.trim() === '') {
			showToastError('Please enter a name for the menu item.');
			return;
		}

		const priceValue =
			formData.price !== '' &&
			formData.price !== null &&
			formData.price !== undefined
				? parseFloat(formData.price)
				: null;

		const itemTypes =
			formData.item_types ||
			(formData.item_type != null ? [formData.item_type] : ['entree']);
		const updated = {
			...formData,
			item_type: itemTypes[0],
			item_types: itemTypes,
			allergens: selectedAllergenIds,
			price: priceValue,
			price_description: formData.price_description || '',
			is_available: formData.is_available !== false,
		};

		onSave(updated);
		setIsEditing(false);
	};

	const handleToggleAvailability = async () => {
		const newAvailability = item.is_available === false ? true : false;
		const updated = { ...item, is_available: newAvailability };
		onSave(updated);
	};

	const handleDelete = async () => {
		try {
			const result = await api.menuItems.deleteItem(item.id);
			if (!result.ok) {
				throw new Error(result.message || 'Failed to delete menu item');
			}
			if (onDelete) onDelete(item.id);
			showSuccess('Menu item deleted successfully!');
		} catch (err) {
			console.error('Error deleting menu item:', err);
			showToastError('Failed to delete menu item.');
		}
		setShowDeleteConfirm(false);
	};

	const formatPrice = (price) => {
		if (price === null || price === undefined || price === '') return null;
		return `$${parseFloat(price).toFixed(2)}`;
	};

	const getCategoryLabel = (itemType) => {
		const builtIn = ITEM_TYPES.find((t) => t.value === itemType);
		if (builtIn) return builtIn.label;
		const custom = categoryOptions.find((c) => c.id === itemType);
		return custom ? custom.label : itemType;
	};

	const itemTypes =
		item.item_types || (item.item_type != null ? [item.item_type] : []);
	const categoryLabel =
		itemTypes
			.map((id) => getCategoryLabel(id))
			.filter(Boolean)
			.join(', ') || '—';

	const isUnavailable = item.is_available === false;

	if (isEditing) {
		return (
			<div className='menu-item-card menu-item-card--editing'>
				<div className='menu-item-card__edit-header'>
					<h3>Edit Item</h3>
					<div className='menu-item-card__edit-actions'>
						<button
							className='menu-item-card__btn menu-item-card__btn--cancel'
							onClick={cancelEdit}
						>
							<FaTimes /> Cancel
						</button>
						<button
							className='menu-item-card__btn menu-item-card__btn--save'
							onClick={handleSave}
						>
							<FaCheck /> Save
						</button>
					</div>
				</div>

				<div className='menu-item-card__edit-form'>
					<div className='menu-item-card__edit-row'>
						<div className='menu-item-card__edit-field menu-item-card__edit-field--flex'>
							<label>Name *</label>
							<input
								type='text'
								name='name'
								value={formData.name || ''}
								onChange={handleChange}
								placeholder='Item name'
							/>
						</div>
						<div className='menu-item-card__edit-field menu-item-card__edit-field--small'>
							<label>Category</label>
							<select
								name='item_type'
								value={formData.item_type || 'entree'}
								onChange={handleChange}
							>
								{(categoryOptions.length
									? categoryOptions
									: ITEM_TYPES.map((t) => ({ id: t.value, label: t.label }))
								).map((opt) => (
									<option
										key={opt.id}
										value={opt.id}
									>
										{opt.label}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className='menu-item-card__edit-row'>
						<div className='menu-item-card__edit-field menu-item-card__edit-field--small'>
							<label>Price</label>
							<div className='menu-item-card__price-input'>
								<span>$</span>
								<input
									type='number'
									name='price'
									value={formData.price || ''}
									onChange={handleChange}
									placeholder='0.00'
									step='0.01'
									min='0'
								/>
							</div>
						</div>

						<div className='menu-item-card__edit-field menu-item-card__edit-field--medium'>
							<label>Price Note</label>
							<input
								type='text'
								name='price_description'
								value={formData.price_description || ''}
								onChange={handleChange}
								placeholder='e.g., Market Price'
							/>
						</div>
					</div>

					<div className='menu-item-card__edit-field'>
						<label>Description</label>
						<textarea
							name='description'
							value={formData.description || ''}
							onChange={handleChange}
							placeholder='Brief description of the item'
							rows='2'
						/>
					</div>

					<div className='menu-item-card__edit-field'>
						<label>Ingredients</label>
						<textarea
							name='ingredients'
							value={formData.ingredients || ''}
							onChange={handleChange}
							placeholder='List the ingredients'
							rows='2'
						/>
					</div>

					<div className='menu-item-card__edit-row'>
						<div className='menu-item-card__edit-field menu-item-card__edit-field--flex'>
							<label>Allergens</label>
							<AllergenPicker
								selectedAllergens={selectedAllergenIds}
								onChange={setSelectedAllergenIds}
								showSelectedTags={true}
								compact={true}
							/>
						</div>
					</div>

					<div className='menu-item-card__edit-row'>
						<div className='menu-item-card__edit-field available-field'>
							<label className='menu-item-card__toggle-label'>
								<Checkbox
									label='' // Empty - handled by option-label
									isSelected={formData.is_available !== false}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											is_available: e.target.checked,
										}))
									}
									theme='mint'
									size='medium'
								/>
								<span>Available on menu</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`menu-item-card ${isUnavailable ? 'menu-item-card--unavailable' : ''}`}
		>
			<div className='menu-item-card__main'>
				<div className='menu-item-card__info'>
					<div className='menu-item-card__header'>
						<h3 className='menu-item-card__name'>{item.name}</h3>
						{item.price && (
							<span className='menu-item-card__price'>
								{formatPrice(item.price)}
							</span>
						)}
					</div>

					{item.price_description && (
						<span className='menu-item-card__price-note'>
							{item.price_description}
						</span>
					)}

					{item.description && (
						<p className='menu-item-card__description'>{item.description}</p>
					)}

					<div className='menu-item-card__meta'>
						<span className='menu-item-card__category'>{categoryLabel}</span>
						{isUnavailable && (
							<span className='menu-item-card__unavailable-badge'>
								Unavailable
							</span>
						)}
					</div>
				</div>

				<div className='menu-item-card__allergens'>
					{allergenLabels.length > 0 ? (
						<div className='menu-item-card__allergen-tags'>
							{allergenLabels.map((label, idx) => (
								<span
									key={idx}
									className='menu-item-card__allergen-tag'
									title={label}
								>
									{label}
								</span>
							))}
						</div>
					) : (
						<span className='menu-item-card__no-allergens'>No allergens</span>
					)}
				</div>
			</div>

			<div className='menu-item-card__actions'>
				{onDuplicate && (
					<button
						className='menu-item-card__action-btn'
						onClick={() => onDuplicate(item)}
						title='Duplicate item'
						aria-label='Duplicate item'
					>
						<FaCopy />
					</button>
				)}
				<button
					className='menu-item-card__action-btn'
					onClick={handleToggleAvailability}
					title={isUnavailable ? 'Mark as available' : 'Mark as unavailable'}
				>
					{isUnavailable ? <FaEye /> : <FaEyeSlash />}
				</button>
				<button
					className='menu-item-card__action-btn'
					onClick={enterEditMode}
					title='Edit item'
				>
					<FaPencilAlt />
				</button>
				<button
					className='menu-item-card__action-btn menu-item-card__action-btn--delete'
					onClick={() => setShowDeleteConfirm(true)}
					title='Delete item'
				>
					<FaTrash />
				</button>
			</div>

			{showDeleteConfirm && (
				<div className='menu-item-card__delete-confirm'>
					<p>Delete "{item.name}"?</p>
					<div className='menu-item-card__delete-actions'>
						<button
							className='button gray-btn'
							onClick={() => setShowDeleteConfirm(false)}
						>
							Cancel
						</button>
						<button
							className='button menu-item-card__btn--danger'
							onClick={handleDelete}
						>
							Delete
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MenuItemPanel;
