'use strict';

const {
  normalizeItem,
  normalizeKey,
  processItems,
  buildSummary,
  LIMITS,
} = require('../../src/utils/importNormalize');

// ---------------------------------------------------------------------------
// normalizeKey
// ---------------------------------------------------------------------------

describe('normalizeKey', () => {
  test('normalizes case and whitespace', () => {
    expect(normalizeKey('  Chicken  Alfredo ', ' Pasta ')).toBe('chicken alfredo|pasta');
  });

  test('defaults category to uncategorized when blank', () => {
    expect(normalizeKey('Soup', '')).toBe('soup|uncategorized');
    expect(normalizeKey('Soup', null)).toBe('soup|uncategorized');
  });

  test('two items with different casing share the same key', () => {
    const k1 = normalizeKey('margherita pizza', 'Pizza');
    const k2 = normalizeKey('Margherita Pizza', 'PIZZA');
    expect(k1).toBe(k2);
  });
});

// ---------------------------------------------------------------------------
// normalizeItem — name field
// ---------------------------------------------------------------------------

describe('normalizeItem — name', () => {
  test('valid name passes', () => {
    const { issues } = normalizeItem({ name: 'Burger', price: null });
    expect(issues).toHaveLength(0);
  });

  test('empty name produces REQUIRED_MISSING issue', () => {
    const { issues } = normalizeItem({ name: '', price: null });
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'name', code: 'REQUIRED_MISSING' }),
    ]));
  });

  test('whitespace-only name produces REQUIRED_MISSING issue', () => {
    const { issues } = normalizeItem({ name: '   ', price: null });
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'name', code: 'REQUIRED_MISSING' }),
    ]));
  });

  test('name is trimmed in output', () => {
    const { item } = normalizeItem({ name: '  Burger  ', price: null });
    expect(item.name).toBe('Burger');
  });

  test('name exceeding max length produces FIELD_TOO_LONG issue', () => {
    const longName = 'a'.repeat(LIMITS.MAX_NAME + 1);
    const { issues } = normalizeItem({ name: longName, price: null });
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'name', code: 'FIELD_TOO_LONG' }),
    ]));
  });
});

// ---------------------------------------------------------------------------
// normalizeItem — category field
// ---------------------------------------------------------------------------

describe('normalizeItem — category', () => {
  test('missing category defaults to Uncategorized', () => {
    const { item } = normalizeItem({ name: 'Salad', price: null });
    expect(item.category).toBe('Uncategorized');
  });

  test('blank category defaults to Uncategorized', () => {
    const { item } = normalizeItem({ name: 'Salad', category: '  ', price: null });
    expect(item.category).toBe('Uncategorized');
  });

  test('non-blank category is preserved and trimmed', () => {
    const { item } = normalizeItem({ name: 'Salad', category: ' Starters ', price: null });
    expect(item.category).toBe('Starters');
  });
});

// ---------------------------------------------------------------------------
// normalizeItem — price field
// ---------------------------------------------------------------------------

describe('normalizeItem — price', () => {
  test('null price stays null with no issue', () => {
    const { item, issues } = normalizeItem({ name: 'A', price: null });
    expect(item.price).toBeNull();
    expect(issues.some(i => i.field === 'price')).toBe(false);
  });

  test('numeric price is preserved', () => {
    const { item } = normalizeItem({ name: 'A', price: 12.5 });
    expect(item.price).toBe(12.5);
  });

  test('string price with dollar sign is normalized', () => {
    const { item } = normalizeItem({ name: 'A', price: '$9.99' });
    expect(item.price).toBe(9.99);
  });

  test('string price with euro sign is normalized', () => {
    const { item } = normalizeItem({ name: 'A', price: '€14,99' });
    expect(item.price).toBe(1499);
  });

  test('unparseable price produces PRICE_PARSE_FAILED and price is null', () => {
    const { item, issues } = normalizeItem({ name: 'A', price: 'market price' });
    expect(item.price).toBeNull();
    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'price', code: 'PRICE_PARSE_FAILED' }),
    ]));
  });
});

// ---------------------------------------------------------------------------
// normalizeItem — ingredients
// ---------------------------------------------------------------------------

