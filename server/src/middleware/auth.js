const { admin } = require('../services/firestoreInit');

/**
 * Express middleware to verify Firebase ID tokens.
 * Checks `Authorization: Bearer <idToken>` header first, then `token` cookie.
 * On success attaches `req.user = decodedToken` and calls `next()`.
 * On failure returns 401.
 */
async function authenticate(req, res, next) {
	try {
		let idToken = null;

		const authHeader = req.get('Authorization') || req.get('authorization');
		if (authHeader && authHeader.startsWith('Bearer ')) {
			idToken = authHeader.split('Bearer ')[1].trim();
		}

		// Fallback: see if token is present in cookies (client apps may store it there)
		if (!idToken && req.cookies && req.cookies.token) {
			idToken = req.cookies.token;
		}

		if (!idToken) {
			return res.status(401).json({ error: 'No auth token provided' });
		}

		const decodedToken = await admin.auth().verifyIdToken(idToken);

		// Attach decoded token to request for downstream handlers
		req.user = decodedToken;
		return next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid or expired auth token' });
	}
}

module.exports = {
	authenticate,
};
