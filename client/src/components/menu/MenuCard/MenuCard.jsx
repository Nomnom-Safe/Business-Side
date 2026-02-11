import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuCard.scss';
import api from '../../../api';

export default function MenuCard({
	title,
	description,
	buttonLabel,
	isEditable,
	onTitleChange,
	onDescriptionChange,
}) {
	const navigate = useNavigate();
	const [localTitle, setLocalTitle] = useState(title);
	const [localDescription, setLocalDescription] = useState(description);

	const handleTitleChange = (e) => {
		const newTitle = e.target.value;
		setLocalTitle(newTitle);
		onTitleChange(newTitle);
	};

	const handleDescriptionChange = (e) => {
		const newDesc = e.target.value;
		setLocalDescription(newDesc);
		onDescriptionChange(newDesc);
	};

	const toMenu = () => {
		navigate('/menuitems', {
			state: { menuTitle: localTitle }, // passing the editable title
		});
	};

	const saveTitleToDb = async () => {
		try {
			const businessId = localStorage.getItem('businessId');
			const result = await api.menus.updateTitleDescription({
				businessId,
				title: localTitle,
				description: localDescription,
			});
			if (result.ok) {
				console.log('Menu updated successfully:', result.data);
			} else {
				console.error('Error updating menu title:', result.message);
			}
		} catch (err) {
			console.error('Error updating menu title:', err);
		}
	};

	const saveDescriptionToDb = saveTitleToDb;

	return (
		<div className='menu-card'>
			{isEditable ? (
				<input
					className='menu-title-input'
					value={localTitle}
					onChange={handleTitleChange}
					onBlur={saveTitleToDb}
				/>
			) : (
				<h3 className='menu-title'>{title}</h3>
			)}

			{isEditable ? (
				<textarea
					className='menu-description-textarea'
					value={localDescription}
					onChange={handleDescriptionChange}
					onBlur={saveDescriptionToDb}
					rows={3}
				/>
			) : (
				<p className='menu-description'>{description}</p>
			)}

			<button
				onClick={toMenu}
				className='view-menu-button'
			>
				{buttonLabel}
			</button>
		</div>
	);
}
