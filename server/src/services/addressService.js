// server/src/services/addressService.js

const {
	AddressSchema,
	CreateAddressSchema,
	UpdateAddressSchema,
} = require('../schemas/Address');
const { store, nextId, persistStore } = require('./devDemoStore');

const IS_DEV_DEMO_MODE = process.env.DEV_DEMO_MODE === 'true';

let addressesCollection = null;
if (!IS_DEV_DEMO_MODE) {
	const { db } = require('./firestoreInit');
	addressesCollection = db.collection('addresses');
}

async function verifyAddressExists(address_id) {
	if (!address_id) return false;

	if (IS_DEV_DEMO_MODE) {
		return store.addresses.some((a) => a.id === address_id);
	}

	const doc = await addressesCollection.doc(address_id).get();
	return doc.exists;
}

async function listAddresses() {
	if (IS_DEV_DEMO_MODE) {
		return store.addresses.map((a) => AddressSchema.parse({ ...a }));
	}

	const snap = await addressesCollection.get();
	return snap.docs.map((d) => AddressSchema.parse({ id: d.id, ...d.data() }));
}

async function getAddressById(id) {
	if (IS_DEV_DEMO_MODE) {
		const item = store.addresses.find((a) => a.id === id);
		if (!item) return null;
		return AddressSchema.parse({ ...item });
	}

	const doc = await addressesCollection.doc(id).get();
	if (!doc.exists) return null;
	return AddressSchema.parse({ id: doc.id, ...doc.data() });
}

async function createAddress(addressObj) {
	const valid = CreateAddressSchema.parse(addressObj);

	if (IS_DEV_DEMO_MODE) {
		const saved = { id: nextId('addr_demo'), ...valid };
		store.addresses.push(saved);
		persistStore();
		return AddressSchema.parse(saved);
	}

	const ref = await addressesCollection.add(valid);
	const snap = await ref.get();

	return AddressSchema.parse({ id: ref.id, ...snap.data() });
}

async function updateAddress(id, updateObj) {
	if (IS_DEV_DEMO_MODE) {
		const idx = store.addresses.findIndex((a) => a.id === id);
		if (idx === -1) return null;
		const merged = { id, ...store.addresses[idx], ...updateObj };
		const valid = UpdateAddressSchema.parse(merged);
		store.addresses[idx] = valid;
		persistStore();
		return AddressSchema.parse(valid);
	}

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
	if (IS_DEV_DEMO_MODE) {
		const idx = store.addresses.findIndex((a) => a.id === id);
		if (idx === -1) return null;
		store.addresses.splice(idx, 1);
		persistStore();
		return true;
	}

	const docRef = addressesCollection.doc(id);
	const snap = await docRef.get();
	if (!snap.exists) return null;

	await docRef.delete();
	return true;
}

module.exports = {
	verifyAddressExists,
	listAddresses,
	getAddressById,
	createAddress,
	updateAddress,
	deleteAddress,
};
