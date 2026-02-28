// server/src/controllers/placesController.js
// Proxies Google Places API (New) so the API key never leaves the server.

const PLACES_AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';
const PLACES_DETAILS_BASE = 'https://places.googleapis.com/v1/places';

const US_STATES = [
	'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
	'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
	'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
	'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
	'WI', 'WY',
];

function getApiKey() {
	const key = process.env.GOOGLE_PLACES_API_KEY || process.env.PLACES_API_KEY;
	if (!key) {
		throw new Error('GOOGLE_PLACES_API_KEY or PLACES_API_KEY must be set');
	}
	return key;
}

/**
 * Parse address_components (Places API New format: longText, shortText, types)
 * into { street, city, state, zipCode }.
 */
function parseAddressComponentsNew(components) {
	if (!Array.isArray(components) || components.length === 0) {
		return null;
	}
	const get = (type) => {
		const c = components.find((comp) => comp.types && comp.types.includes(type));
		return c ? (c.longText || c.shortText || '').trim() : '';
	};
	const getShort = (type) => {
		const c = components.find((comp) => comp.types && comp.types.includes(type));
		return c ? (c.shortText || c.longText || '').trim() : '';
	};
	const streetNumber = get('street_number');
	const route = get('route');
	const street = [streetNumber, route].filter(Boolean).join(' ') || get('subpremise') || get('premise');
	const city = get('locality') || get('sublocality') || get('sublocality_level_1') || get('administrative_area_level_2');
	let state = getShort('administrative_area_level_1');
	if (state && state.length === 2) {
		state = state.toUpperCase();
		if (!US_STATES.includes(state)) state = '';
	}
	const zipCode = get('postal_code') || '';
	return { street, city, state, zipCode };
}

/**
 * GET /api/places/autocomplete?input=...&sessionToken=...
 * Proxies to Places API (New) Autocomplete, returns suggestions with place_id and description.
 */
async function autocomplete(req, res) {
	const apiKey = getApiKey();
	const input = (req.query.input || '').trim();
	if (!input) {
		return res.status(400).json({ error: 'input is required', message: 'Missing search input.' });
	}
	const sessionToken = (req.query.sessionToken || '').trim();

	const body = { input };
	if (sessionToken) body.sessionToken = sessionToken;

	const response = await fetch(PLACES_AUTOCOMPLETE_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': apiKey,
		},
		body: JSON.stringify(body),
	});

	const data = await response.json();

	if (!response.ok) {
		return res.status(response.status).json({
			error: data.error?.code || 'Places request failed',
			message: data.error?.message || data.error_message || 'Places request failed.',
		});
	}

	const suggestions = data.suggestions || [];
	const predictions = suggestions
		.filter((s) => s.placePrediction)
		.map((s) => {
			const p = s.placePrediction;
			const placeId = p.placeId || (p.place ? p.place.replace(/^places\//, '') : '');
			const description = (p.text && p.text.text) ? p.text.text : (p.structuredFormat ? [p.structuredFormat.mainText?.text, p.structuredFormat.secondaryText?.text].filter(Boolean).join(', ') : '');
			return { place_id: placeId, description };
		})
		.filter((p) => p.place_id);

	return res.status(200).json({ predictions });
}

/**
 * GET /api/places/details?place_id=...
 * Proxies to Places API (New) Place Details, returns normalized prefill payload:
 * { name, website, address: { street, city, state, zipCode } }
 */
async function placeDetails(req, res) {
	const apiKey = getApiKey();
	const placeId = (req.query.place_id || '').trim();
	if (!placeId) {
		return res.status(400).json({ error: 'place_id is required', message: 'Missing place_id.' });
	}
	const idOnly = placeId.replace(/^places\//, '');
	const url = `${PLACES_DETAILS_BASE}/${encodeURIComponent(idOnly)}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'X-Goog-Api-Key': apiKey,
			'X-Goog-FieldMask': 'displayName,formattedAddress,addressComponents,websiteUri',
		},
	});

	const result = await response.json();

	if (!response.ok) {
		return res.status(response.status).json({
			error: result.error?.code || 'Place details request failed',
			message: result.error?.message || result.error_message || 'Place details request failed.',
		});
	}

	const name = (result.displayName && result.displayName.text) ? result.displayName.text.trim() : '';
	const website = (result.websiteUri || '').trim();
	let address = parseAddressComponentsNew(result.addressComponents);
	if (!address && result.formattedAddress) {
		const parts = result.formattedAddress.split(',').map((p) => p.trim());
		address = {
			street: parts[0] || '',
			city: parts[1] || '',
			state: '',
			zipCode: '',
		};
		if (parts.length >= 3) {
			const last = parts[parts.length - 1];
			const stateZip = last.match(/^([A-Za-z]{2})\s+(\d{5}(-\d{4})?)$/);
			if (stateZip) {
				const abbr = stateZip[1].toUpperCase();
				if (US_STATES.includes(abbr)) {
					address.state = abbr;
					address.zipCode = stateZip[2];
				}
			}
		}
	}
	if (!address) {
		address = { street: '', city: '', state: '', zipCode: '' };
	}

	return res.status(200).json({
		name,
		website,
		address,
	});
}

module.exports = {
	autocomplete,
	placeDetails,
};
