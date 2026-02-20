import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Toast.scss';

const TOAST_ICONS = {
	success: FaCheckCircle,
	error: FaExclamationCircle,
	info: FaInfoCircle,
	warning: FaExclamationCircle,
};

function Toast({ id, type = 'info', message, duration = 4000, onClose }) {
	useEffect(() => {
		if (duration > 0) {
			const timer = setTimeout(() => {
				onClose(id);
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [id, duration, onClose]);

	const Icon = TOAST_ICONS[type] || FaInfoCircle;

	return (
		<div className={`toast toast--${type}`} role="alert">
			<Icon className="toast__icon" />
			<span className="toast__message">{message}</span>
			<button
				className="toast__close"
				onClick={() => onClose(id)}
				aria-label="Close notification"
			>
				<FaTimes />
			</button>
		</div>
	);
}

export default Toast;
