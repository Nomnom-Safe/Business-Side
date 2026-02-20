import { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/common/Toast';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback(({ type = 'info', message, duration = 4000 }) => {
		const id = ++toastIdCounter;
		setToasts((prev) => [...prev, { id, type, message, duration }]);
		return id;
	}, []);

	const removeToast = useCallback((id) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showSuccess = useCallback((message, duration) => {
		return addToast({ type: 'success', message, duration });
	}, [addToast]);

	const showError = useCallback((message, duration) => {
		return addToast({ type: 'error', message, duration });
	}, [addToast]);

	const showInfo = useCallback((message, duration) => {
		return addToast({ type: 'info', message, duration });
	}, [addToast]);

	const showWarning = useCallback((message, duration) => {
		return addToast({ type: 'warning', message, duration });
	}, [addToast]);

	const value = {
		addToast,
		removeToast,
		showSuccess,
		showError,
		showInfo,
		showWarning,
	};

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastContainer toasts={toasts} removeToast={removeToast} />
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
}
