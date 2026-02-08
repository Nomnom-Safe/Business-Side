const { db } = require('./firestoreInit');

const restaurantsCollection = db.collection('restaurants');
const menusCollection = db.collection('menus');
const menuItemsCollection = db.collection('menu_items');

async function listBusinesses() {
	const snap = await restaurantsCollection.get();
	return snap.docs
		.map((d) => ({ id: d.id, ...(d.data() || {}) }))
		.map((r) => ({ id: r.id, name: r.name }));
}

async function getBusinessById(id) {
	const doc = await restaurantsCollection.doc(id).get();
	if (!doc.exists) return null;
	const data = doc.data();
	data.id = doc.id;
	return data;
}

async function getBusinessWithMenus(id) {
	const business = await getBusinessById(id);
	if (!business) return null;

	const menusSnap = await menusCollection
		.where('restaurant_id', '==', id)
		.get();
	const menus = await Promise.all(
		menusSnap.docs.map(async (mDoc) => {
			const menu = mDoc.data();
			menu.id = mDoc.id;
			const itemsSnap = await menuItemsCollection
				.where('menu_id', '==', menu.id)
				.get();
			menu.items = itemsSnap.docs.map((i) => ({
				id: i.id,
				...(i.data() || {}),
			}));
			return menu;
		}),
	);

	return { ...business, menus };
}

async function createBusiness(businessObj) {
	const ref = await restaurantsCollection.add(businessObj);
	const snap = await ref.get();
	const data = snap.data();
	data.id = ref.id;
	return data;
}

async function updateBusiness(id, updateObj) {
	const docRef = restaurantsCollection.doc(id);
	await docRef.update(updateObj);
	const snap = await docRef.get();
	if (!snap.exists) return null;
	const data = snap.data();
	data.id = snap.id;
	return data;
}

async function deleteBusiness(id) {
	const docRef = restaurantsCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;
	await docRef.delete();
	return true;
}

async function businessNameExists(name, excludeId = null) {
	let q = restaurantsCollection.where('name', '==', name.trim());
	const snap = await q.get();
	if (snap.empty) return false;
	if (!excludeId) return true;
	const docs = snap.docs.filter((d) => d.id !== excludeId);
	return docs.length > 0;
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
