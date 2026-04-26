// server/src/services/allergenService.js
const { AllergenSchema } = require('../schemas/Allergen');
const { store } = require('./devDemoStore');

const IS_DEV_DEMO_MODE = process.env.DEV_DEMO_MODE === 'true';

async function listAllergens() {
	if (IS_DEV_DEMO_MODE) {
		return store.allergens.map((a) => AllergenSchema.parse({ ...a }));
	}

	const { db } = require('./firestoreInit');
	const snap = await db.collection('allergens').get();

	// Validate data and return as array of { id, label }
	return snap.docs.map((d) => AllergenSchema.parse({ id: d.id, ...d.data() }));
}

async function getAllergenById(id) {
	if (IS_DEV_DEMO_MODE) {
		const item = store.allergens.find((a) => a.id === id);
		if (!item) return null;
		return AllergenSchema.parse({ ...item });
	}

	const { db } = require('./firestoreInit');
	const doc = await db.collection('allergens').doc(id).get();
	if (!doc.exists) return null;
	return AllergenSchema.parse({ id: doc.id, ...doc.data() });
}

module.exports = {
	listAllergens,
	getAllergenById,
};
