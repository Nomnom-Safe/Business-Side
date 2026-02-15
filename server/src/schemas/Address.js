const { z } = require('zod');

/**
 * Address Schema
 *
 * Validates address data for Firebase.
 * All addresses must be for the USA.
 */

// US state abbreviations
const US_STATES = [
	'AL',
	'AK',
	'AZ',
	'AR',
	'CA',
	'CO',
	'CT',
	'DE',
	'FL',
	'GA',
	'HI',
	'ID',
	'IL',
	'IN',
	'IA',
	'KS',
	'KY',
	'LA',
	'ME',
	'MD',
	'MA',
	'MI',
	'MN',
	'MS',
	'MO',
	'MT',
	'NE',
	'NV',
	'NH',
	'NJ',
	'NM',
	'NY',
	'NC',
	'ND',
	'OH',
	'OK',
	'OR',
	'PA',
	'RI',
	'SC',
	'SD',
	'TN',
	'TX',
	'UT',
	'VT',
	'VA',
	'WA',
	'WV',
	'WI',
	'WY',
];

const AddressSchema = z.object({
	id: z.string(),
	street: z
		.string()
		.min(1, 'Street is required')
		.transform((v) => v.trim()),
	city: z
		.string()
		.min(1, 'City is required')
		.transform((v) => v.trim()),
	state: z.enum(US_STATES, {
		errorMap: () => ({ message: 'Must be a valid US state abbreviation' }),
	}),
	zipCode: z
		.string()
		.regex(
			/^\d{5}(-\d{4})?$/,
			'Zip code must be in format ##### or #####-####',
		),
});

/**
 * Schema for creating a new address (without ID)
 */
const CreateAddressSchema = AddressSchema.omit({ id: true });

/**
 * Schema for updating an address (all fields optional except ID)
 */
const UpdateAddressSchema = AddressSchema.partial().extend({
	id: z.string(),
});

module.exports = {
	AddressSchema,
	CreateAddressSchema,
	UpdateAddressSchema,
	US_STATES,
};
