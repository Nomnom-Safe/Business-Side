import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCard from '../MenuCard/MenuCard.jsx';
import './MenuDashboard.scss';
import api from '../../../api';

/* Non-MVP Feature: Deleting menus. 
	import deleteIcon from '../../../assets/icons/delete.png';
*/

function MenuDashboard() {
	const [menus, setMenus] = useState([]);
	const navigate = useNavigate();

	/* Non-MVP Feature: Deleting menus.
		const [masterMenuID, setMasterMenuID] = useState([]);
		const [showConfirm, setShowConfirm] = useState(false);
		const [menuToDelete, setMenuToDelete] = useState(null);
	*/

	// Fetch menus from backend on initial render
	useEffect(() => {
		const fetchMenus = async () => {
			const businessId = localStorage.getItem('businessId');
			if (!businessId) {
				console.warn('No businessId in localStorage');
				return;
			}
			try {
				const result = await api.businesses.getById(businessId);
				if (!result.ok || !result.data) {
					console.error('Failed to fetch business menus');
					return;
				}

				if (!Array.isArray(result.data.menus)) {
					console.error('Expected menus to be an array:', result.data.menus);
					setMenus([]);
					return;
				}

				const fetchedMenus = result.data.menus.map((menu) => ({
					...menu,
					isEditable: menu.title !== 'Master Menu',
				}));

				setMenus(fetchedMenus);
			} catch (err) {
				console.error('Error fetching business menus:', err);
			}
		};
		fetchMenus();
	}, []);

	// Used for defaulting new Menu Items to be on the masterMenu later
	useEffect(() => {
		if (menus.length > 0) {
			const masterMenu = menus.find((menu) => menu.title === 'Master Menu');
			if (masterMenu?.id) {
				/* Non-MVP Feature: multiple menus.
					setMasterMenuID(masterMenu.id);
				*/
				localStorage.setItem('masterMenu_ID', masterMenu.id);
			}
		}
	}, [menus]);

	/* Non-MVP Feature: Adding new menus.
		// Add a new menu to backend and update state
		const handleAddMenu = async () => {
			const businessId = localStorage.getItem('businessId');
			if (!businessId) {
				console.error('No business ID found in localStorage.');
				return;
			}

			try {
				const res = await axios.post('http://localhost:5000/api/menus', {
					// title: 'Untitled Menu',
					// description: 'New menu created',
					business_id: businessId,
					// menuItems: [],
				});

				const newMenu = { ...res.data, isEditable: true };
				setMenus((prev) => [...prev, newMenu]); // Append to current menus
			} catch (err) {
				console.error('Error adding menu:', err);
			}
		};
	*/

	/* Non-MVP feature: Deleting menus.
		const handleRequestDelete = (index) => {
			setMenuToDelete(index);
			setShowConfirm(true);
		};

		const handleConfirmDelete = async () => {
			const menuToRemove = menus[menuToDelete];

		if (!menuToRemove?.id) {
			console.error('Menu ID missing — cannot delete');
			return;
		}

		try {
			await axios.delete(`http://localhost:5000/api/menus/${menuToRemove.id}`); // Make DELETE request

				// Remove menu from local state
				setMenus((prevMenus) => prevMenus.filter((_, i) => i !== menuToDelete));
				setMenuToDelete(null);
				setShowConfirm(false);
			} catch (err) {
				console.error('Error deleting menu:', err);
			}
		};

		const handleCancelDelete = () => {
			setShowConfirm(false);
			setMenuToDelete(null);
		};
	*/

	const handleTitleChange = (index, newTitle) => {
		const updatedMenus = menus.map((menu, i) =>
			i === index ? { ...menu, title: newTitle } : menu,
		);
		setMenus(updatedMenus);
	};

	const handleDescriptionChange = (index, newDescription) => {
		const updatedMenus = menus.map((menu, i) =>
			i === index ? { ...menu, description: newDescription } : menu,
		);
		setMenus(updatedMenus);
	};

	return (
		<div className='dashboard-container'>
			<div className='dashboard-header'>
				{/* Non-MVP Feature: Adding new menus.
					<button
						className='button add-menu-btn'
						onClick={handleAddMenu}
					>
						+ Add a Menu
					</button>
				*/}
				<h2 className='dashboard-title'>Your Menu Dashboard</h2>
			</div>

			{menus.length === 0 ? (
				<div className='no-menus-container'>
					<p>No menu exists for this business yet.</p>
					<button
						type='button'
						className='button'
						onClick={() =>
							navigate('/menuitems', {
								state: { menuTitle: 'Your Menu' },
							})
						}
					>
						Set up your menu
					</button>
				</div>
			) : (
				<div className='menu-grid'>
					{menus.map((menu, index) => (
						<div
							className='menu-card-wrapper'
							key={menu.id || index}
						>
							{/* Non-MVP Feature: Deleting menus.
								{menu.isEditable && (
									<img
										src={deleteIcon}
										alt='Delete'
										className='delete-icon'
										onClick={() => handleRequestDelete(index)}
									/>
								)}
							*/}
							<MenuCard
								menuId={menu.id}
								title={menu.title || 'Your Menu'}
								description={menu.description ?? ''}
								buttonLabel='View Menu'
								onTitleSaved={(newTitle) => handleTitleChange(index, newTitle)}
							/>
						</div>
					))}
				</div>
			)}

			{/* Non-MVP Feature: Deleting menus.
				{showConfirm && (
					<div className='confirm-delete-box'>
						<div className='confirm-content'>
							<p className='confirm-title'>Confirm Deletion?</p>
							<p className='confirm-message'>
								You are deleting <strong>{menus[menuToDelete]?.title}</strong>.
							</p>
						</div>
						<div className='delete-buttons-box'>
							<button
								type='button'
								className='delete-cancel'
								onClick={handleCancelDelete}
							>
								No, do not Delete
							</button>
							<button
								type='button'
								className='delete-confirm'
								onClick={handleConfirmDelete}
							>
								Yes, Delete
							</button>
						</div>
					</div>
				)}
			*/}
		</div>
	);
}

export default MenuDashboard;
