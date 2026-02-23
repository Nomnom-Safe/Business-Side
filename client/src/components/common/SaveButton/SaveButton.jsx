// client/src/components/common/SaveButton/SaveButton.jsx

import './SaveButton.scss';

function SaveButton({ disabled, children }) {
	return (
		<button
			className='button save-btn'
			disabled={disabled}
		>
			{children}
		</button>
	);
}

export default SaveButton;