describe('normalizeItem — ingredients', () => {
  test('array of strings is preserved', () => {
    const { item } = normalizeItem({ name: 'A', price: null, ingredients: ['flour', 'egg'] });
    expect(item.ingredients).toEqual(['flour', 'egg']);
  });

  test('single comma-separated string is split into array', () => {
    const { item } = normalizeItem({ name: 'A', price: null, ingredients: 'flour, egg, milk' });
    expect(item.ingredients).toEqual(['flour', 'egg', 'milk']);
  });

  test('empty string produces empty array', () => {
    const { item } = normalizeItem({ name: 'A', price: null, ingredients: '' });
    expect(item.ingredients).toEqual([]);
  });

  test('blank ingredient entries are filtered out', () => {
    const { item } = normalizeItem({ name: 'A', price: null, ingredients: ['flour', '  ', 'egg'] });
    expect(item.ingredients).toEqual(['flour', 'egg']);
  });

  test('ingredients capped at MAX_INGREDIENTS', () => {
    const many = Array.from({ length: LIMITS.MAX_INGREDIENTS + 5 }, (_, i) => `ing${i}`);
    const { item } = normalizeItem({ name: 'A', price: null, ingredients: many });
    expect(item.ingredients).toHaveLength(LIMITS.MAX_INGREDIENTS);
  });

  test('each ingredient capped at MAX_INGREDIENT chars', () => {
    const long = 'x'.repeat(LIMITS.MAX_INGREDIENT + 10);
    const { item } = normalizeItem({ name: 'A', price: null, ingredients: [long] });
    expect(item.ingredients[0]).toHaveLength(LIMITS.MAX_INGREDIENT);
  });
});

// ---------------------------------------------------------------------------
// normalizeItem — possible_allergens
// ---------------------------------------------------------------------------

describe('normalizeItem — possible_allergens', () => {
  test('free text allergen values are preserved', () => {
    const { item } = normalizeItem({ name: 'A', price: null, possible_allergens: ['gluten', 'soya beans'] });
    expect(item.possible_allergens).toEqual(['gluten', 'soya beans']);
  });

  test('possible_allergens capped at MAX_ALLERGENS', () => {
    const many = Array.from({ length: LIMITS.MAX_ALLERGENS + 5 }, (_, i) => `allergen${i}`);
    const { item } = normalizeItem({ name: 'A', price: null, possible_allergens: many });
    expect(item.possible_allergens).toHaveLength(LIMITS.MAX_ALLERGENS);
  });

  test('missing possible_allergens defaults to empty array', () => {
    const { item } = normalizeItem({ name: 'A', price: null });
    expect(item.possible_allergens).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// processItems — status assignment
// ---------------------------------------------------------------------------

describe('processItems', () => {
  const validRaw = (name, category = 'Mains') => ({
    name,
    description: '',
    ingredients: ['chicken'],
    price: 10,
    category,
    possible_allergens: [],
  });

  test('returns empty array for non-array input', () => {
    expect(processItems(null)).toEqual([]);
    expect(processItems('string')).toEqual([]);
  });

  test('valid item is assigned status: valid', () => {
    const rows = processItems([validRaw('Burger')]);
    expect(rows[0].status).toBe('valid');
    expect(rows[0].issues).toHaveLength(0);
  });

  test('item with empty name is assigned status: invalid', () => {
    const rows = processItems([{ name: '', price: null }]);
    expect(rows[0].status).toBe('invalid');
    expect(rows[0].issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'REQUIRED_MISSING' }),
    ]));
  });

  test('second occurrence of same name+category is assigned status: duplicate', () => {
    const rows = processItems([validRaw('Burger', 'Mains'), validRaw('burger', 'mains')]);
    expect(rows[0].status).toBe('valid');
    expect(rows[1].status).toBe('duplicate');
    expect(rows[1].issues[0].code).toBe('DUPLICATE_NAME_CATEGORY');
  });

  test('duplicate is not auto-removed (both rows present)', () => {
    const rows = processItems([validRaw('Pizza'), validRaw('Pizza')]);
    expect(rows).toHaveLength(2);
  });

  test('same name in different categories is NOT a duplicate', () => {
    const rows = processItems([validRaw('Salad', 'Mains'), validRaw('Salad', 'Starters')]);
    expect(rows[0].status).toBe('valid');
    expect(rows[1].status).toBe('valid');
  });

  test('items beyond MAX_ITEMS are capped', () => {
    const many = Array.from({ length: LIMITS.MAX_ITEMS + 10 }, (_, i) => validRaw(`Item ${i}`, 'Cat'));
    const rows = processItems(many);
    expect(rows).toHaveLength(LIMITS.MAX_ITEMS);
  });

  test('missing category defaults to Uncategorized in output', () => {
    const rows = processItems([{ name: 'Soup', price: null }]);
    expect(rows[0].item.category).toBe('Uncategorized');
  });
});

// ---------------------------------------------------------------------------
// buildSummary
// ---------------------------------------------------------------------------

describe('buildSummary', () => {
  test('counts rows correctly', () => {
    const rows = [
      { status: 'valid' },
      { status: 'valid' },
      { status: 'invalid' },
      { status: 'duplicate' },
    ];
    const summary = buildSummary(rows);
    expect(summary).toEqual({
      totalRows: 4,
      validRows: 2,
      invalidRows: 1,
      duplicateRows: 1,
    });
  });

  test('all valid gives partial false condition', () => {
    const rows = [{ status: 'valid' }, { status: 'valid' }];
    const summary = buildSummary(rows);
    expect(summary.invalidRows).toBe(0);
    expect(summary.duplicateRows).toBe(0);
  });
});
