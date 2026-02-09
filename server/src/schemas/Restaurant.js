const { z } = require('zod');

/**
 * Restaurant Schema
 *
 * Validates restaurant data structure for Firebase.
 * Each restaurant must have one address and one menu.
 */

const RestaurantSchema = z.object({
	id: z
		.string()
		.regex(
			/^rstr_[a-z0-9]{11}$/,
			"Restaurant ID must start with 'rstr_' followed by 11 lowercase alphanumeric characters",
		),
	name: z.string().min(1, 'Restaurant name is required'),
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
 * Schema for creating a new restaurant (without ID)
 * Use this when creating a new restaurant before generating the ID
 */
const CreateRestaurantSchema = RestaurantSchema.omit({ id: true });

/**
 * Schema for updating a restaurant (all fields optional except ID)
 */
const UpdateRestaurantSchema = RestaurantSchema.partial().required({
	id: true,
});

module.exports = {
	RestaurantSchema,
	CreateRestaurantSchema,
	UpdateRestaurantSchema,
};
