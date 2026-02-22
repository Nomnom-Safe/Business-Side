// client/src/components/auth/AuthFormSwitcher/SwapPrompt.jsx

import PropTypes from 'prop-types';

function SwapPrompt({ message, actionLabel, onClick }) {
	return (
		<div className='swap-form'>
			{message}&nbsp;
			<button
				type='button'
				className='swap-btn'
				onClick={onClick}
			>
				{actionLabel}
			</button>
		</div>
	);
}

SwapPrompt.propTypes = {
	message: PropTypes.string.isRequired,
	actionLabel: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default SwapPrompt;
