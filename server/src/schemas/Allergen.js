const { z } = require('zod');

/**
 * Allergen Schema
 *
 * Validates allergen data for Firebase.
 * Allergens are preset and should not change unless manually changed in the database.
 */

const AllergenSchema = z.object({
	id: z.string().regex(/^all_/, "Allergen ID must start with 'all_'"),
	label: z
		.string()
		.min(1, 'Allergen label is required')
		.transform((str) => {
			// Ensure first letter is capitalized
			return str.charAt(0).toUpperCase() + str.slice(1);
		}),
});

/**
 * Schema for creating a new allergen (without ID)
 * Note: Allergens are typically preset and should rarely be created
 */
const CreateAllergenSchema = AllergenSchema.omit({ id: true });

/**
 * Schema for updating an allergen (all fields optional except ID)
 */
const UpdateAllergenSchema = AllergenSchema.partial().extend({
	id: z.string().regex(/^all_/),
});

module.exports = {
	AllergenSchema,
	CreateAllergenSchema,
	UpdateAllergenSchema,
};
