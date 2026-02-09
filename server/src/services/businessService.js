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

	const menusSnap = await menusCollection.where('business_id', '==', id).get();

	const menus = await Promise.all(
		menusSnap.docs.map(async (mDoc) => {
			const menu = { id: mDoc.id, ...mDoc.data() };
			const itemsSnap = await menuItemsCollection
				.where('menu_id', '==', menu.id)
				.get();
			menu.items = itemsSnap.docs.map((i) => ({
				id: i.id,
				...i.data(),
			}));
			return menu;
		}),
	);
	return { ...business, menus };
}

async function createBusiness(businessObj) {
	const valid = CreateBusinessSchema.parse(businessObj);
	valid.menu_id = null; // Ensure menu_id initialized to null
	const ref = await businessesCollection.add(valid);
	const snap = await ref.get();
	return { id: ref.id, ...snap.data() };
}

async function updateBusiness(id, updateObj) {
	const docRef = businessesCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;

	const merged = { id, ...snap.data(), ...updateObj };
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
