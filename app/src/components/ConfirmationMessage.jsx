import { useNavigate } from 'react-router-dom';
import '../scss/auth.scss';

function GetConfirmationMessage({ message, destination }) {
	const navigate = useNavigate();

	const nav = (event) => {
		event.preventDefault();
		navigate(destination);
	};

	return (
		<div className='confirmation-container'>
			{message}
			<button
				type='button'
				onClick={nav}
				className='button'
			>
				Ok
			</button>
		</div>
	);
}

export default GetConfirmationMessage;
