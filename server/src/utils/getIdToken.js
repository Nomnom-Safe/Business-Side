// utils/getIdToken.js

/**
 * Extracts the idToken from the request body or Authorization header.
 * @param {object} req - Express request object
 * @returns {string|null} The extracted idToken or null if not found
 */
function getIdToken(req) {
	return (
		req.body.idToken ||
		(req.get('Authorization') || '').replace('Bearer ', '') ||
		null
	);
}

module.exports = { getIdToken };
