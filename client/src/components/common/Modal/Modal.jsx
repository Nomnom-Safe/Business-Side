import { useEffect, useRef } from 'react';
import './Modal.scss';

export default function Modal({ isOpen, onClose, title, children }) {
	const overlayRef = useRef(null);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	const handleOverlayClick = (e) => {
		if (e.target === overlayRef.current) onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			ref={overlayRef}
			className="modal-overlay"
			onClick={handleOverlayClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
		>
			<div className="modal">
				{title && (
					<div className="modal__header">
						<h2 id="modal-title" className="modal__title">
							{title}
						</h2>
						<button
							type="button"
							className="modal__close"
							onClick={onClose}
							aria-label="Close"
						>
							&times;
						</button>
					</div>
				)}
				<div className="modal__body">{children}</div>
			</div>
		</div>
	);
}
