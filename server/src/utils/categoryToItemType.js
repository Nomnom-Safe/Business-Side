'use strict';

const { ITEM_TYPES } = require('../schemas/MenuItem');

const RULES = [
  { type: 'appetizer', patterns: ['appetizer', 'appetiser', 'starter', 'small plate', 'antipast'] },
  { type: 'dessert', patterns: ['dessert', 'sweet', 'cake', 'ice cream', 'pudding'] },
  { type: 'drink', patterns: ['drink', 'beverage', 'wine', 'beer', 'cocktail', 'coffee', 'tea', 'soda', 'juice', 'bar'] },
  { type: 'side', patterns: ['side', 'sides', 'accompan'] },
  { type: 'entree', patterns: ['entree', 'entrée', 'main', 'mains', 'dinner', 'lunch', 'pasta', 'pizza', 'salad', 'soup', 'grill', 'platter', 'breakfast', 'brunch', 'kids'] },
];

/**
 * Map free-text import category to a MenuItem item_type.
 */
function categoryStringToItemType(category) {
  if (!category || typeof category !== 'string') return 'entree';
  const c = category.toLowerCase().trim();
  for (const { type, patterns } of RULES) {
    for (const p of patterns) {
      if (c.includes(p)) return type;
    }
  }
  if (ITEM_TYPES.includes(c)) return c;
  return 'entree';
}

module.exports = { categoryStringToItemType };
