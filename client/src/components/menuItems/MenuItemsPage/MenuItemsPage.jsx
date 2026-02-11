import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuItemPanel from '../MenuItemPanel/MenuItemPanel.jsx';
import { useNavigate } from 'react-router-dom';
import '../../../styles/global.scss';
import api from '../../../api';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage.jsx';
import GetConfirmationMessage from '../../common/ConfirmationMessage/ConfirmationMessage.jsx';

const MenuItemsPage = () => {
	const [menuItems, setMenuItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [fetchedMenu, setFetchedMenu] = useState(null);
	const [message, setMessage] = useState('');
	const [showError, setShowError] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const location = useLocation();
	const menuTitle = location.state?.menuTitle || 'Untitled Menu';
	const navigate = useNavigate();

	// To be used in useEffect to fetch menuItems on initial render, and to be called after handleDelete is used
	const fetchMenu = async () => {
		try {
			const businessId = localStorage.getItem('businessId');
			const result = await api.menuItems.getMenuForBusiness(businessId);
			if (result.ok && result.data) {
				setFetchedMenu(result.data);
				if (result.data.id) {
					localStorage.setItem('currentMenuId', result.data.id);
				}
			} else {
				// No menu exists yet for this business – synthesize a local representation
				const syntheticMenuId = `menu_${businessId}`;
				localStorage.setItem('currentMenuId', syntheticMenuId);
				setFetchedMenu({
					id: syntheticMenuId,
					title: 'Your Menu',
				});
			}
		} catch (err) {
			console.error('Error fetching menu:', err);
			setMessage('Failed to load menu.');
			setShowError(true);
		}
	};

	// used for refreshing the menu items.
	const fetchMenuItems = async () => {
		if (!fetchedMenu || !fetchedMenu.id) return;

		try {
			const result = await api.menuItems.getByMenuId(fetchedMenu.id);
			if (!result.ok || !Array.isArray(result.data)) {
				console.error('Error fetching menu items:', result.message);
				setMessage(result.message || 'Failed to load menu items.');
				setShowError(true);
				return;
			}
			const fetchedMenuItems = result.data.map((menuItem) => ({
				...menuItem,
			}));
			setMenuItems(fetchedMenuItems);
		} catch (err) {
			console.error('Error fetching menu items:', err);
			setMessage('Failed to load menu items.');
			setShowError(true);
		}
	};

	// Runs when the page is rendered
	useEffect(() => {
		// gets the menu to get the menu items from
		fetchMenu();
	}, [location.search]);

	useEffect(() => {
		// Loads teh menu Items
		fetchMenuItems();
	}, [fetchedMenu]);

	// saves the updated menu item.
	const handleSave = async (updatedItem) => {
		try {
			const result = await api.menuItems.updateItem(updatedItem.id, updatedItem);
			if (!result.ok) {
				throw new Error(result.message || 'Failed to update item');
			}
			setMessage('Menu item updated successfully!');
			setShowConfirmation(true);
			fetchMenuItems();
		} catch (err) {
			console.error('Error saving item:', err);
			setMessage('Failed to update item.');
			setShowError(true);
		}
	};

	// handles deleting a menuItem
	const handleDelete = (deletedId) => {
		// refreshes after a delete.
		fetchMenuItems();
	};

	// handles filtering the items for search
	const filteredItems = menuItems.filter((item) =>
		item.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// for navigation
	const toAddItem = (event) => {
		event.preventDefault();
		navigate('/add-menu-item', {
			state: { menuID: fetchedMenu.id, menuTitle: fetchedMenu.title },
		});
	};

	// ARCHIVED: Menu Item Swapping - Not part of MVP (single menu)
	// const toMenuSwap = (event) => {
	// 	event.preventDefault();
	// 	navigate('/swap-menu', {
	// 		state: { menuTitle: fetchedMenu.title },
	// 	});
	// };

	return (
		<div className='center'>
			<div className='menu-items-container'>
				{showConfirmation ? (
					<GetConfirmationMessage
						message={message}
						destination={0}
					/>
				) : (
					<></>
				)}

				{showError ? (
					<ErrorMessage
						message={message}
						destination={0}
						onClose={() => setShowError(false)}
					/>
				) : (
					<></>
				)}
				{/* Top section: buttons + menu name */}
				<div className='menu-header-row'>
					<div style={{ flex: 1 }}>
						<button
							className='button'
							onClick={toAddItem}
						>
							+ Add Item
						</button>
					</div>
					<div
						className='menu-name'
						style={{ flex: 1, textAlign: 'center' }}
					>
						{(fetchedMenu && fetchedMenu.title) || menuTitle}
					</div>
					{/* ARCHIVED: Menu Item Swapping - Not part of MVP (single menu) */}
					{/* <div style={{ flex: 1, textAlign: 'right' }}>
						<button
							className='button'
							onClick={toMenuSwap}
						>
							Integrate Menus
						</button>
					</div> */}
				</div>

				{/* Search bar */}
				<div className='menu-search-wrapper'>
					<input
						className='menu-search'
						type='text'
						placeholder='Search for Item'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				{/* Menu items list */}
				<div className='menu-item-list'>
					<h2>Menu Items</h2>
					{filteredItems.length === 0 ? (
						<p>No items in this menu yet.</p>
					) : (
						filteredItems.map((item) => (
							<MenuItemPanel
								key={item.id}
								item={item}
								menuID={fetchedMenu?.id}
								onSave={handleSave}
								onDelete={handleDelete}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default MenuItemsPage;
