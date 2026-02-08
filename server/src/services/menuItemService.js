const { db } = require('./firestoreInit');

const menuItemsCollection = db.collection('menu_items');

async function listMenuItems(filter = {}) {
	// filter: { menu_id }
	if (filter.menu_id) {
		const snap = await menuItemsCollection
			.where('menu_id', '==', filter.menu_id)
			.get();
		return snap.docs.map((d) => {
			return { id: d.id, ...(d.data() || {}) };
		});
	}
	const snap = await menuItemsCollection.get();
	return snap.docs.map((d) => {
		return { id: d.id, ...(d.data() || {}) };
	});
}

async function getMenuItemById(id) {
	const doc = await menuItemsCollection.doc(id).get();
	if (!doc.exists) return null;
	const data = doc.data();
	data.id = doc.id;
	return data;
}

async function createMenuItem(itemObj) {
	// itemObj should include name, description (<=10 words), menu_id, allergens array
	const ref = await menuItemsCollection.add(itemObj);
	const snap = await ref.get();
	const data = snap.data();
	data.id = ref.id;
	return data;
}

async function updateMenuItem(id, updateObj) {
	const docRef = menuItemsCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;
	await docRef.update(updateObj);
	const updated = await docRef.get();
	const data = updated.data();
	data.id = updated.id;
	return data;
}

async function deleteMenuItem(id) {
	const docRef = menuItemsCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;
	await docRef.delete();
	return true;
}

module.exports = {
	listMenuItems,
	getMenuItemById,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
};
