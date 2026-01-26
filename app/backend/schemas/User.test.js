const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./User');

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri);
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

beforeEach(async () => {
	await User.deleteMany({});
});

describe('User Schema', () => {
	test('should hash password before saving', async () => {
		const plainPassword = 'Test123!';
		const user = new User({
			first_name: 'Alice',
			last_name: 'Smith',
			email: 'alice@example.com',
			password: plainPassword,
			admin: false,
		});

		await user.save();

		expect(user.password).not.toBe(plainPassword);
		expect(user.password.length).toBeGreaterThan(20);
	});

	test('comparePassword() should return true for valid match', async () => {
		const user = new User({
			first_name: 'Bob',
			last_name: 'Jones',
			email: 'bob@example.com',
			password: 'Secret123!',
			admin: false,
		});

		await user.save();

		const match = await user.comparePassword('Secret123!');
		expect(match).toBe(true);
	});

	test('comparePassword() should return false for invalid password', async () => {
		const user = new User({
			first_name: 'Eve',
			last_name: 'Black',
			email: 'eve@example.com',
			password: 'ValidPass!',
			admin: true,
		});

		await user.save();

		const match = await user.comparePassword('WrongPass');
		expect(match).toBe(false);
	});

	test('getFullName() should return correct string', async () => {
		const user = new User({
			first_name: 'Charlie',
			last_name: 'Brown',
			email: 'charlie@example.com',
			password: 'Hello123!',
			admin: false,
		});

		expect(user.getFullName()).toBe('Charlie Brown');
	});
});
