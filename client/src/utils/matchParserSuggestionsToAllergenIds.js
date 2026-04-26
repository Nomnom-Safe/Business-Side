/**
 * Map parser `possible_allergens` strings to known allergen ids using the
 * server's allergen labels. Intended as a **starting point** only; the user
 * must still review and acknowledge before save (R2.8).
 *
 * @param {string[]} suggestions
 * @param {{ id: string, label: string }[]} allergens
 * @returns {string[]}
 */
export function matchParserSuggestionsToAllergenIds(suggestions, allergens) {
	const sug = (Array.isArray(suggestions) ? suggestions : [])
		.map((s) => String(s).toLowerCase().trim())
		.filter(Boolean);
	if (sug.length === 0 || !Array.isArray(allergens) || allergens.length === 0) {
		return [];
	}

	const blob = sug.join(', ');
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
