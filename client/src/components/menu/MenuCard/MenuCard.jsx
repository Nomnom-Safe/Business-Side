import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import './MenuCard.scss';
import api from '../../../api';
import { useToast } from '../../../context/ToastContext';

export default function MenuCard({
	menuId,
	title,
	description,
	buttonLabel,
	onTitleSaved,
}) {
	const navigate = useNavigate();
	const { showSuccess, showError } = useToast();
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editValue, setEditValue] = useState(title || 'Your Menu');
	const inputRef = useRef(null);

	const displayTitle = title || 'Your Menu';

	useEffect(() => {
		setEditValue(displayTitle);
	}, [displayTitle]);

	useEffect(() => {
		if (isEditingTitle && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditingTitle]);

	const handleStartEdit = () => {
		if (!menuId) return;
		setEditValue(displayTitle);
		setIsEditingTitle(true);
	};

	const handleSaveTitle = async () => {
		if (!menuId || !editValue.trim()) {
			setIsEditingTitle(false);
			setEditValue(displayTitle);
			return;
		}
		const newTitle = editValue.trim();
		try {
			const result = await api.menus.update(menuId, { title: newTitle });
			if (result.ok && result.data) {
				onTitleSaved?.(result.data.title ?? newTitle);
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

	const handleCancelEdit = () => {
		setEditValue(displayTitle);
		setIsEditingTitle(false);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSaveTitle();
		}
		if (e.key === 'Escape') {
			handleCancelEdit();
		}
	};

	const toMenu = () => {
		navigate('/menuitems', {
			state: { menuTitle: displayTitle },
		});
	};

	const canEdit = Boolean(menuId);

	return (
		<div className="menu-card">
			<div className="menu-card__title-row">
				{isEditingTitle ? (
					<input
						ref={inputRef}
						type="text"
						className="menu-title-input"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						onBlur={handleSaveTitle}
						onKeyDown={handleKeyDown}
						aria-label="Menu name"
					/>
				) : (
					<>
						<h3
							className={`menu-title ${canEdit ? 'menu-title--editable' : ''}`}
							onClick={canEdit ? handleStartEdit : undefined}
						>
							{displayTitle}
						</h3>
						{canEdit && (
							<button
								type="button"
								className="menu-card__edit-btn"
								onClick={(e) => {
									e.stopPropagation();
									handleStartEdit();
								}}
								aria-label="Edit menu name"
							>
								<FaPencilAlt size={14} />
							</button>
						)}
					</>
				)}
			</div>

			{description ? (
				<p className="menu-description">{description}</p>
			) : null}

			<button type="button" onClick={toMenu} className="view-menu-button">
				{buttonLabel}
			</button>
		</div>
	);
}
