const { db } = require('./firestoreInit');

const categoriesCollection = db.collection('categories');

/**
 * List categories for a business, optionally sorted by sort_order then label.
 */
async function listByBusinessId(businessId) {
	if (!businessId) return [];
	const snap = await categoriesCollection
		.where('business_id', '==', businessId)
		.get();
	const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
	list.sort((a, b) => {
		const orderA = a.sort_order != null ? a.sort_order : 999;
		const orderB = b.sort_order != null ? b.sort_order : 999;
		if (orderA !== orderB) return orderA - orderB;
		return (a.label || '').localeCompare(b.label || '');
	});
	return list;
}

/**
 * Create a category for a business. Label required.
 */
async function create(businessId, { label, sort_order }) {
	if (!businessId || !label || !String(label).trim()) {
		throw new Error('business_id and label are required');
	}
	const data = {
		business_id: businessId,
		label: String(label).trim(),
	};
	if (sort_order != null) data.sort_order = Number(sort_order);
	const ref = await categoriesCollection.add(data);
	const snap = await ref.get();
	return { id: ref.id, ...snap.data() };
}

/**
 * Update a category. Ensures it belongs to the given business (or omit check if not passed).
 */
async function update(id, { label, sort_order }, businessId) {
	const ref = categoriesCollection.doc(id);
	const snap = await ref.get();
	if (!snap.exists) return null;
	const current = snap.data();
	if (businessId && current.business_id !== businessId) return null;
	const updates = {};
	if (label !== undefined) updates.label = String(label).trim();
	if (sort_order !== undefined) updates.sort_order = Number(sort_order);
	if (Object.keys(updates).length === 0) return { id, ...current };
	await ref.update(updates);
	const updated = await ref.get();
	return { id: ref.id, ...updated.data() };
}

/**
 * Delete a category. Ensures it belongs to the given business if businessId provided.
 */
async function remove(id, businessId) {
	const ref = categoriesCollection.doc(id);
	const snap = await ref.get();
	if (!snap.exists) return false;
	if (businessId && snap.data().business_id !== businessId) return false;
	await ref.delete();
	return true;
}

module.exports = {
	listByBusinessId,
	create,
	update,
	remove,
};
