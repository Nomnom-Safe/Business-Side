import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaPencilAlt } from 'react-icons/fa';
import MenuItemPanel from '../MenuItemPanel/MenuItemPanel.jsx';
import '../../../styles/global.scss';
import './MenuItemsPage.scss';
import api from '../../../api';
import { useToast } from '../../../context/ToastContext';
import { useAllergens } from '../../../hooks/useAllergens';

const BUILTIN_CATEGORIES = [
	{ id: 'appetizer', label: 'Appetizers' },
	{ id: 'entree', label: 'Entrees' },
	{ id: 'side', label: 'Sides' },
	{ id: 'dessert', label: 'Desserts' },
	{ id: 'drink', label: 'Drinks' },
];

const AVAILABILITY_OPTIONS = [
	{ id: 'all', label: 'All Items' },
	{ id: 'available', label: 'Available Only' },
	{ id: 'unavailable', label: 'Unavailable Only' },
];

const SORT_OPTIONS = [
	{ value: 'category', label: 'Category' },
	{ value: 'name_asc', label: 'Name (A–Z)' },
	{ value: 'name_desc', label: 'Name (Z–A)' },
	{ value: 'price_asc', label: 'Price (low–high)' },
	{ value: 'price_desc', label: 'Price (high–low)' },
];

const SORT_STORAGE_KEY = 'menuitems_sortBy';
const VALID_SORT_VALUES = SORT_OPTIONS.map((o) => o.value);

