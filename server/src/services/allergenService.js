// server/src/services/allergenService.js
const { db } = require('./firestoreInit');
const { AllergenSchema } = require('../schemas/Allergen');

async function listAllergens() {
	const snap = await db.collection('allergens').get();

	// Validate data and return as array of { id, label }
	return snap.docs.map((d) => AllergenSchema.parse({ id: d.id, ...d.data() }));
}

async function getAllergenById(id) {
	const doc = await db.collection('allergens').doc(id).get();
	if (!doc.exists) return null;
	return AllergenSchema.parse({ id: doc.id, ...doc.data() });
}

module.exports = {
	listAllergens,
	getAllergenById,
};
