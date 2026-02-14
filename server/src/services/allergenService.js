// server/src/services/allergenService.js
const { db } = require('./firestoreInit');

async function listAllergens() {
	const snap = await db.collection('allergens').get();
	return snap.docs.map((d) => ({
		id: d.id,
		...d.data(),
	}));
}

async function getAllergenById(id) {
	const doc = await db.collection('allergens').doc(id).get();
	if (!doc.exists) return null;
	return { id: doc.id, ...doc.data() };
}

module.exports = {
	listAllergens,
	getAllergenById,
};
