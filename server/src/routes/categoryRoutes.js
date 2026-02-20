const express = require('express');
const router = express.Router({ mergeParams: true });
const categoryController = require('../controllers/categoryController');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/businesses/:businessId/categories
router.get('/', asyncHandler(categoryController.list));
// POST /api/businesses/:businessId/categories
router.post('/', asyncHandler(categoryController.create));
// PUT /api/businesses/:businessId/categories/:id
router.put('/:id', asyncHandler(categoryController.update));
// DELETE /api/businesses/:businessId/categories/:id
router.delete('/:id', asyncHandler(categoryController.remove));

module.exports = router;
