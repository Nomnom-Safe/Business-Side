const { z } = require('zod');

/**
 * Menu Schema
 *
 * Validates menu data for Firebase.
 * Each business must have only one menu.
 */

const MenuSchema = z.object({
	id: z.string(),
	business_id: z.string(),
	title: z.string().optional().default('Your Menu'),
});

/**
 * Schema for creating a new menu (without ID)
 */
const CreateMenuSchema = MenuSchema.omit({ id: true });

/**
 * Schema for updating a menu (all fields optional except ID)
 */
const UpdateMenuSchema = MenuSchema.partial().extend({
	id: z.string(),
});

module.exports = {
	MenuSchema,
	CreateMenuSchema,
	UpdateMenuSchema,
};
