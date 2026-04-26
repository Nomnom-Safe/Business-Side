'use strict';

const MAX_ITEMS = 300;
const MAX_TEXT_LENGTH = 120000;
const MAX_NAME = 120;
const MAX_DESCRIPTION = 1000;
const MAX_CATEGORY = 80;
const MAX_INGREDIENT = 80;
const MAX_INGREDIENTS = 40;
const MAX_ALLERGEN = 60;
const MAX_ALLERGENS = 20;
const CANONICAL_ALLERGENS = [
  'gluten',
  'dairy',
  'egg',
  'soy',
  'peanut',
  'tree nut',
  'fish',
  'shellfish',
  'sesame',
];
const ALLERGEN_SYNONYMS = {
  eggs: 'egg',
  tree_nut: 'tree nut',
  treenut: 'tree nut',
  nuts: 'tree nut',
};

const LIMITS = {
  MAX_ITEMS,
  MAX_TEXT_LENGTH,
  MAX_NAME,
  MAX_DESCRIPTION,
  MAX_CATEGORY,
  MAX_INGREDIENT,
  MAX_INGREDIENTS,
  MAX_ALLERGEN,
  MAX_ALLERGENS,
};

function normalizeKey(name, category) {
  const normName = String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const normCat = String(category || 'uncategorized').trim().toLowerCase().replace(/\s+/g, ' ');
  return `${normName}|${normCat}`;
}

function normalizePrice(raw) {
  if (raw === null || raw === undefined || raw === '') return { price: null, issue: null };
  if (typeof raw === 'number') {
    return isNaN(raw) ? { price: null, issue: 'PRICE_PARSE_FAILED' } : { price: raw, issue: null };
  }
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/[$€£¥₩,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? { price: null, issue: 'PRICE_PARSE_FAILED' } : { price: parsed, issue: null };
  }
  return { price: null, issue: 'PRICE_PARSE_FAILED' };
}

function normalizeStringArray(raw, itemMax, arrayMax) {
  if (Array.isArray(raw)) {
    return raw
      .map(i => (typeof i === 'string' ? i.trim() : String(i || '').trim()))
      .filter(i => i.length > 0)
      .map(i => i.slice(0, itemMax))
      .slice(0, arrayMax);
  }
  if (typeof raw === 'string' && raw.trim()) {
    return raw
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0)
      .map(i => i.slice(0, itemMax))
      .slice(0, arrayMax);
  }
  return [];
}

function normalizeAllergenSuggestion(a) {
  const cleaned = String(a || '')
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return null;
  const synonym = ALLERGEN_SYNONYMS[cleaned] || cleaned;
  if (CANONICAL_ALLERGENS.includes(synonym)) return synonym;
  return cleaned;
}

function normalizeItem(raw) {
  const issues = [];

  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!name) {
    issues.push({ field: 'name', code: 'REQUIRED_MISSING', message: 'Name is required.' });
  } else if (name.length > MAX_NAME) {
    issues.push({ field: 'name', code: 'FIELD_TOO_LONG', message: `Name exceeds ${MAX_NAME} characters.` });
  }

  const description = typeof raw.description === 'string' ? raw.description.trim() : '';
  if (description.length > MAX_DESCRIPTION) {
    issues.push({ field: 'description', code: 'FIELD_TOO_LONG', message: `Description exceeds ${MAX_DESCRIPTION} characters.` });
  }

  const rawCategory = typeof raw.category === 'string' ? raw.category.trim() : '';
  const category = rawCategory.length > 0 ? rawCategory : 'Uncategorized';
  if (category.length > MAX_CATEGORY) {
    issues.push({ field: 'category', code: 'FIELD_TOO_LONG', message: `Category exceeds ${MAX_CATEGORY} characters.` });
  }

  const { price, issue: priceIssue } = normalizePrice(raw.price);
  if (priceIssue) {
    issues.push({ field: 'price', code: priceIssue, message: 'Price could not be parsed as a number.' });
  }

  const ingredients = normalizeStringArray(raw.ingredients, MAX_INGREDIENT, MAX_INGREDIENTS);
  const possible_allergens = normalizeStringArray(raw.possible_allergens, MAX_ALLERGEN, MAX_ALLERGENS)
    .map(normalizeAllergenSuggestion)
    .filter(Boolean)
    .filter((a, idx, arr) => arr.indexOf(a) === idx)
    .slice(0, MAX_ALLERGENS);

  const item = { name, description, ingredients, price, category, possible_allergens };
  return { item, issues };
}

function processItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];

  const capped = rawItems.slice(0, MAX_ITEMS);
  const seenKeys = new Set();
  const results = [];

  for (const raw of capped) {
    const { item, issues } = normalizeItem(raw);

    if (issues.some(i => i.code === 'REQUIRED_MISSING')) {
      results.push({ status: 'invalid', item, issues });
      continue;
    }

    const key = normalizeKey(item.name, item.category);
    if (seenKeys.has(key)) {
      results.push({
        status: 'duplicate',
        item,
        issues: [{
          field: 'name',
          code: 'DUPLICATE_NAME_CATEGORY',
          message: 'Duplicate detected by normalized name + category key.',
        }],
      });
      continue;
    }

    seenKeys.add(key);
    results.push({ status: 'valid', item, issues });
  }

  return results;
}

function buildSummary(rows) {
  return {
    totalRows: rows.length,
    validRows: rows.filter(r => r.status === 'valid').length,
    invalidRows: rows.filter(r => r.status === 'invalid').length,
    duplicateRows: rows.filter(r => r.status === 'duplicate').length,
  };
}

module.exports = { processItems, normalizeItem, normalizeKey, buildSummary, LIMITS };
