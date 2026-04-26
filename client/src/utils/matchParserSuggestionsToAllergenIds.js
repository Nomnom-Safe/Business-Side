/**
 * Map parser `possible_allergens` strings to known allergen ids using the
 * server's allergen labels. Intended as a **starting point** only; the user
 * must still review and acknowledge before save (R2.8).
 *
 * @param {string[]} suggestions
 * @param {{ id: string, label: string }[]} allergens
 * @returns {string[]}
 */
const ALLERGEN_EQUIVALENTS = {
	milk: ['milk', 'dairy'],
	dairy: ['dairy', 'milk'],
	egg: ['egg', 'eggs'],
	eggs: ['eggs', 'egg'],
	soy: ['soy', 'soya'],
	soya: ['soya', 'soy'],
};

function expandSuggestionTerms(suggestions) {
	const expanded = new Set();
	for (const s of suggestions) {
		expanded.add(s);
		const aliases = ALLERGEN_EQUIVALENTS[s];
		if (Array.isArray(aliases)) {
			aliases.forEach((a) => expanded.add(a));
		}
	}
	return [...expanded];
}

export function matchParserSuggestionsToAllergenIds(suggestions, allergens) {
	const sug = (Array.isArray(suggestions) ? suggestions : [])
		.map((s) => String(s).toLowerCase().trim())
		.filter(Boolean);
	if (sug.length === 0 || !Array.isArray(allergens) || allergens.length === 0) {
		return [];
	}

	const blob = expandSuggestionTerms(sug).join(', ');
	const matched = new Set();

	for (const a of allergens) {
		const id = a.id;
		const lab = String(a.label || '').toLowerCase().trim();
		if (!id || !lab) continue;

		const escaped = lab.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		let re;
		if (lab.includes(' ')) {
			re = new RegExp(escaped, 'i');
		} else if (lab.length <= 3) {
			re = new RegExp(`\\b${escaped}\\b`, 'i');
		} else {
			re = new RegExp(`\\b${escaped}s?\\b`, 'i');
		}

		if (re.test(blob)) matched.add(id);
	}

	return [...matched];
}
