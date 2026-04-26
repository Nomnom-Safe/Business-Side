const { CreateMenuSchema } = require('../schemas/Menu');
const { store, nextId, persistStore } = require('./devDemoStore');

const IS_DEV_DEMO_MODE = process.env.DEV_DEMO_MODE === 'true';

let menusCollection = null;
let businessesCollection = null;
if (!IS_DEV_DEMO_MODE) {
	const { db } = require('./firestoreInit');
	menusCollection = db.collection('menus');
	businessesCollection = db.collection('businesses');
}

async function listMenus() {
	if (IS_DEV_DEMO_MODE) {
		return store.menus.map((m) => ({ ...m }));
	}

	const snap = await menusCollection.get();
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function createMenuForBusiness(businessId) {
	// Validate input using Zod
	CreateMenuSchema.parse({ business_id: businessId });

	if (IS_DEV_DEMO_MODE) {
		const business = store.businesses.find((b) => b.id === businessId);
		if (!business) throw new Error('Referenced businessId does not exist');
		const menu = {
			id: nextId('menu_demo'),
			business_id: businessId,
			title: 'Your Menu',
		};
		store.menus.push(menu);
		business.menu_id = menu.id;
		persistStore();
		return { ...menu };
	}

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

	if (IS_DEV_DEMO_MODE) {
		const existing = store.menus.find((m) => m.business_id === businessId);
		if (existing) return { ...existing, title: existing.title || 'Your Menu' };
		return createMenuForBusiness(businessId);
	}

	const menus = await listMenus();
	const existing = menus.find((m) => m.business_id === businessId);
	if (existing) {
		return { id: existing.id, title: existing.title || 'Your Menu', ...existing };
	}

	return createMenuForBusiness(businessId);
}

async function getMenuById(id) {
	if (IS_DEV_DEMO_MODE) {
		const menu = store.menus.find((m) => m.id === id);
		if (!menu) return null;
		return { ...menu, title: menu.title || 'Your Menu' };
	}

	const doc = await menusCollection.doc(id).get();
	if (!doc.exists) return null;
	const data = doc.data();
	return { id: doc.id, title: data.title || 'Your Menu', ...data };
}

async function updateMenu(id, updates) {
	if (IS_DEV_DEMO_MODE) {
		const idx = store.menus.findIndex((m) => m.id === id);
		if (idx === -1) return null;
		const allowed = ['title'];
		const sanitized = {};
		allowed.forEach((key) => {
			if (updates[key] !== undefined) sanitized[key] = updates[key];
		});
		const next = { ...store.menus[idx], ...sanitized };
		store.menus[idx] = next;
		persistStore();
		return { ...next };
	}

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
	if (IS_DEV_DEMO_MODE) {
		const idx = store.menus.findIndex((m) => m.id === id);
		if (idx === -1) return null;
		const menu = store.menus[idx];
		store.menus.splice(idx, 1);
		const business = store.businesses.find((b) => b.id === menu.business_id);
		if (business) business.menu_id = null;
		persistStore();
		return true;
	}

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
