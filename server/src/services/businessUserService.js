const { db } = require('./firestoreInit');
const bcrypt = require('bcrypt');
const {
	CreateBusinessUserSchema,
	UpdateBusinessUserSchema,
} = require('../schemas/BusinessUser.js');

const usersCollection = db.collection('business_users');

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
	// Validate input using Zod
	const valid = CreateBusinessUserSchema.parse(userObj);

	// Hash password
	const salt = await bcrypt.genSalt(12);
	const hashed = await bcrypt.hash(valid.password, salt);

	const toSave = { ...valid, password: hashed };

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

	// Inject ID into update object so Zod can validate it
	const valid = UpdateBusinessUserSchema.parse({
		id: doc.id,
		...updateObj,
	});

	// Hash password if present
	if (valid.password) {
		const salt = await bcrypt.genSalt(12);
		valid.password = await bcrypt.hash(valid.password, salt);
	}

	await doc.ref.update(valid);

	const updated = await doc.ref.get();
	const data = updated.data();
	data.id = updated.id;
	data.getFullName = () => `${data.first_name} ${data.last_name}`;
	return data;
}

/* Non-MVP Features: admin.
	async function getUsersByBusinessId(businessId) {
		const snap = await usersCollection
			.where('business_id', '==', businessId)
			.get();
		return snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
	}

async function countAdmins(businessId) {
	const snap = await usersCollection
		.where('business_id', '==', businessId)
		.where('admin', '==', true)
		.get();
	return snap.size || 0;
}
*/

module.exports = {
	getUserByEmail,
	createUser,
	updateUserByEmail,
	/* Non-MVP Features: admin.
		getUsersByBusinessId,
		countAdmins,
	*/
};
