const mongoose = require('mongoose');

// Use jest.mock to mock mongoose.connect
jest.mock('mongoose', () => ({
	connect: jest.fn(),
}));

// Import the function after mocking
const connectDB = require('./db');

describe('connectDB', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		jest.resetModules(); // Clears the cache
		process.env = { ...originalEnv, MONGO_URI: 'mongodb://test-uri' };
	});

	afterEach(() => {
		process.env = originalEnv;
		jest.clearAllMocks();
	});

	test('should connect to MongoDB successfully', async () => {
		mongoose.connect.mockResolvedValueOnce(); // Simulate successful connection

		console.log = jest.fn(); // Suppress logs

		await connectDB();

		expect(mongoose.connect).toHaveBeenCalledWith('mongodb://test-uri');
		expect(console.log).toHaveBeenCalledWith('MongoDB connected');
	});

	test('should log error and exit on failure', async () => {
		const mockError = new Error('Connection failed');
		mongoose.connect.mockRejectedValueOnce(mockError);

		console.error = jest.fn();
		const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

		await connectDB();

		expect(console.error).toHaveBeenCalledWith(
			'MongoDB connection error:',
			'Connection failed',
		);
		expect(mockExit).toHaveBeenCalledWith(1);
	});
});
