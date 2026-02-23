// client/src/components/account/AccountDetails/DetailRow/DetailRow.jsx

import './DetailRow.scss';
import PropTypes from 'prop-types';

function DetailRow({ label, value }) {
	return (
		<div className='detail-row'>
			<span className='detail-row__label'>{label}</span>
			<div className='detail-row__value'>{value}</div>
		</div>
	);
}

DetailRow.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.node,
	]).isRequired,
};

export default DetailRow;
