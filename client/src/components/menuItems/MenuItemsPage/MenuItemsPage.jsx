import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuItemPanel from '../MenuItemPanel/MenuItemPanel.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/global.scss';

const MenuItemsPage = () => {
	const [menuItems, setMenuItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [fetchedMenu, setFetchedMenu] = useState([]);
	const location = useLocation();
	const menuTitle = location.state?.menuTitle || 'Untitled Menu';
	const navigate = useNavigate();

	// To be used in useEffect to fetch menuItems on intiial render, and to be called after handleDelete is used
	const fetchMenu = async () => {
		try {
			const businessID = localStorage.getItem('business_id');
			const encodedTitle = encodeURIComponent(menuTitle);
			const res = await axios.get(
				`http://localhost:5000/api/menuitems/menu?encodedMenuName=${encodedTitle}&businessID=${businessID}`,
			);
			setFetchedMenu(res.data);
		} catch (err) {
			console.error('Error fetching menu:', err);
		}
	};

	// used for refreshing the menu items.
	const fetchMenuItems = async () => {
		if (!fetchedMenu || !fetchedMenu.id) return;

		try {
			const itemRes = await axios.get(
				`http://localhost:5000/api/menuitems?menuID=${fetchedMenu.id}`,
			);
			const fetchedMenuItems = itemRes.data.map((menuItem) => ({
				...menuItem,
			}));
			setMenuItems(fetchedMenuItems);
		} catch (err) {
			console.error('Error fetching menu items:', err);
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
			await axios.put(
				`http://localhost:5000/api/menuitems/${updatedItem.id}`,
				updatedItem,
			);
			alert('Menu item updated successfully!');
			fetchMenuItems();
		} catch (err) {
			console.error('Error saving item:', err);
			alert('Failed to update item.');
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
						{menuTitle}
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
					{filteredItems.map((item) => (
						<MenuItemPanel
							key={item.id}
							item={item}
							menuID={fetchedMenu.id}
							onSave={handleSave}
							onDelete={handleDelete}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default MenuItemsPage;
