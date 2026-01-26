const mongoose = require('mongoose');
require('dotenv').config(); // Loads MONGO_URI from .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Stop the server if connection fails
  }
};

module.exports = connectDB;

