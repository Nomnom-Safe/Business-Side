const { db } = require('./firestoreInit');

const menusCollection = db.collection('menus');
const restaurantsCollection = db.collection('restaurants');

async function listMenus() {
	const snap = await menusCollection.get();
	return snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
}

async function createMenuForRestaurant(restaurantId) {
	const toSave = { restaurant_id: restaurantId };
	const ref = await menusCollection.add(toSave);
	// set restaurant.menu_id to this menu
	await restaurantsCollection.doc(restaurantId).update({ menu_id: ref.id });
	const snap = await ref.get();
	const data = snap.data();
	data.id = ref.id;
	return data;
}

async function getMenuById(id) {
	const doc = await menusCollection.doc(id).get();
	if (!doc.exists) return null;
	const data = doc.data();
	data.id = doc.id;
	return data;
}

async function deleteMenu(id) {
	const doc = await menusCollection.doc(id).get();
	if (!doc.exists) return null;
	const menu = doc.data();
	const restaurantId = menu.restaurant_id;
	await menusCollection.doc(id).delete();
	if (restaurantId) {
		await restaurantsCollection.doc(restaurantId).update({ menu_id: null });
	}
	return true;
}

module.exports = {
	listMenus,
	createMenuForRestaurant,
	getMenuById,
	deleteMenu,
};
