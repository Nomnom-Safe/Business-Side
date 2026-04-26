const bcrypt = require('bcrypt');
const {
	CreateBusinessUserSchema,
	UpdateBusinessUserSchema,
} = require('../schemas/BusinessUser.js');
const { store, nextId, persistStore } = require('./devDemoStore');

const IS_DEV_DEMO_MODE = process.env.DEV_DEMO_MODE === 'true';

let usersCollection = null;
if (!IS_DEV_DEMO_MODE) {
	const { db } = require('./firestoreInit');
	usersCollection = db.collection('business_users');
}

async function getUserByEmail(email) {
	if (IS_DEV_DEMO_MODE) {
		const found = store.users.find((u) => u.email === email) || null;
		if (!found) return null;
		return {
			...found,
			getFullName: () => `${found.first_name} ${found.last_name}`,
		};
	}

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

	if (IS_DEV_DEMO_MODE) {
		const saved = {
			id: nextId('user_demo'),
			...toSave,
		};
		store.users.push(saved);
		persistStore();
		return {
			...saved,
			getFullName: () => `${saved.first_name} ${saved.last_name}`,
		};
	}

	const ref = await usersCollection.add(toSave);
	const snap = await ref.get();

	const data = snap.data();
	data.id = ref.id;
	data.getFullName = () => `${data.first_name} ${data.last_name}`;
	return data;
}

async function updateUserByEmail(email, updateObj) {
	if (IS_DEV_DEMO_MODE) {
		const idx = store.users.findIndex((u) => u.email === email);
		if (idx === -1) return null;
		const current = store.users[idx];
		const valid = UpdateBusinessUserSchema.parse({
			id: current.id,
			...updateObj,
		});
		if (valid.password) {
			const salt = await bcrypt.genSalt(12);
			valid.password = await bcrypt.hash(valid.password, salt);
		}
		const updated = { ...current, ...valid };
		store.users[idx] = updated;
		persistStore();
		return {
			...updated,
			getFullName: () => `${updated.first_name} ${updated.last_name}`,
		};
	}

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
