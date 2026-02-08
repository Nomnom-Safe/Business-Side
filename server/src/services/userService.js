const { db } = require('./firestoreInit');
const bcrypt = require('bcrypt');

const usersCollection = db.collection('users');

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

module.exports = {
	getUserByEmail,
	createUser,
	updateUserByEmail,
};
