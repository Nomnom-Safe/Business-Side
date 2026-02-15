const validate =
	(schema, source = 'body') =>
	(req, res, next) => {
		const result = schema.safeParse(req[source]);
		if (!result.success) {
			console.warn('Validation failed:', result.error.format());
			return res.status(400).json({
				success: false,
				error: 'VALIDATION_ERROR',
				details: result.error.flatten(),
			});
		}
		req.validated = result.data;
		next();
	};

module.exports = {
	validate,
};
