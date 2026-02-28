// server/src/routes/placesRoutes.js
// Proxy for Google Places API (autocomplete + place details). API key must be set on server (GOOGLE_PLACES_API_KEY or PLACES_API_KEY).

const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const placesController = require('../controllers/placesController');

// GET /api/places/autocomplete?input=...&sessionToken=...
router.get('/autocomplete', asyncHandler(placesController.autocomplete));

// GET /api/places/details?place_id=...
router.get('/details', asyncHandler(placesController.placeDetails));

module.exports = router;
