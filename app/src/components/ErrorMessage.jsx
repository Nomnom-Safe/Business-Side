import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../scss/auth.scss';

function ErrorMessage({ message, destination, onClose }) {
	const navigate = useNavigate();

	const nav = (event) => {
		event.preventDefault();
		navigate(destination);
	};

	return (
		<div className='error-container'>
			{message}
			<button
				type='button'
				onClick={destination === false ? onClose : nav}
				className='button error-btn'
			>
				Ok
			</button>
		</div>
	);
}

// Prop validation
ErrorMessage.propTypes = {
	message: PropTypes.string.isRequired,
	destination: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.bool,
	]).isRequired,
	onClose: PropTypes.func,
};

export default ErrorMessage;
