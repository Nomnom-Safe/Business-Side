// client/src/components/common/PageLayout/PageLayout.jsx

import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../../styles/global.scss';
import './PageLayout.scss';
import Header from '../Header/Header.jsx';
import Nav from '../Nav/Nav.jsx';

function PageLayout({ nav: NavComponent, children }) {
	const location = useLocation();
	const ResolvedNav = NavComponent || Nav;

	// Hide nav only on login/signup page
	const noNavRoutes = ['/'];
	const showNav = !noNavRoutes.includes(location.pathname);

	return (
		<div className='page-wrapper'>
			<Header />

			<div className='page-layout'>
				{showNav && (
					<aside className='page-layout__nav'>
						<ResolvedNav />
					</aside>
				)}
				<main className='page-layout__main'>{children}</main>
			</div>
		</div>
	);
}

PageLayout.propTypes = {
	nav: PropTypes.elementType,
	children: PropTypes.node.isRequired, // The main page content
};

export default PageLayout;
