const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Business = require('./Business');

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();
	await mongoose.connect(mongoUri);
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

describe('Business Model', () => {
	test('should create a new business successfully', async () => {
		const businessData = {
			name: 'Test Restaurant',
			url: 'http://test.com',
			address: '123 Test St',
			allergens: ['peanuts', 'gluten'],
			menus: [],
		};

		const business = new Business(businessData);
		const savedBusiness = await business.save();

		expect(savedBusiness._id).toBeDefined();
		expect(savedBusiness.name).toBe(businessData.name);
		expect(savedBusiness.url).toBe(businessData.url);
		expect(savedBusiness.address).toBe(businessData.address);
		expect(savedBusiness.allergens).toEqual(businessData.allergens);
		expect(savedBusiness.menus).toEqual(businessData.menus);
	});

	test('should fail if required fields are missing', async () => {
		const businessData = {
			url: 'http://test.com',
			allergens: ['peanuts'],
		};

		const business = new Business(businessData);

		await expect(business.save()).rejects.toThrow(
			mongoose.Error.ValidationError,
		);
	});

	test('should have default empty arrays for allergens and menus', async () => {
		const businessData = {
			name: 'Another Test Restaurant',
			address: '123 Test St',
			restaurant: new mongoose.Types.ObjectId(),
		};

		const business = new Business(businessData);
		const savedBusiness = await business.save();

		expect(savedBusiness.allergens).toEqual([]);
		expect(savedBusiness.menus).toEqual([]);
	});
});
