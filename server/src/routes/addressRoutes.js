// server/src/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const addressController = require('../controllers/addressController');

// GET /api/addresses - list addresses
router.get('/', asyncHandler(addressController.listAddresses));

// GET /api/addresses/:id
router.get('/:id', asyncHandler(addressController.getAddressById));

// POST /api/addresses
router.post('/', asyncHandler(addressController.createAddress));

// PUT /api/addresses/:id
router.put('/:id', asyncHandler(addressController.updateAddress));

// DELETE /api/addresses/:id
router.delete('/:id', asyncHandler(addressController.deleteAddress));

module.exports = router;
