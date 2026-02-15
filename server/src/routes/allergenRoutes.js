// server/src/routes/allergenRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const allergenController = require('../controllers/allergenController');

// @route GET /api/allergens
// @desc  Return all allergens as [{ id, label }, ...]
router.get('/', asyncHandler(allergenController.listAllergens));

// @route GET /api/allergens/:id
router.get('/:id', asyncHandler(allergenController.getAllergenById));

module.exports = router;
