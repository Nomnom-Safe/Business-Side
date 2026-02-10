const { db } = require('./firestoreInit');
const {
	CreateMenuItemSchema,
	UpdateMenuItemSchema,
	createMenuItemSchemaWithAllergens,
} = require('../schemas/MenuItem');

const menuItemsCollection = db.collection('menu_items');
const menusCollection = db.collection('menus');
const allergensCollection = db.collection('allergens');

async function listMenuItems(filter = {}) {
	if (filter.menu_id) {
		const snap = await menuItemsCollection
			.where('menu_id', '==', filter.menu_id)
			.get();
		return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
	}

	const snap = await menuItemsCollection.get();
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function getMenuItemById(id) {
	const doc = await menuItemsCollection.doc(id).get();
	if (!doc.exists) return null;
	return { id: doc.id, ...doc.data() };
}

async function createMenuItem(itemObj) {
	// Validate shape using Zod
	const valid = CreateMenuItemSchema.parse(itemObj);

	// Verify menu exists
	const menuRef = menusCollection.doc(valid.menu_id);
	const menuSnap = await menuRef.get();
	if (!menuSnap.exists) throw new Error('Referenced `menu_id` does not exist');

	// Optional: strict allergen validation
	if (valid.allergens?.length > 0) {
		const allergenSnap = await allergensCollection.get();
		const validIds = allergenSnap.docs.map((a) => a.id);

		const strictSchema = createMenuItemSchemaWithAllergens(validIds).omit({
			id: true,
		});
		strictSchema.parse(valid);
	}

	const ref = await menuItemsCollection.add(valid);
	const snap = await ref.get();
	return { id: ref.id, ...snap.data() };
}

async function updateMenuItem(id, updateObj) {
	const docRef = menuItemsCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;

	const current = snap.data();
	const merged = { id, ...current, ...updateObj };

	// Validate merged object
	UpdateMenuItemSchema.parse(merged);

	// If menu_id changed, verify menu exists
	if (updateObj.menu_id) {
		const menuRef = menusCollection.doc(updateObj.menu_id);
		const menuSnap = await menuRef.get();
		if (!menuSnap.exists)
			throw new Error('Referenced `menu_id` does not exist');
	}

	// Optional: strict allergen validation
	if (updateObj.allergens) {
		const allergenSnap = await allergensCollection.get();
		const validIds = allergenSnap.docs.map((a) => a.id);

		const strictSchema = createMenuItemSchemaWithAllergens(validIds).omit({
			id: true,
		});
		strictSchema.parse(merged);
	}

	await docRef.update(updateObj);

	const updated = await docRef.get();
	return { id: updated.id, ...updated.data() };
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
