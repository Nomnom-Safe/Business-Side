// components/account/EditSection/EditSection.jsx

import './EditSection.scss';

function EditSection({ title, error, success, children }) {
	return (
		<section className='edit-account__section'>
			<h2>{title}</h2>

			{error}
			{success}

			{children}
		</section>
	);
}

export default EditSection;
