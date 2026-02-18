const { z } = require('zod');

const SignInSchema = z.object({
	email: z.string().email('Must be a valid email address'),
	password: z.string().min(1, 'Password is required'),
	idToken: z.string().optional(),
});

module.exports = { SignInSchema };
