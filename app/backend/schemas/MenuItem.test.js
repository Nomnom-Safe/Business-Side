const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MenuItem = require('./MenuItem');

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
	await MenuItem.deleteMany({});
});

describe('MenuItem Schema', () => {
	test('should create a valid MenuItem', async () => {
		const item = new MenuItem({
			name: 'Grilled Cheese',
			ingredients: ['Cheese', 'Bread', 'Butter'],
			description: 'Toasty and cheesy',
			allergens: ['Dairy', 'Wheat'],
			menuIDs: ['menu1'],
		});

		const saved = await item.save();

		expect(saved._id).toBeDefined();
		expect(saved.name).toBe('Grilled Cheese');
		expect(saved.ingredients.length).toBe(3);
		expect(saved.allergens).toContain('Dairy');
	});

	test('should allow empty arrays for optional fields', async () => {
		const item = new MenuItem({ name: 'Plain Toast' });
		const saved = await item.save();

		expect(saved.name).toBe('Plain Toast');
		expect(saved.ingredients).toEqual([]);
		expect(saved.allergens).toEqual([]);
		expect(saved.menuIDs).toEqual([]);
	});
});
