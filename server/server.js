// Load environment variables from .env (MongoDB connection string)
require('dotenv').config();

// Import Express framework and MongoDB connection logic
const express = require('express');
const connectDB = require('./src/config/db');
const mongoose = require('mongoose');

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('Error connecting to MongoDB:', err));
// Create an instance of an Express application
const app = express();

// Connect to MongoDB using Mongoose
// This uses the MONGO_URI defined in the .env file
connectDB();

// Tells Express to automatically parse incoming JSON in requests
app.use(express.json());

// Allow requests from the frontend
const cors = require('cors');
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
);

// Middleware for parsing cookies
const cookieparser = require('cookie-parser');
app.use(cookieparser());

// ROUTES
// All endpoints related to menus will be handled in menuRoutes.js
// For example: GET /api/menus or POST /api/menus
const menuRoutes = require('./src/routes/menuRoutes');
app.use('/api/menus', menuRoutes);

const menuItemRoutes = require('./src/routes/menuItemRoutes');
app.use('/api/menuitems', menuItemRoutes);

const auth = require('./src/routes/userRoutes');
app.use('/api/auth', auth);

// Admin routes archived (no longer mounted). See server/src/routes/adminRoutes.js for legacy code.

const businessRoutes = require('./src/routes/businessRoutes');
app.use('/api/businesses', businessRoutes);

// You can test this by visiting http://localhost:5000/
app.get('/', (req, res) => {
	res.send('NomNomSafe API is running');
});

// 404 handler
app.use((req, res, next) => {
	res.status(404).json({ error: 'Route not found' });
});

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
