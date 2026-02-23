// client/src/components/common/Nav/Nav.jsx

import './Nav.scss';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from 'client/src/hooks/useBreadcrumbs';

function Nav() {
	const crumbs = useBreadcrumbs();

	return (
		<nav
			className='breadcrumbs'
			aria-label='Breadcrumb'
		>
			<ol className='breadcrumbs__list'>
				{crumbs.map((crumb, index) => {
					const isLast = index === crumbs.length - 1;

					return (
						<li
							key={crumb.path}
							className={`breadcrumbs__item ${isLast ? 'is-current' : ''}`}
						>
							{isLast ? (
								<span className='breadcrumbs__label'>{crumb.label}</span>
							) : (
								<Link
									to={crumb.path}
									className='breadcrumbs__link'
								>
									{crumb.label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

export default Nav;
