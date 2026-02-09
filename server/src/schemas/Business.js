const { z } = require('zod');

/**
 * Business Schema
 *
 * Validates business data structure for Firebase.
 * Each business must have one address and one menu.
 */

const BusinessSchema = z.object({
	id: z
		.string()
		.regex(
			/^bid_[a-z0-9]{11}$/,
			"Business ID must start with 'bid_' followed by 11 lowercase alphanumeric characters",
		),
	name: z.string().min(1, 'Business name is required'),
	menu_id: z
		.string()
		.regex(
			/^menu_[a-z0-9]{11}$/,
			"Menu ID must start with 'menu_' followed by 11 lowercase alphanumeric characters",
		)
		.nullable(),
	address_id: z
		.string()
		.regex(
			/^add_[a-z0-9]{11}$/,
			"Address ID must start with 'add_' followed by 11 lowercase alphanumeric characters",
		),
	hours: z
		.array(z.string().min(1, 'Hour entry cannot be empty'))
		.min(1, 'At least one hour entry is required'),
	phone: z
		.string()
		.regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone must be in format ###-###-####'),
	website: z
		.string()
		.min(1, "Website is required (use 'None' if no website exists)"),
	disclaimers: z
		.array(z.string().min(1, 'Disclaimer cannot be empty'))
		.min(1, 'At least one disclaimer is required'),
	cuisine: z.string().min(1, 'Cuisine type is required'),
});

/**
 * Schema for creating a new business (without ID)
 * Use this when creating a new business before generating the ID
 */
const CreateBusinessSchema = BusinessSchema.omit({ id: true });

/**
 * Schema for updating a business (all fields optional except ID)
 */
const UpdateBusinessSchema = BusinessSchema.partial().required({
	id: true,
});

module.exports = {
	BusinessSchema,
	CreateBusinessSchema,
	UpdateBusinessSchema,
};
