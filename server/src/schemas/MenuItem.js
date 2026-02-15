const { z } = require('zod');

/**
 * MenuItem Schema
 *
 * Validates menu item data for Firebase.
 * Allergens are validated dynamically against the database.
 */

// Valid item types
const ITEM_TYPES = ['entree', 'dessert', 'drink', 'side', 'appetizer'];

/**
 * Base allergen ID format validator
 * Validates the format but not against specific database values
 */
const allergenIdFormatSchema = z
	.string()
	.regex(/^all_/, "Allergen ID must start with 'all_'");

const MenuItemSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Menu item name is required'),
	description: z.string(),
	menu_id: z.string(),
	item_type: z.string(),
	allergens: z.array(allergenIdFormatSchema).default([]),
});

/**
 * Create a schema with specific allergen validation
 * Use this when you want to validate against actual allergen IDs from the database
 *
 * @param {string[]} validAllergenIds - Array of valid allergen IDs from the database
 * @returns {ZodSchema} Schema with specific allergen validation
 *
 * @example
 * const allergens = await getAllergensFromDb();
 * const allergenIds = allergens.map(a => a.id);
 * const schema = createMenuItemSchemaWithAllergens(allergenIds);
 * const result = schema.safeParse(menuItemData);
 */
function createMenuItemSchemaWithAllergens(validAllergenIds) {
	if (!Array.isArray(validAllergenIds) || validAllergenIds.length === 0) {
		throw new Error('validAllergenIds must be a non-empty array');
	}

	return z.object({
		id: z.string(),
		name: z.string().min(1, 'Menu item name is required'),
		description: z.string(),
		menu_id: z.string(),
		item_type: z.enum(ITEM_TYPES, {
			errorMap: () => ({
				message:
					'Item type must be one of: entree, dessert, drink, side, or appetizer',
			}),
		}),
		allergens: z
			.array(
				z.enum(validAllergenIds, {
					errorMap: () => ({
						message: 'Must use valid allergen IDs from the database',
					}),
				}),
			)
			.default([]),
	});
}

/**
 * Schema for creating a new menu item (without ID)
 */
const CreateMenuItemSchema = MenuItemSchema.omit({ id: true });

/**
 * Schema for updating a menu item (all fields optional except ID)
 */
const UpdateMenuItemSchema = MenuItemSchema.partial().extend({
	id: z.string(),
});

module.exports = {
	MenuItemSchema,
	CreateMenuItemSchema,
	UpdateMenuItemSchema,
	createMenuItemSchemaWithAllergens,
	ITEM_TYPES,
};
