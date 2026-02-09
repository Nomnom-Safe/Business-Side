const { z } = require('zod');

/**
 * BusinessUser Schema
 *
 * Validates business user data for Firebase.
 * Password should be validated before hashing when creating users.
 */

const BusinessUserSchema = z.object({
	id: z
		.string()
		.regex(
			/^bus_[a-z0-9]{11}$/,
			"Business user ID must start with 'bus_' followed by 11 lowercase alphanumeric characters",
		),
	business_id: z
		.string()
		.regex(
			/^rstr_[a-z0-9]{11}$/,
			"Restaurant ID must start with 'rstr_' followed by 11 lowercase alphanumeric characters",
		),
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().min(1, 'Last name is required'),
	admin: z.boolean(),
	email: z
		.string()
		.email('Must be a valid email address')
		.transform((v) => v.toLowerCase().trim()),
	password: z.string().min(1, 'Password is required'), // Stored as hashed password
});

/**
 * Schema for creating a new business user (without ID, with password requirements)
 * Use this for user registration/creation before hashing the password
 */
const CreateBusinessUserSchema = BusinessUserSchema.omit({ id: true }).extend({
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number'),
});

/**
 * Schema for updating a business user (all fields optional except ID)
 * Password validation is less strict since it will be hashed
 */
const UpdateBusinessUserSchema = BusinessUserSchema.partial().extend({
	id: z.string().regex(/^bus_[a-z0-9]{11}$/),
});

/**
 * Schema for user login validation
 */
const LoginSchema = z.object({
	email: z
		.string()
		.email('Must be a valid email address')
		.transform((v) => v.toLowerCase().trim()),
	password: z.string().min(1, 'Password is required'),
});

module.exports = {
	BusinessUserSchema,
	CreateBusinessUserSchema,
	UpdateBusinessUserSchema,
	LoginSchema,
};
