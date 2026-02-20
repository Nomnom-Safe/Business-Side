// server/src/routes/businessRoutes.js

const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const categoryRoutes = require('./categoryRoutes');
const asyncHandler = require('../utils/asyncHandler');

// Nested: /api/businesses/:businessId/categories
router.use('/:businessId/categories', categoryRoutes);

// @route   GET /api/businesses/
// @desc    Get a list of all businesses
// @access  Public (no auth yet)
router.get('/', asyncHandler(businessController.listBusinesses));

// @route   GET /api/businesses/:id
// @desc    Get a business by ID and populate its menus
// @access  Public (no auth yet)
router.get('/:id', asyncHandler(businessController.getBusinessById));

// @route   POST /api/businesses
// @desc    Create a new business and auto-generate its menu
// @access  Public (no auth yet)
router.post('/', asyncHandler(businessController.createBusiness));

// @route   PUT /api/businesses/:id
// @desc    Update a business
// @access  Public (no auth yet)
router.put('/:id', asyncHandler(businessController.updateBusiness));

// @route   DELETE /api/businesses/:id
// @desc    Delete a business
// @access  Public (no auth yet)
router.delete('/:id', asyncHandler(businessController.deleteBusiness));

module.exports = router;
