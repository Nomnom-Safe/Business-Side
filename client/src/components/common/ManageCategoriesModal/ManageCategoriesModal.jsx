import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import Modal from '../Modal';
import api from '../../../api';
import { useToast } from '../../../context/ToastContext';
import './ManageCategoriesModal.scss';

export default function ManageCategoriesModal({ isOpen, onClose, businessId, onSaved }) {
	const { showSuccess, showError } = useToast();
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newLabel, setNewLabel] = useState('');
	const [editingId, setEditingId] = useState(null);
	const [editValue, setEditValue] = useState('');
	const [deletingId, setDeletingId] = useState(null);

	const fetchCategories = async () => {
		if (!businessId) return;
		setLoading(true);
		try {
			const result = await api.categories.list(businessId);
			if (result.ok && Array.isArray(result.data)) {
				setCategories(result.data);
			} else {
				setCategories([]);
			}
		} catch (err) {
			console.error('Failed to fetch categories:', err);
			showError('Failed to load categories.');
			setCategories([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen && businessId) fetchCategories();
	}, [isOpen, businessId]);

	const handleAdd = async () => {
		const label = newLabel.trim();
		if (!label) return;
		try {
			const result = await api.categories.create(businessId, { label });
			if (result.ok && result.data) {
				setCategories((prev) => [...prev, result.data]);
				setNewLabel('');
				showSuccess('Category added.');
				onSaved?.();
			} else {
				showError(result.message || 'Failed to add category.');
			}
		} catch (err) {
			console.error('Failed to add category:', err);
			showError('Failed to add category.');
		}
	};

	const handleStartEdit = (cat) => {
		setEditingId(cat.id);
		setEditValue(cat.label || '');
	};

	const handleSaveEdit = async () => {
		if (!editingId) return;
		const label = editValue.trim();
		if (!label) {
			setEditingId(null);
			return;
		}
		try {
			const result = await api.categories.update(businessId, editingId, { label });
			if (result.ok && result.data) {
				setCategories((prev) =>
					prev.map((c) => (c.id === editingId ? { ...c, label: result.data.label } : c))
				);
				setEditingId(null);
				showSuccess('Category updated.');
				onSaved?.();
			} else {
				showError(result.message || 'Failed to update category.');
			}
		} catch (err) {
			console.error('Failed to update category:', err);
			showError('Failed to update category.');
		}
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditValue('');
	};

	const handleDelete = async (id) => {
		try {
			const result = await api.categories.delete(businessId, id);
			if (result.ok) {
				setCategories((prev) => prev.filter((c) => c.id !== id));
				setDeletingId(null);
				showSuccess('Category deleted.');
				onSaved?.();
			} else {
				showError(result.message || 'Failed to delete category.');
			}
		} catch (err) {
			console.error('Failed to delete category:', err);
			showError('Failed to delete category.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Manage categories">
			<div className="manage-categories-modal">
				{loading ? (
					<p className="manage-categories-modal__loading">Loading…</p>
				) : (
					<>
						<div className="manage-categories-modal__add">
							<input
								type="text"
								className="manage-categories-modal__input"
								placeholder="New category name"
								value={newLabel}
								onChange={(e) => setNewLabel(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
							/>
							<button
								type="button"
								className="button manage-categories-modal__btn-add"
								onClick={handleAdd}
								disabled={!newLabel.trim()}
							>
								<FaPlus /> Add
							</button>
						</div>
						<ul className="manage-categories-modal__list">
							{categories.length === 0 && (
								<li className="manage-categories-modal__empty">
									No custom categories yet. Add one above or use the default categories when adding items.
								</li>
							)}
							{categories.map((cat) => (
								<li key={cat.id} className="manage-categories-modal__item">
									{editingId === cat.id ? (
										<>
											<input
												type="text"
												className="manage-categories-modal__input manage-categories-modal__input--inline"
												value={editValue}
												onChange={(e) => setEditValue(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === 'Enter') handleSaveEdit();
													if (e.key === 'Escape') handleCancelEdit();
												}}
												autoFocus
											/>
											<button
												type="button"
												className="manage-categories-modal__icon-btn"
												onClick={handleSaveEdit}
												aria-label="Save"
											>
												<FaCheck />
											</button>
											<button
												type="button"
												className="manage-categories-modal__icon-btn"
												onClick={handleCancelEdit}
												aria-label="Cancel"
											>
												<FaTimes />
											</button>
										</>
									) : (
										<>
											<span className="manage-categories-modal__label">{cat.label}</span>
											<button
												type="button"
												className="manage-categories-modal__icon-btn"
												onClick={() => handleStartEdit(cat)}
												aria-label="Edit category"
											>
												<FaPencilAlt size={12} />
											</button>
											{deletingId === cat.id ? (
												<span className="manage-categories-modal__confirm">
													Delete?{' '}
													<button
														type="button"
														className="manage-categories-modal__link-btn"
														onClick={() => handleDelete(cat.id)}
													>
														Yes
													</button>{' '}
													<button
														type="button"
														className="manage-categories-modal__link-btn"
														onClick={() => setDeletingId(null)}
													>
														No
													</button>
												</span>
											) : (
												<button
													type="button"
													className="manage-categories-modal__icon-btn manage-categories-modal__icon-btn--delete"
													onClick={() => setDeletingId(cat.id)}
													aria-label="Delete category"
												>
													<FaTrash size={12} />
												</button>
											)}
										</>
									)}
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</Modal>
	);
}
