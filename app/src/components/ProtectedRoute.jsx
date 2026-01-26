import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import getCookie from '../utils/cookies';

function ProtectedRoute({ component, route, admin }) {
	const isAuthorized = getCookie('isAuthorized') === 'true';
	const isAdmin = getCookie('isAdmin') === 'true';
	const hasBusiness = getCookie('hasBusiness') === 'true';

	// Prevents user from accessing any pages if they're not logged in
	if (!isAuthorized) {
		if (route !== 'signInUp') {
			// Redirect to sign-in page
			return (
				<Navigate
					to='/'
					replace
				/>
			);
		}

		return component;
	}

	/* The following statements only execute if the user is logged in. */

	if (route === 'chooseBusiness') {
		return component;
	}

	// Prevents user from accessing sign in/up page if they're logged in
	if (route === 'signInUp') {
		// Redirect to dashboard
		return (
			<Navigate
				to='/dashboard'
				replace
			/>
		);
	}

	// Prevents non-admin users from accessing admin routes
	if (admin === true && !isAdmin) {
		// Redirect to dashboard
		return (
			<Navigate
				to='/dashboard'
				replace
			/>
		);
	}

	// Prevents users from accessing setup pages if they are associated with a business,
	// unless they have just signed up and are still completing setup
	const justSignedUp = localStorage.getItem('justSignedUp') === 'true';

	if (route === 'setup' && hasBusiness && !justSignedUp) {
		return (
			<Navigate
				to='/dashboard'
				replace
			/>
		);
	}

	// Prevents users from accessing business pages if they are not associated w/ a business
	if (route !== 'setup' && !hasBusiness) {
		// Redirect to setup page
		return (
			<Navigate
				to='/choose-business'
				replace
			/>
		);
	}

	// Render protected component
	return component;
}

// Prop validation
ProtectedRoute.propTypes = {
	component: PropTypes.element.isRequired,
	route: PropTypes.string,
	admin: PropTypes.bool,
};

export default ProtectedRoute;
