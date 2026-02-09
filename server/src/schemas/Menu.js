const { z } = require('zod');

/**
 * Menu Schema
 *
 * Validates menu data for Firebase.
 * Each business must have only one menu.
 */

const MenuSchema = z.object({
	id: z
		.string()
		.regex(
			/^menu_[a-z0-9]{11}$/,
			"Menu ID must start with 'menu_' followed by 11 lowercase alphanumeric characters",
		),
	business_id: z
		.string()
		.regex(
			/^bid_[a-z0-9]{11}$/,
			"Business ID must start with 'bid_' followed by 11 lowercase alphanumeric characters",
		),
});

/**
 * Schema for creating a new menu (without ID)
 */
const CreateMenuSchema = MenuSchema.omit({ id: true });

/**
 * Schema for updating a menu (all fields optional except ID)
 */
const UpdateMenuSchema = MenuSchema.partial().extend({
	id: z.string().regex(/^menu_[a-z0-9]{11}$/),
});

module.exports = {
	MenuSchema,
	CreateMenuSchema,
	UpdateMenuSchema,
};
