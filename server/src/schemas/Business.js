const { z } = require('zod');

/**
 * Business Schema
 *
 * Validates business data structure for Firebase.
 * Each business must have one address and one menu.
 */

const BusinessSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Business name is required'),
	address_id: z.string(),
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
 * Most fields are optional at creation time since business details are filled in during onboarding
 */
const CreateBusinessSchema = BusinessSchema.omit({ id: true }).extend({
	address_id: z
		.union([z.string(), z.literal('')])
		.optional()
		.nullable(),
	hours: z
		.array(z.string().min(1, 'Hour entry cannot be empty'))
		.optional()
		.default([]),
	phone: z
		.union([
			z
				.string()
				.regex(/^\d{3}-\d{3}-\d{4}$/, 'Phone must be in format ###-###-####'),
			z.literal(''),
		])
		.optional()
		.default(''),
	website: z
		.union([
			z
				.string()
				.min(1, "Website is required (use 'None' if no website exists)"),
			z.literal('None'),
			z.literal(''),
		])
		.optional()
		.default('None'),
	disclaimers: z
		.array(z.string().min(1, 'Disclaimer cannot be empty'))
		.optional()
		.default([]),
	cuisine: z
		.union([z.string().min(1, 'Cuisine type is required'), z.literal('')])
		.optional()
		.default(''),
	allergens: z.array(z.string()).optional().default([]),
	diets: z.array(z.string()).optional().default([]),
});

/**
 * Schema for updating a business (all fields optional except ID)
 * ID and optional fields accept Firestore auto-IDs and plain strings (e.g. address)
 */
const UpdateBusinessSchema = BusinessSchema.partial()
	.extend({
		id: z.string().min(1, 'Business ID is required'),
	})
	.extend({
		address_id: z
			.union([z.string(), z.string().min(1), z.literal('')])
			.optional()
			.nullable(),
		website: z
			.union([z.string().min(1), z.literal('None'), z.literal('')])
			.optional(),
		phone: z
			.union([z.string().regex(/^\d{3}-\d{3}-\d{4}$/), z.literal('')])
			.optional(),
		cuisine: z.string().optional(),
		hours: z.array(z.string().min(1)).optional(),
		disclaimers: z.array(z.string().min(1)).optional(),
	});

module.exports = {
	BusinessSchema,
	CreateBusinessSchema,
	UpdateBusinessSchema,
};
