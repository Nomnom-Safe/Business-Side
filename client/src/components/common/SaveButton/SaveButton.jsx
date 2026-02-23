// client/src/components/common/SaveButton/SaveButton.jsx

import './SaveButton.scss';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx';

function SaveButton({ disabled, children, loading }) {
	return (
		<button
			className='button save-btn'
			disabled={disabled || loading}
		>
			{loading ? <LoadingSpinner size={18} /> : children}
		</button>
	);
}

export default SaveButton;