const MenuItemsPage = () => {
	const { showSuccess, showError } = useToast();
	const allergens = useAllergens();
	const [menuItems, setMenuItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [activeCategory, setActiveCategory] = useState('all');
	const [availabilityFilter, setAvailabilityFilter] = useState('all');
	const [selectedAllergenFilters, setSelectedAllergenFilters] = useState([]);
	const [showFilters, setShowFilters] = useState(false);
	const [fetchedMenu, setFetchedMenu] = useState(null);
	const [customCategories, setCustomCategories] = useState([]);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editTitleValue, setEditTitleValue] = useState('');
	const [sortBy, setSortBy] = useState(() => {
		const stored = sessionStorage.getItem(SORT_STORAGE_KEY);
		return stored && VALID_SORT_VALUES.includes(stored) ? stored : 'category';
	});
	const location = useLocation();
	const menuTitle = location.state?.menuTitle || 'Untitled Menu';
	const navigate = useNavigate();

	const displayTitle = (fetchedMenu && fetchedMenu.title) || menuTitle;

	// Tabs: All + built-in + custom categories
	const tabCategories = useMemo(() => [
		{ id: 'all', label: 'All' },
		...BUILTIN_CATEGORIES,
		...customCategories.map((c) => ({ id: c.id, label: c.label })),
	], [customCategories]);

	// Map allergen id -> label for search-by-allergen
	const allergenIdToLabel = useMemo(() => {
		const map = {};
		allergens.forEach((a) => { map[a.id] = a.label || ''; });
		return map;
	}, [allergens]);

	const fetchMenu = async () => {
		try {
			const businessId = localStorage.getItem('businessId');
			let result = await api.menuItems.getMenuForBusiness(businessId);

			// If no menu exists, ensure one is created then refetch so title is always editable
			if (result.ok && !result.data) {
				const ensureResult = await api.menus.ensureForBusiness(businessId);
				if (ensureResult.ok && ensureResult.data) {
					result = { ok: true, data: ensureResult.data };
				}
			}

			if (result.ok && result.data) {
				const menu = result.data;
				setFetchedMenu({
					...menu,
					title: menu.title || 'Your Menu',
				});
				if (menu.id) {
					localStorage.setItem('currentMenuId', menu.id);
				}
			} else {
				const syntheticMenuId = `menu_${businessId}`;
				localStorage.setItem('currentMenuId', syntheticMenuId);
				setFetchedMenu({
					id: syntheticMenuId,
					title: 'Your Menu',
				});
			}
		} catch (err) {
			console.error('Error fetching menu:', err);
			showError('Failed to load menu.');
		}
	};

	const fetchMenuItems = async () => {
		if (!fetchedMenu || !fetchedMenu.id) return;

		try {
			const result = await api.menuItems.getByMenuId(fetchedMenu.id);
			if (!result.ok || !Array.isArray(result.data)) {
				console.error('Error fetching menu items:', result.message);
				showError(result.message || 'Failed to load menu items.');
				return;
			}
			setMenuItems(result.data);
		} catch (err) {
			console.error('Error fetching menu items:', err);
			showError('Failed to load menu items.');
		}
	};

	useEffect(() => {
		fetchMenu();
	}, [location.search]);

	useEffect(() => {
		const businessId = localStorage.getItem('businessId');
		if (!businessId) return;
		api.categories.list(businessId).then((r) => {
			if (r.ok && Array.isArray(r.data)) setCustomCategories(r.data);
		});
	}, []);

	useEffect(() => {
		fetchMenuItems();
	}, [fetchedMenu]);

	const handleSave = async (updatedItem) => {
		try {
			const result = await api.menuItems.updateItem(updatedItem.id, updatedItem);
			if (!result.ok) {
				throw new Error(result.message || 'Failed to update item');
			}
			showSuccess('Menu item updated successfully!');
			fetchMenuItems();
		} catch (err) {
			console.error('Error saving item:', err);
			showError('Failed to update item.');
		}
	};

	const handleDelete = (deletedId) => {
		fetchMenuItems();
	};

	const toggleAllergenFilter = (allergenId) => {
		setSelectedAllergenFilters((prev) =>
			prev.includes(allergenId)
				? prev.filter((id) => id !== allergenId)
				: [...prev, allergenId]
		);
	};

	const clearAllFilters = () => {
		setSearchTerm('');
		setActiveCategory('all');
		setAvailabilityFilter('all');
		setSelectedAllergenFilters([]);
	};

	const hasActiveFilters = searchTerm !== '' || activeCategory !== 'all' || availabilityFilter !== 'all' || selectedAllergenFilters.length > 0;

	// Filter items by all criteria
	const filteredItems = useMemo(() => {
		return menuItems.filter((item) => {
			// Text search: name, description, ingredients, allergen names
			const searchLower = searchTerm.toLowerCase().trim();
			const matchesSearch = searchTerm === '' ||
				item.name?.toLowerCase().includes(searchLower) ||
				item.description?.toLowerCase().includes(searchLower) ||
				item.ingredients?.toLowerCase().includes(searchLower) ||
				(item.allergens || []).some((id) =>
					allergenIdToLabel[id]?.toLowerCase().includes(searchLower)
				);

			// Category filter (item_types array or legacy item_type)
			const itemTypes = item.item_types || (item.item_type != null ? [item.item_type] : []);
			const matchesCategory = activeCategory === 'all' || itemTypes.includes(activeCategory);

			// Availability filter
			const matchesAvailability = 
				availabilityFilter === 'all' ||
				(availabilityFilter === 'available' && item.is_available !== false) ||
				(availabilityFilter === 'unavailable' && item.is_available === false);

			// Allergen filter: show items that contain ANY of the selected allergens
			const matchesAllergens = selectedAllergenFilters.length === 0 ||
				selectedAllergenFilters.some((allergenId) => 
					item.allergens?.includes(allergenId)
				);

			return matchesSearch && matchesCategory && matchesAvailability && matchesAllergens;
		});
	}, [menuItems, searchTerm, activeCategory, availabilityFilter, selectedAllergenFilters, allergenIdToLabel]);

	// Category order for sort (tab order excluding "all")
	const categoryOrder = useMemo(
		() => tabCategories.filter((c) => c.id !== 'all').map((c) => c.id),
		[tabCategories]
	);

	// Sort filtered list (stable: secondary key = name)
	const sortedItems = useMemo(() => {
		const list = [...filteredItems];
		const primaryCat = (item) => item.item_types?.[0] || item.item_type || '';
		const catIndex = (id) => {
			const i = categoryOrder.indexOf(id);
			return i === -1 ? categoryOrder.length : i;
		};
		const nameFor = (item) => (item.name || '').toLowerCase();
		const priceFor = (item) => (item.price != null && item.price !== '' ? Number(item.price) : null);

		list.sort((a, b) => {
			if (sortBy === 'name_asc') return nameFor(a).localeCompare(nameFor(b)) || (a.id || '').localeCompare(b.id || '');
			if (sortBy === 'name_desc') return nameFor(b).localeCompare(nameFor(a)) || (b.id || '').localeCompare(a.id || '');
			if (sortBy === 'price_asc') {
				const pa = priceFor(a);
				const pb = priceFor(b);
				if (pa == null && pb == null) return nameFor(a).localeCompare(nameFor(b));
				if (pa == null) return 1;
				if (pb == null) return -1;
				return pa - pb || nameFor(a).localeCompare(nameFor(b));
			}
			if (sortBy === 'price_desc') {
				const pa = priceFor(a);
				const pb = priceFor(b);
				if (pa == null && pb == null) return nameFor(a).localeCompare(nameFor(b));
				if (pa == null) return 1;
				if (pb == null) return -1;
				return pb - pa || nameFor(a).localeCompare(nameFor(b));
			}
			// category: primary category order, then name
			const ca = catIndex(primaryCat(a));
			const cb = catIndex(primaryCat(b));
			return ca - cb || nameFor(a).localeCompare(nameFor(b));
		});
		return list;
	}, [filteredItems, sortBy, categoryOrder]);

	// Count items per category for tab badges
	const categoryCounts = useMemo(() => {
		const counts = { all: menuItems.length };
		tabCategories.forEach((cat) => {
			if (cat.id !== 'all') {
				counts[cat.id] = menuItems.filter((item) => {
					const types = item.item_types || (item.item_type != null ? [item.item_type] : []);
					return types.includes(cat.id);
				}).length;
			}
		});
		return counts;
	}, [menuItems, tabCategories]);

	const toAddItem = (event) => {
		event.preventDefault();
		navigate('/add-menu-item', {
			state: { menuID: fetchedMenu.id, menuTitle: fetchedMenu?.title || displayTitle },
		});
	};

	const handleDuplicate = (item) => {
		navigate('/add-menu-item', {
			state: {
				duplicateItem: item,
				menuID: fetchedMenu?.id,
				menuTitle: fetchedMenu?.title || displayTitle,
			},
		});
	};

	const hasRealMenu = fetchedMenu?.id && !String(fetchedMenu.id).startsWith('menu_');

	const startEditingTitle = () => {
		if (!hasRealMenu) return;
		setEditTitleValue(displayTitle);
		setIsEditingTitle(true);
	};

	const saveMenuTitle = async () => {
		if (!fetchedMenu?.id || !editTitleValue.trim()) {
			setIsEditingTitle(false);
			return;
		}
		const newTitle = editTitleValue.trim();
		try {
			const result = await api.menus.update(fetchedMenu.id, { title: newTitle });
			if (result.ok && result.data) {
				setFetchedMenu((prev) => (prev ? { ...prev, title: result.data.title ?? newTitle } : prev));
				showSuccess('Menu name updated.');
			} else {
				showError('Failed to update menu name.');
			}
		} catch (err) {
			console.error('Error updating menu title:', err);
			showError('Failed to update menu name.');
		}
		setIsEditingTitle(false);
	};

	const cancelEditingTitle = () => {
		setEditTitleValue(displayTitle);
		setIsEditingTitle(false);
	};

	return (
		<div className="menu-items-page">
			<div className="menu-items-page__container">
				{/* Header */}
				<div className="menu-items-page__header">
					<button className="button" onClick={toAddItem}>
						+ Add Item
					</button>
					<div className="menu-items-page__title-wrap">
						{isEditingTitle ? (
							<input
								className="menu-items-page__title-input"
								type="text"
								value={editTitleValue}
								onChange={(e) => setEditTitleValue(e.target.value)}
								onBlur={saveMenuTitle}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										saveMenuTitle();
									}
									if (e.key === 'Escape') cancelEditingTitle();
								}}
								onFocus={(e) => e.target.select()}
								autoFocus
								placeholder="Menu name"
								aria-label="Menu name"
							/>
						) : (
							<div
								className={`menu-items-page__title-row ${hasRealMenu ? 'menu-items-page__title-row--editable' : ''}`}
								onClick={hasRealMenu ? startEditingTitle : undefined}
								role={hasRealMenu ? 'button' : undefined}
								tabIndex={hasRealMenu ? 0 : undefined}
								onKeyDown={hasRealMenu ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startEditingTitle(); } } : undefined}
								title={hasRealMenu ? 'Click to edit menu name' : undefined}
								aria-label={hasRealMenu ? 'Edit menu name' : undefined}
							>
								<h1 className="menu-items-page__title">
									{displayTitle}
								</h1>
								{hasRealMenu && (
									<button
										type="button"
										className="menu-items-page__title-edit-btn"
										onClick={(e) => {
											e.stopPropagation();
											startEditingTitle();
										}}
										aria-label="Edit menu name"
									>
										<FaPencilAlt size={16} />
									</button>
								)}
							</div>
						)}
					</div>
					<div className="menu-items-page__header-spacer" />
				</div>

				{/* Search and filter bar - layout-based so icon never overlaps text */}
				<div className="menu-items-page__filter-bar">
					<div className="menu-items-page__search-wrapper">
						<div className="menu-items-page__search-prefix" aria-hidden="true">
							<FaSearch className="menu-items-page__search-icon" />
						</div>
						<input
							className="menu-items-page__search"
							type="text"
							placeholder="Search by name, description, ingredients, or allergens..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							aria-label="Search menu items"
						/>
						{searchTerm && (
							<button
								type="button"
								className="menu-items-page__search-clear"
								onClick={() => setSearchTerm('')}
								aria-label="Clear search"
							>
								<FaTimes />
							</button>
						)}
					</div>
					<button 
						className={`menu-items-page__filter-toggle ${showFilters ? 'menu-items-page__filter-toggle--active' : ''}`}
						onClick={() => setShowFilters(!showFilters)}
					>
						<FaFilter />
						Filters
						{hasActiveFilters && (
							<span className="menu-items-page__filter-badge" />
						)}
					</button>
				</div>

				{/* Expanded filters panel */}
				{showFilters && (
					<div className="menu-items-page__filters-panel">
						<div className="menu-items-page__filter-group">
							<label className="menu-items-page__filter-label">Availability</label>
							<div className="menu-items-page__filter-options">
								{AVAILABILITY_OPTIONS.map((option) => (
									<button
										key={option.id}
										className={`menu-items-page__filter-option ${availabilityFilter === option.id ? 'menu-items-page__filter-option--active' : ''}`}
										onClick={() => setAvailabilityFilter(option.id)}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>

						<div className="menu-items-page__filter-group">
							<label className="menu-items-page__filter-label">Contains Allergens</label>
							<div className="menu-items-page__filter-options menu-items-page__filter-options--wrap">
								{allergens.map((allergen) => (
									<button
										key={allergen.id}
										className={`menu-items-page__filter-option menu-items-page__filter-option--allergen ${selectedAllergenFilters.includes(allergen.id) ? 'menu-items-page__filter-option--active' : ''}`}
										onClick={() => toggleAllergenFilter(allergen.id)}
									>
										{allergen.label}
									</button>
								))}
							</div>
						</div>

						{hasActiveFilters && (
							<button className="menu-items-page__clear-filters" onClick={clearAllFilters}>
								<FaTimes /> Clear all filters
							</button>
						)}
					</div>
				)}

				{/* Category tabs */}
				<div className="menu-items-page__tabs">
					{tabCategories.map((category) => (
						<button
							key={category.id}
							className={`menu-items-page__tab ${activeCategory === category.id ? 'menu-items-page__tab--active' : ''}`}
							onClick={() => setActiveCategory(category.id)}
						>
							{category.label}
							{categoryCounts[category.id] > 0 && (
								<span className="menu-items-page__tab-count">
									{categoryCounts[category.id]}
								</span>
							)}
						</button>
					))}
				</div>

				{/* Menu items list */}
				<div className="menu-items-page__list">
					{filteredItems.length === 0 ? (
						<div className="menu-items-page__empty">
							{menuItems.length === 0 ? (
								<>
									<p>No items in this menu yet.</p>
									<button className="button" onClick={toAddItem}>
										Add your first item
									</button>
								</>
							) : (
								<>
									<p>No items match your search or filters.</p>
									{hasActiveFilters && (
										<button className="button gray-btn" onClick={clearAllFilters}>
											Clear filters
										</button>
									)}
								</>
							)}
						</div>
					) : (
						<>
							<div className="menu-items-page__list-header">
								<span className="menu-items-page__list-count">
									{filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
									{hasActiveFilters && ` (filtered from ${menuItems.length})`}
								</span>
								<div className="menu-items-page__sort">
									<label htmlFor="sort-by" className="menu-items-page__sort-label">
										Sort by
									</label>
									<select
										id="sort-by"
										className="menu-items-page__sort-select"
										value={sortBy}
										onChange={(e) => {
											const v = e.target.value;
											if (VALID_SORT_VALUES.includes(v)) {
												setSortBy(v);
												sessionStorage.setItem(SORT_STORAGE_KEY, v);
											}
										}}
										aria-label="Sort menu items"
									>
										{SORT_OPTIONS.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
								</div>
							</div>
							{sortedItems.map((item) => (
								<MenuItemPanel
									key={item.id}
									item={item}
									menuID={fetchedMenu?.id}
									menuTitle={displayTitle}
									categoryOptions={tabCategories.filter((c) => c.id !== 'all')}
									onSave={handleSave}
									onDelete={handleDelete}
									onDuplicate={handleDuplicate}
								/>
							))}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default MenuItemsPage;
