import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import getCookie from '../../utils/cookies';

// Guard functions for the logged-in case (Chain of Responsibility style)
function allowChooseBusinessGuard(context) {
	if (context.route === 'chooseBusiness') {
		return { type: 'render' };
	}
	return null;
}

function preventSignedInAccessingAuthGuard(context) {
	if (context.route === 'signInUp') {
		return { type: 'redirect', to: '/dashboard' };
	}
	return null;
}

function adminGuard(context) {
	if (context.admin === true && !context.isAdmin) {
		return { type: 'redirect', to: '/dashboard' };
	}
	return null;
}

function setupGuard(context) {
	// Prevents users from accessing setup pages if they are associated with a business,
	// unless they have just signed up and are still completing setup
	if (context.route === 'setup' && context.hasBusiness && !context.justSignedUp) {
		return { type: 'redirect', to: '/dashboard' };
	}
	return null;
}

function businessAssociationGuard(context) {
	// Prevents users from accessing business pages if they are not associated w/ a business
	if (context.route !== 'setup' && !context.hasBusiness) {
		return { type: 'redirect', to: '/choose-business' };
	}
	return null;
}

const loggedInGuards = [
	allowChooseBusinessGuard,
	preventSignedInAccessingAuthGuard,
	adminGuard,
	setupGuard,
	businessAssociationGuard,
];

function runLoggedInGuards(context) {
	for (const guard of loggedInGuards) {
		const result = guard(context);
		if (result) {
			return result;
		}
	}
	return { type: 'render' };
}

function ProtectedRoute({ component, route, admin }) {
	const isAuthorized = getCookie('isAuthorized') === 'true';
	const isAdmin = getCookie('isAdmin') === 'true';
	const hasBusiness = getCookie('hasBusiness') === 'true';
	const justSignedUp = localStorage.getItem('justSignedUp') === 'true';

	// Guard chain for the not-authorized case (short-circuits all other checks)
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
		// Allow access to sign-in/up when not authorized
		return component;
	}

	// Logged-in guard chain
	const context = {
		route,
		admin,
		isAdmin,
		hasBusiness,
		justSignedUp,
	};

	const outcome = runLoggedInGuards(context);

	if (outcome.type === 'redirect') {
		return (
			<Navigate
				to={outcome.to}
				replace
			/>
		);
	}

	// Default: render protected component
	return component;
}

// Prop validation
ProtectedRoute.propTypes = {
	component: PropTypes.element.isRequired,
	route: PropTypes.string,
	admin: PropTypes.bool,
};

export default ProtectedRoute;

