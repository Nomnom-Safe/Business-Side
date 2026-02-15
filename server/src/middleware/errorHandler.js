// server/src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
	console.error(err);

	// Handle AuthError cleanly
	if (err.name === 'AuthError') {
		return res.status(400).json({
			success: false,
			error: err.code || 'AUTH_ERROR',
			message: err.message,
		});
	}

	// Handle Zod validation errors (optional)
	if (err.name === 'ZodError') {
		return res.status(400).json({
			success: false,
			error: 'VALIDATION_ERROR',
			details: err.flatten(),
		});
	}

	// Fallback for unexpected errors
	return res.status(500).json({
		success: false,
		error: 'SERVER_ERROR',
		message: 'An unexpected error occurred.',
	});
};
