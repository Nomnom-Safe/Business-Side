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

	// Create menu with default title for persistence and display
	const ref = await menusCollection.add({
		business_id: businessId,
		title: 'Your Menu',
	});

	// Update business.menu_id
	await restRef.update({ menu_id: ref.id });

	const snap = await ref.get();
	return { id: ref.id, title: 'Your Menu', ...snap.data() };
}

/**
 * Get the menu for a business, or create one if it doesn't exist (idempotent).
 * Returns the menu with default title applied.
 */
async function ensureMenuForBusiness(businessId) {
	CreateMenuSchema.parse({ business_id: businessId });

	const menus = await listMenus();
	const existing = menus.find((m) => m.business_id === businessId);
	if (existing) {
		return { id: existing.id, title: existing.title || 'Your Menu', ...existing };
	}

	return createMenuForBusiness(businessId);
}

async function getMenuById(id) {
	const doc = await menusCollection.doc(id).get();
	if (!doc.exists) return null;
	const data = doc.data();
	return { id: doc.id, title: data.title || 'Your Menu', ...data };
}

async function updateMenu(id, updates) {
	const docRef = menusCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;

	const allowed = ['title'];
	const sanitized = {};
	allowed.forEach((key) => {
		if (updates[key] !== undefined) sanitized[key] = updates[key];
	});
	if (Object.keys(sanitized).length === 0) return { id, ...snap.data() };

	await docRef.update(sanitized);
	const updated = await docRef.get();
	return { id: updated.id, ...updated.data() };
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
	ensureMenuForBusiness,
	getMenuById,
	updateMenu,
	deleteMenu,
};
