const { db } = require('./firestoreInit');
const { CreateMenuSchema } = require('../schemas/Menu');

const menusCollection = db.collection('menus');
const restaurantsCollection = db.collection('restaurants');

async function listMenus() {
	const snap = await menusCollection.get();
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function createMenuForRestaurant(restaurantId) {
	// Validate input using Zod
	CreateMenuSchema.parse({ restaurant_id: restaurantId });

	// Ensure restaurant exists
	const restRef = restaurantsCollection.doc(restaurantId);
	const restSnap = await restRef.get();
	if (!restSnap.exists)
		throw new Error('Referenced restaurant_id does not exist');

	// Create menu
	const ref = await menusCollection.add({ restaurant_id: restaurantId });

	// Update restaurant.menu_id
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
		const restaurantId = menu.restaurant_id;
		await menusCollection.doc(id).delete();
		if (restaurantId) {
			await restaurantsCollection.doc(restaurantId).update({ menu_id: null });
		}
		return true;
	}
*/

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
