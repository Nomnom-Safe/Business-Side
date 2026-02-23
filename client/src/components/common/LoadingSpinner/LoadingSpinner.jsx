// client/src/components/common/LoadingSpinner/LoadingSpinner.jsx

import './LoadingSpinner.scss';

function LoadingSpinner({ size = 48, text }) {
	return (
		<div
			className='loading-spinner'
			role='status'
			aria-live='polite'
		>
			<div className='loading-spinner__box'>
				<svg
					className='loading-spinner__icon'
					width={size}
					height={size}
					viewBox='0 0 50 50'
				>
					<circle
						className='path'
						cx='25'
						cy='25'
						r='20'
						fill='none'
						strokeWidth='5'
					></circle>
				</svg>
				{text ? <div className='loading-spinner__text'>{text}</div> : null}
			</div>
		</div>
	);
}

export default LoadingSpinner;
