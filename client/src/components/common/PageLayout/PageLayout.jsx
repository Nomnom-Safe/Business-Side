// client/src/components/common/PageLayout/PageLayout.jsx

import PropTypes from 'prop-types';
import '../../../styles/global.scss';
import './PageLayout.scss';
import Header from '../Header/Header.jsx';
import Nav from '../Nav/Nav.jsx';

function PageLayout({ nav: NavComponent, children }) {
	const ResolvedNav = NavComponent || Nav;

	return (
		<div className='page-wrapper'>
			<Header />

			<div className='page-layout'>
				<aside className='page-layout__nav'>
					<ResolvedNav />
				</aside>

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
