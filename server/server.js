// Load environment variables
require('dotenv').config();

// Initialize Express and Firebase Admin (Firestore)
const express = require('express');
// Initialize Firebase Admin (firestoreInit performs idempotent init)
const { admin, db } = require('./src/services/firestoreInit');

// Create an instance of an Express application
const app = express();

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

const auth = require('./src/routes/businessUserRoutes');
app.use('/api/auth', auth);

// Allergen routes (provide id/label mapping for client)
const allergenRoutes = require('./src/routes/allergenRoutes');
app.use('/api/allergens', allergenRoutes);

// Addresses routes (allow creating address documents to reference by businesses)
const addressRoutes = require('./src/routes/addressRoutes');
app.use('/api/addresses', addressRoutes);

// Admin routes archived (no longer mounted). See server/src/routes/adminRoutes.js for legacy code.
// ARCHIVED: Admin Features - Not part of MVP (single user per business)
// const admin = require('./src/routes/adminRoutes');
// app.use('/api/admin', admin);

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
