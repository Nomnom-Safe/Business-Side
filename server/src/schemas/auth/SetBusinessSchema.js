const { z } = require('zod');

const SetBusinessSchema = z.object({
	type: z.enum(['existing', 'new']),
	businessId: z.string().min(1, 'Business ID is required'),
});

module.exports = { SetBusinessSchema };
