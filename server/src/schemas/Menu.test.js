const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Menu = require('./Menu');

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
	await Menu.deleteMany({});
});

describe('Menu Schema', () => {
	test('should create a valid Menu', async () => {
		const menu = new Menu({
			title: 'Lunch Specials',
			description: 'Weekday lunch options',
			restaurant: new mongoose.Types.ObjectId(),
		});

		const saved = await menu.save();

		expect(saved._id).toBeDefined();
		expect(saved.title).toBe('Lunch Specials');
		expect(saved.description).toBe('Weekday lunch options');
	});

	test('should require a title', async () => {
		const menu = new Menu({ description: 'No title menu' });

		await expect(menu.save()).rejects.toThrow();
	});

	test('should store a reference to a Business', async () => {
		const restaurantId = new mongoose.Types.ObjectId();
		const menu = await Menu.create({
			title: 'Dinner Menu',
			restaurant: restaurantId,
		});

		expect(menu.restaurant.toString()).toBe(restaurantId.toString());
	});
});
