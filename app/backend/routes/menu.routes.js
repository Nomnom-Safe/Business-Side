const express = require('express');
const router = express.Router();
const Menu = require('../schemas/Menu');
const Business = require('../schemas/Business');
const mongoose = require('mongoose');

// @route   GET /api/menus
// @desc    Get all menus
// @access  Public (no auth yet)
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find();

    // Always ensure Master Menu appears first
    menus.sort((a, b) => {
      if (a.title === 'Master Menu') return -1;
      if (b.title === 'Master Menu') return 1;
      return 0;
    });

    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch menus' });
  }
});

// @route   POST /api/menus
// @desc    Create a new menu
// @access  Public (no auth yet)
router.post('/', async (req, res) => {
  try {
    const { title, description, restaurant } = req.body;

    // Create new menu document from request body
    const newMenu = new Menu({
      title,
      description,
      restaurant,
    });

    const savedMenu = await newMenu.save();

    // After saving menu, update the corresponding Business document
    await Business.findByIdAndUpdate(
      restaurant,
      { $push: { menus: savedMenu._id } },
      { new: true }
    );

    res.status(201).json(savedMenu);
  } catch (err) {
    res.status(400).json({ error: 'Error creating menu: ' + err.message });
  }
});

// @route   PUT /api/menus/update-title-description
// @desc    Update a menu's title and description
// @access  Public (no auth yet)
router.put('/update-title-description', async (req, res) => {
  try {
    const { businessId, title, description } = req.body;

    // Find the most recent menu for this business (since they are editing latest one)
    const business = await Business.findById(businessId).populate('menus');

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const lastMenuId = business.menus[business.menus.length - 1];

    if (!lastMenuId) {
      return res.status(404).json({ error: 'No menus found for business' });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      lastMenuId,
      { title, description },
      { new: true }
    );

    res.status(200).json(updatedMenu);
  } catch (err) {
    res.status(400).json({ error: 'Error updating menu: ' + err.message });
  }
});


// @route   DELETE /api/menus/:id
// @desc    Delete a menu by ID
// @access  Public (no auth yet)
router.delete('/:id', async (req, res) => {
  try {
    const menuId = req.params.id;

    // Step 1: Find the menu to get the restaurant ID
    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    const restaurantId = menu.restaurant;

    // Step 2: Delete the menu
    await Menu.findByIdAndDelete(menuId);

    // Step 3: Remove the menu reference from the business
    await Business.findByIdAndUpdate(restaurantId, {
      $pull: { menus: menuId },
    });

    res.json({ message: 'Menu deleted and business updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete menu: ' + err.message });
  }
});

module.exports = router;
