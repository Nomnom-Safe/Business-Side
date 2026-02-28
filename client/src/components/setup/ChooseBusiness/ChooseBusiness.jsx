import './ChooseBusiness.scss';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChooseBusiness() {
	const navigate = useNavigate();
	const [message, setMessage] = useState('Something went wrong.');
	const [showError, setShowError] = useState(false);

	const handleGetStarted = (event) => {
		event.preventDefault();
		navigate('/onboarding');
	};

	return (
		<div className='set-up-container'>
			{showError ? (
				<ErrorMessage
					message={message}
					destination={false}
					onClose={() => setShowError(false)}
				/>
			) : null}

			<h1>Create your business</h1>

			<form
				name='chooseBusinessForm'
				onSubmit={handleGetStarted}
				className='choose-business-form'
			>
				<div className='choose-business-container'>
					<div className='choose-business'>
						<p className='choose-business-value'>
							Help customers with dietary needs find and trust your business.
						</p>
						<p className='choose-business-copy'>
							We&apos;ll ask for your business details and, optionally, how you accommodate allergens and diets. You can change anything later.
						</p>
					</div>
				</div>

				<div className='buttons'>
					<button
						type='submit'
						className='button'
					>
						Get started
					</button>
				</div>
			</form>
		</div>
	);
}

export default ChooseBusiness;
