const { db } = require('./firestoreInit');
const {
	MenuItemSchema,
	CreateMenuItemSchema,
	UpdateMenuItemSchema,
	createMenuItemSchemaWithAllergens,
} = require('../schemas/MenuItem');

const menuItemsCollection = db.collection('menu_items');
const menusCollection = db.collection('menus');
const allergensCollection = db.collection('allergens');

function normalizeMenuItemDoc(id, data) {
	const itemTypes = Array.isArray(data.item_types)
		? data.item_types
		: data.item_type != null
			? [data.item_type]
			: [];
	const itemType = itemTypes[0] != null ? itemTypes[0] : (data.item_type || 'entree');
	return MenuItemSchema.parse({
		id,
		...data,
		item_type: itemType,
		item_types: itemTypes,
	});
}

async function listMenuItems(filter = {}) {
	if (filter.menu_id) {
		const snap = await menuItemsCollection
			.where('menu_id', '==', filter.menu_id)
			.get();
		return snap.docs.map((d) => normalizeMenuItemDoc(d.id, d.data()));
	}

	const snap = await menuItemsCollection.get();
	return snap.docs.map((d) => normalizeMenuItemDoc(d.id, d.data()));
}

async function getMenuItemById(id) {
	const doc = await menuItemsCollection.doc(id).get();
	if (!doc.exists) return null;
	return normalizeMenuItemDoc(doc.id, doc.data());
}

async function createMenuItem(itemObj) {
	const raw = { ...itemObj };
	const itemTypes = Array.isArray(raw.item_types)
		? raw.item_types.filter(Boolean)
		: raw.item_type != null
			? [raw.item_type]
			: ['entree'];
	const itemType = itemTypes[0] || 'entree';
	const toValidate = {
		...raw,
		item_type: itemType,
		item_types: itemTypes,
	};
	const valid = CreateMenuItemSchema.parse(toValidate);

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
		strictSchema.parse({ ...valid, item_types: valid.item_types });
	}

	const ref = await menuItemsCollection.add(valid);
	const snap = await ref.get();
	return normalizeMenuItemDoc(ref.id, snap.data());
}

async function updateMenuItem(id, updateObj) {
	const docRef = menuItemsCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;

	const current = snap.data();
	let patch = { ...updateObj };
	if (patch.item_types !== undefined || patch.item_type !== undefined) {
		const itemTypes = Array.isArray(patch.item_types)
			? patch.item_types.filter(Boolean)
			: patch.item_type != null
				? [patch.item_type]
				: [current.item_type || current.item_types?.[0] || 'entree'];
		patch = { ...patch, item_type: itemTypes[0] || 'entree', item_types: itemTypes };
	}
	const merged = { id, ...current, ...patch };
	UpdateMenuItemSchema.parse(merged);

	if (patch.menu_id) {
		const menuRef = menusCollection.doc(patch.menu_id);
		const menuSnap = await menuRef.get();
		if (!menuSnap.exists)
			throw new Error('Referenced `menu_id` does not exist');
	}

	if (Array.isArray(patch.allergens)) {
		const allergenSnap = await allergensCollection.get();
		const validIds = allergenSnap.docs.map((a) => a.id);
		const strictSchema = createMenuItemSchemaWithAllergens(validIds).omit({
			id: true,
		});
		strictSchema.parse(merged);
	}

	await docRef.update(patch);
	const updated = await docRef.get();
	return normalizeMenuItemDoc(updated.id, updated.data());
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
