const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');
const bcrypt = require('bcrypt');

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

const db = admin.firestore();

const usersCollection = db.collection('business_users');
const restaurantsCollection = db.collection('restaurants');

async function getUserByEmail(email) {
	const q = await usersCollection.where('email', '==', email).limit(1).get();
	if (q.empty) return null;
	const doc = q.docs[0];
	const data = doc.data();
	data.id = doc.id;
	data.getFullName = () => `${data.first_name} ${data.last_name}`;
	return data;
}

async function createUser(userObj) {
	const salt = await bcrypt.genSalt(12);
	const hashed = await bcrypt.hash(userObj.password, salt);
	const toSave = { ...userObj, password: hashed };
	const ref = await usersCollection.add(toSave);
	const snap = await ref.get();
	const data = snap.data();
	data.id = ref.id;
	data.getFullName = () => `${data.first_name} ${data.last_name}`;
	return data;
}

async function updateUserByEmail(email, updateObj) {
	const q = await usersCollection.where('email', '==', email).limit(1).get();
	if (q.empty) return null;
	const doc = q.docs[0];
	// If updating password, hash it
	if (updateObj.password) {
		const salt = await bcrypt.genSalt(12);
		updateObj.password = await bcrypt.hash(updateObj.password, salt);
	}
	await doc.ref.update(updateObj);
	const updated = await doc.ref.get();
	const data = updated.data();
	data.id = updated.id;
	data.getFullName = () => `${data.first_name} ${data.last_name}`;
	return data;
}

async function getBusinessById(id) {
	if (!id) return null;
	const doc = await restaurantsCollection.doc(id).get();
	if (!doc.exists) return null;
	const data = doc.data();
	data.id = doc.id;
	return data;
}

module.exports = {
	db,
	getUserByEmail,
	createUser,
	updateUserByEmail,
	getBusinessById,
};
