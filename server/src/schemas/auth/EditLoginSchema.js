const { z } = require('zod');

const EditLoginSchema = z.object({
	email: z.string().email(),
	newLoginDetails: z.object({
		email: z.string().email().optional(),
		password: z.string().optional(),
		currentPassword: z.string().optional(),
	}),
});

module.exports = { EditLoginSchema };
