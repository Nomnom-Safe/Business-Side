const { db } = require('./firestoreInit');
const {
	AddressSchema,
	CreateAddressSchema,
	UpdateAddressSchema,
} = require('../schemas/Address');

const addressesCollection = db.collection('addresses');

async function listAddresses() {
	const snap = await addressesCollection.get();
	return snap.docs.map((d) => AddressSchema.parse({ id: d.id, ...d.data() }));
}

async function getAddressById(id) {
	const doc = await addressesCollection.doc(id).get();
	if (!doc.exists) return null;
	return AddressSchema.parse({ id: doc.id, ...doc.data() });
}

async function createAddress(addressObj) {
	const valid = CreateAddressSchema.parse(addressObj);

	const ref = await addressesCollection.add(valid);
	const snap = await ref.get();

	return AddressSchema.parse({ id: ref.id, ...snap.data() });
}

async function updateAddress(id, updateObj) {
	const docRef = addressesCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;

	// Validate updated fields by merging with current
	const merged = { id, ...snap.data(), ...updateObj };
	const valid = UpdateAddressSchema.parse(merged);

	await docRef.update(valid);

	const updated = await docRef.get();
	return AddressSchema.parse({ id: updated.id, ...updated.data() });
}

async function deleteAddress(id) {
	const docRef = addressesCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;

	await docRef.delete();
	return true;
}

module.exports = {
	listAddresses,
	getAddressById,
	createAddress,
	updateAddress,
	deleteAddress,
};
