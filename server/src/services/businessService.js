const { db } = require('./firestoreInit');
const {
	CreateBusinessSchema,
	UpdateBusinessSchema,
} = require('../schemas/Business');

const businessesCollection = db.collection('businesses');
const menusCollection = db.collection('menus');
const menuItemsCollection = db.collection('menu_items');

async function listBusinesses() {
	const snap = await businessesCollection.get();
	return snap.docs.map((d) => ({
		id: d.id,
		name: d.data().name,
	}));
}

async function getBusinessById(id) {
	const doc = await businessesCollection.doc(id).get();
	if (!doc.exists) return null;
	return { id: doc.id, ...doc.data() };
}

async function getBusinessWithMenus(id) {
	const business = await getBusinessById(id);
	if (!business) return null;

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

	const ref = await businessesCollection.add(valid);
	const snap = await ref.get();
	return { id: ref.id, ...snap.data() };
}

async function updateBusiness(id, updateObj) {
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
	const docRef = businessesCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;
	await docRef.delete();
	return true;
}

async function businessNameExists(name, excludeId = null) {
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
