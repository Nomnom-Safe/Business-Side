/**
 * Schema Index
 * 
 * Central export point for all Zod schemas.
 * Import schemas from this file for consistency.
 * 
 * @example
 * const { RestaurantSchema, MenuItemSchema } = require('./schemas');
 */

const {
  RestaurantSchema,
  CreateRestaurantSchema,
  UpdateRestaurantSchema
} = require('./Restaurant');

const {
  AddressSchema,
  CreateAddressSchema,
  UpdateAddressSchema,
  US_STATES
} = require('./Address');

const {
  MenuSchema,
  CreateMenuSchema,
  UpdateMenuSchema
} = require('./Menu');

const {
  MenuItemSchema,
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  createMenuItemSchemaWithAllergens,
  ITEM_TYPES
} = require('./MenuItem');

const {
  BusinessUserSchema,
  CreateBusinessUserSchema,
  UpdateBusinessUserSchema,
  LoginSchema
} = require('./BusinessUser');

const {
  AllergenSchema,
  CreateAllergenSchema,
  UpdateAllergenSchema
} = require('./Allergen');

module.exports = {
  // Restaurant schemas
  RestaurantSchema,
  CreateRestaurantSchema,
  UpdateRestaurantSchema,

  // Address schemas
  AddressSchema,
  CreateAddressSchema,
  UpdateAddressSchema,
  US_STATES,

  // Menu schemas
  MenuSchema,
  CreateMenuSchema,
  UpdateMenuSchema,

  // MenuItem schemas
  MenuItemSchema,
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  createMenuItemSchemaWithAllergens,
  ITEM_TYPES,

  // BusinessUser schemas
  BusinessUserSchema,
  CreateBusinessUserSchema,
  UpdateBusinessUserSchema,
  LoginSchema,

  // Allergen schemas
  AllergenSchema,
  CreateAllergenSchema,
  UpdateAllergenSchema
};
