import { useState, useEffect } from 'react';
import '../../scss/global.scss';
import AllergenList from '../../auth/AllergenList/AllergenList';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Collapsible Panel Component
const CollapsiblePanel = ({
	header,
	formData,
	onFormChange,
	onAddPanel,
	masterMenuID,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedAllergens, setSelectedAllergens] = useState([]);
	const location = useLocation();
	const menuID = location.state?.menuID;

	const togglePanel = () => {
		setIsOpen(!isOpen);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		onFormChange({ ...formData, [name]: value });
	};

	// Save single menuItem
	const handleSave = async () => {
		if (!formData.name || formData.name.trim() === '') {
			alert('Please enter a name for the menu item.');
			return;
		}

		try {
			const menuIDs =
				masterMenuID === menuID ? [masterMenuID] : [masterMenuID, menuID];
			const response = await axios.post(
				'http://localhost:5000/api/menuitems/add-menu-item',
				{
					name: formData.name,
					description: formData.description,
					ingredients: formData.ingredients,
					allergens: formData.selectedAllergens || [],
					menuIDs: menuIDs,
				},
			);
			if (response.ok) {
				alert('Item saved successfully!');
			}
		} catch (err) {
			console.error('Error saving menu item:', err);
			alert('Failed to save item.');
		}
	};

	const handleAllergenChange = (event) => {
		const allergenValue = event.target.value;
		let updatedAllergens;

		if (event.target.checked) {
			updatedAllergens = [...selectedAllergens, allergenValue];
		} else {
			updatedAllergens = selectedAllergens.filter((a) => a !== allergenValue);
		}

		setSelectedAllergens(updatedAllergens);
		onFormChange({ ...formData, selectedAllergens: updatedAllergens }); // <-- Sync it here
	};

	const getAllergenLabels = () => {
		const allergenMap = {
			lactose: 'Lactose (milk)',
			gluten: 'Gluten',
			meat: 'Meat',
			fish: 'Fish',
			animalProducts: 'Animal Products',
			eggs: 'Eggs',
			shellfish: 'Shellfish',
			treeNuts: 'Tree Nuts',
			peanuts: 'Peanuts',
		};

		return selectedAllergens.map((value) => allergenMap[value]).join(', ');
	};

	return (
		<div className='center'>
			<div className='collapsible-panel-add'>
				<div
					className='panel-header'
					onClick={togglePanel}
				>
					<span
						className='angle-icon'
						onClick={togglePanel}
					>
						{isOpen ? <FaAngleDown /> : <FaAngleRight />}
					</span>
					{formData.name || header || `New Menu Item`}
				</div>
				{isOpen && (
					<div className='panel-body'>
						<div className='flex-container'>
							<form>
								<div className='left-side'>
									<div name='nameInput'>
										<h3>Name:</h3>
										<input
											type='text'
											id='name'
											name='name'
											value={formData.name}
											onChange={handleInputChange}
											style={{ width: '100%' }}
										/>
									</div>
									<div name='ingredientsInput'>
										<h3>Ingredients</h3>
										<textarea
											id='ingredients'
											name='ingredients'
											value={formData.ingredients}
											onChange={handleInputChange}
											rows='4'
											cols='50'
										></textarea>
									</div>
									<div className='descriptionInput'>
										<h3>Description</h3>
										<textarea
											id='description'
											name='description'
											value={formData.description}
											onChange={handleInputChange}
											rows='4'
											cols='50'
										></textarea>
									</div>
								</div>
								<div className='right-side'>
									<h3>This Item Contains the Following Allergens:</h3>
									<div className='display-allergens'>
										{selectedAllergens.length > 0 ? (
											getAllergenLabels()
										) : (
											<p className='no-allergens-message'>
												No allergens selected
											</p>
										)}
									</div>

									<p>Most Common Allergens</p>
									<div className='allergen-add'>
										<AllergenList
											selectedAllergens={selectedAllergens}
											onAllergenChange={handleAllergenChange}
										/>
									</div>
								</div>
							</form>
						</div>
					</div>
				)}
				<div className='panel-footer'>
					<button
						onClick={handleSave}
						className='button'
					>
						Save
					</button>
					<button
						onClick={onAddPanel}
						className='button'
					>
						Add Another Panel
					</button>
				</div>
			</div>
		</div>
	);
};

