const {
	CreateBusinessSchema,
	UpdateBusinessSchema,
} = require('../schemas/Business');
const { store, nextId, persistStore } = require('./devDemoStore');

const IS_DEV_DEMO_MODE = process.env.DEV_DEMO_MODE === 'true';

let businessesCollection = null;
let menusCollection = null;
let menuItemsCollection = null;
if (!IS_DEV_DEMO_MODE) {
	const { db } = require('./firestoreInit');
	businessesCollection = db.collection('businesses');
	menusCollection = db.collection('menus');
	menuItemsCollection = db.collection('menu_items');
}

async function listBusinesses() {
	if (IS_DEV_DEMO_MODE) {
		return store.businesses.map((b) => ({ id: b.id, name: b.name }));
	}

	const snap = await businessesCollection.get();
	return snap.docs.map((d) => ({
		id: d.id,
		name: d.data().name,
	}));
}

async function getBusinessById(id) {
	if (IS_DEV_DEMO_MODE) {
		return store.businesses.find((b) => b.id === id) || null;
	}

	const doc = await businessesCollection.doc(id).get();
	if (!doc.exists) return null;
	return { id: doc.id, ...doc.data() };
}

async function getBusinessWithMenus(id) {
	const business = await getBusinessById(id);
	if (!business) return null;

	if (IS_DEV_DEMO_MODE) {
		const menus = [];
		if (business.menu_id) {
			const menu = store.menus.find((m) => m.id === business.menu_id);
			if (menu) {
				menus.push({
					...menu,
					items: store.menuItems.filter((i) => i.menu_id === menu.id),
				});
			}
		}
		return { ...business, menus };
	}

	// MVP: one menu per business — return only the menu referenced by business.menu_id
	const menus = [];
	if (business.menu_id) {
		const menuDoc = await menusCollection.doc(business.menu_id).get();
		if (menuDoc.exists) {
			const menu = { id: menuDoc.id, ...menuDoc.data() };
			const itemsSnap = await menuItemsCollection
				.where('menu_id', '==', menu.id)
				.get();
			menu.items = itemsSnap.docs.map((i) => ({
				id: i.id,
				...i.data(),
			}));
			menus.push(menu);
		}
	}
	return { ...business, menus };
}

async function createBusiness(businessObj) {
	const valid = CreateBusinessSchema.parse(businessObj);
	valid.menu_id = null; // Ensure menu_id initialized to null

	// Remove undefined fields so Firestore doesn't reject them
	Object.keys(valid).forEach(
		(key) => valid[key] === undefined && delete valid[key],
	);

	if (IS_DEV_DEMO_MODE) {
		const created = {
			id: nextId('biz_demo'),
			...valid,
		};
		store.businesses.push(created);
		persistStore();
		return created;
	}

	const ref = await businessesCollection.add(valid);
	const snap = await ref.get();
	return { id: ref.id, ...snap.data() };
}

async function updateBusiness(id, updateObj) {
	if (IS_DEV_DEMO_MODE) {
		const idx = store.businesses.findIndex((b) => b.id === id);
		if (idx === -1) return null;
		const merged = { id, ...store.businesses[idx], ...updateObj };
		const protectedFields = ['menu_id'];
		protectedFields.forEach((field) => delete merged[field]);
		Object.keys(merged).forEach(
			(key) => merged[key] === undefined && delete merged[key],
		);
		const valid = UpdateBusinessSchema.parse(merged);
		const updated = { ...store.businesses[idx], ...valid };
		store.businesses[idx] = updated;
		persistStore();
		return updated;
	}

	const docRef = businessesCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;

	const merged = { id, ...snap.data(), ...updateObj };

	// Remove protected fields before validation
	const protectedFields = ['menu_id'];
	protectedFields.forEach((field) => delete merged[field]);

	// Remove undefined fields so Zod doesn't validate them
	Object.keys(merged).forEach(
		(key) => merged[key] === undefined && delete merged[key],
	);

	const valid = UpdateBusinessSchema.parse(merged);

	await docRef.update(valid);
	const updated = await docRef.get();
	return { id: updated.id, ...updated.data() };
}

async function deleteBusiness(id) {
	if (IS_DEV_DEMO_MODE) {
		const idx = store.businesses.findIndex((b) => b.id === id);
		if (idx === -1) return null;
		store.businesses.splice(idx, 1);
		persistStore();
		return true;
	}

	const docRef = businessesCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;
	await docRef.delete();
	return true;
}

async function businessNameExists(name, excludeId = null) {
	if (IS_DEV_DEMO_MODE) {
		const trimmed = name.trim();
		const matches = store.businesses.filter((b) => b.name === trimmed);
		if (matches.length === 0) return false;
		if (!excludeId) return true;
		return matches.some((b) => b.id !== excludeId);
	}

	const snap = await businessesCollection
		.where('name', '==', name.trim())
		.get();
	if (snap.empty) return false;
	if (!excludeId) return true;
	return snap.docs.some((d) => d.id !== excludeId);
}

module.exports = {
	listBusinesses,
	getBusinessById,
	getBusinessWithMenus,
	createBusiness,
	updateBusiness,
	deleteBusiness,
	businessNameExists,
};
