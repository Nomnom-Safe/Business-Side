const { db } = require('./firestoreInit');
const { CreateMenuSchema } = require('../schemas/Menu');

const menusCollection = db.collection('menus');
const businessesCollection = db.collection('businesses');

async function listMenus() {
	const snap = await menusCollection.get();
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function createMenuForBusiness(businessId) {
	// Validate input using Zod
	CreateMenuSchema.parse({ business_id: businessId });

	// Ensure business exists
	const restRef = businessesCollection.doc(businessId);
	const restSnap = await restRef.get();
	if (!restSnap.exists) throw new Error('Referenced businessId does not exist');

	// Create menu
	const ref = await menusCollection.add({ business_id: businessId });

	// Update business.menu_id
	await restRef.update({ menu_id: ref.id });

	const snap = await ref.get();
	return { id: ref.id, ...snap.data() };
}

async function getMenuById(id) {
	const doc = await menusCollection.doc(id).get();
	if (!doc.exists) return null;
	return { id: doc.id, ...doc.data() };
}

/* Non-MVP Feature: Delete menu.
	async function deleteMenu(id) {
		const doc = await menusCollection.doc(id).get();
		if (!doc.exists) return null;
		const menu = doc.data();
		const businessId = menu.business_id;
		await menusCollection.doc(id).delete();
		if (businessId) {
			await businessesCollection.doc(businessId).update({ menu_id: null });
		}
		return true;
	}
*/

async function deleteMenu(id) {
	const doc = await menusCollection.doc(id).get();
	if (!doc.exists) return null;

	const menu = doc.data();
	const businessId = menu.business_id;

	await menusCollection.doc(id).delete();

	if (businessId) {
		await businessesCollection.doc(businessId).update({ menu_id: null });
	}

	return true;
}

module.exports = {
	listMenus,
	createMenuForBusiness,
	getMenuById,
	deleteMenu,
};