// The main form
const AddMenuItemForm = () => {
	const [masterMenuID, setMasterMenuID] = useState('');
	const [routeName, setRouteName] = useState('');
	const [panels, setPanels] = useState([
		{
			name: '',
			ingredients: '',
			description: '',
			selectedAllergens: [],
			menuIDs: [],
		},
	]);
	const location = useLocation();
	const menuID = location.state?.menuID;
	const menuTitle = location.state?.menuTitle;
	const navigate = useNavigate();

	// Call the functions to pull in the menus and menu items.
	useEffect(() => {
		// Get the MasterMenu ID
		const storedMasterID = localStorage.getItem('masterMenu_ID');

		if (storedMasterID) {
			setMasterMenuID(storedMasterID);
		}

		if (menuID) {
			setRouteName(menuTitle);
		} else {
			console.warn('No menuID found in route state.');
		}
	}, [menuID, menuTitle]);

	// Save all menuItems
	// must exist out side due to trying to get all of them.
	const handleSaveAll = async () => {
		try {
			// Calculating what to save into the menuItems
			const menuIDs =
				masterMenuID === menuID ? [masterMenuID] : [masterMenuID, menuID];

			const validPanels = panels.filter(
				(panel) => panel.name && panel.name.trim() !== '',
			);
			// Need names on those panels! Comparing # of panels to valid panels
			if (validPanels.length !== panels.length) {
				alert(
					'One or more items are missing names. Please enter a name for each item before saving.',
				);
				return;
			}
			// handles saving the valid panels
			const saveRequests = validPanels.map((panel) =>
				axios.post('http://localhost:5000/api/menuitems/add-menu-item', {
					name: panel.name,
					description: panel.description,
					ingredients: panel.ingredients,
					allergens: panel.selectedAllergens || [],
					menuIDs: menuIDs,
				}),
			);

			await Promise.all(saveRequests);
			alert('All items saved successfully!');
		} catch (err) {
			console.error('Error saving items:', err);
			alert('Failed to save all items.');
		}

		// refresh the page.
		navigate(0, {
			state: {
				menuID: menuID,
				menuTitle: menuTitle,
			},
		});
	};

	// Loading in the panels
	const handleAddPanel = () => {
		setPanels([...panels, {}]);
	};

	const handlePanelChange = (index, newFormData) => {
		setPanels((prevPanels) =>
			prevPanels.map((panel, i) => (i === index ? newFormData : panel)),
		);
	};

	// Go back to menu
	const toMenu = (event) => {
		navigate('/menuitems', {
			state: { menuTitle: routeName },
		});
	};

	return (
		<div>
			<div className='center add-center-flex'>
				<div className='add-header-row'>
					<div style={{ flex: 1 }}>
						<button
							className='button'
							onClick={toMenu}
						>
							Return to Menu
						</button>
					</div>
					<div
						className='menu-name'
						style={{ flex: 1, textAlign: 'center' }}
					>
						Add Menu Items
					</div>
					<div style={{ flex: 1, textAlign: 'right' }}>
						<button
							className='button'
							onClick={handleSaveAll}
						>
							Save All
						</button>
					</div>
				</div>
			</div>
			<div className='center add-center-flex'>
				{/* Render Collapsible Panels */}
				{panels.map((panelData, index) => (
					<CollapsiblePanel
						key={index}
						header={`New Menu Item ${index + 1}`}
						formData={panelData}
						onFormChange={(newFormData) =>
							handlePanelChange(index, newFormData)
						}
						onAddPanel={handleAddPanel}
						masterMenuID={masterMenuID}
					/>
				))}
			</div>
		</div>
	);
};

export default AddMenuItemForm;
