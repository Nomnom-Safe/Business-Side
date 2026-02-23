// client/src/components/common/Header/Header.jsx

import '../../../styles/global.scss';
import './Header.scss';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from '../ProfileIcon/ProfileIcon.jsx';
import getCookie from '../../../utils/cookies.jsx';

function Header() {
	const navigate = useNavigate();
	const isAuthorized = getCookie('isAuthorized');

	const toDashboard = (event) => {
		event.preventDefault();

		if (isAuthorized === 'true') {
			navigate('/dashboard');
		} else {
			navigate('/');
		}
	};

	return (
		<header className='header'>
			<div className='header-left'>
				<h1
					onClick={toDashboard}
					className='header-title'
				>
					NomNom Safe
				</h1>
			</div>
			<div className='header-right'>
				{isAuthorized ? <ProfileIcon /> : <></>}
			</div>
		</header>
	);
}

export default Header;
