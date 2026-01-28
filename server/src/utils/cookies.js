const options = {
	secure: true,
	sameSite: 'None',
};

// Sets cookies
const setCookies = (res, user, extraFields = {}) => {
	// Cookie key-value pairs
	const cookies = {
		// Required
		fullName: user.getFullName(),
		email: user.email,
		isAdmin: user.admin,
		isAuthorized: true,
		hasBusiness:
			user.business_id &&
			user.business_id !== '' &&
			user.business_id !== 'create'
				? true
				: false,
		// Optional
		...extraFields,
	};

	// Set each cookie
	for (const [key, value] of Object.entries(cookies)) {
		res.cookie(key, value, options);
	}
};

// Updates a single cookie
const updateCookie = (res, name, value) => {
	res.cookie(name, value, options);
};

// Clears all cookies
const clearAllCookies = (req, res) => {
	// Get all cookie names
	const cookies = Object.keys(req.cookies);

	// Clear each cookie
	cookies.forEach((cookie) => {
		res.clearCookie(cookie, options);
	});
};

module.exports = {
	setCookies,
	updateCookie,
	clearAllCookies,
};
