const express = require('express');
const router = express.Router();
const MenuItem = require('../schemas/MenuItem');
const Menu = require('../schemas/Menu')
const mongoose = require('mongoose');

//
// MenuItems.jsx
//

// @route GET /api/menuitems/menu/:menuname&:businessID
// @desc Get menu by menuTitle
// @access Public
router.get('/menu/', async (req, res) => {
    try {
        const { encodedMenuName, businessID } = req.query;

        if (!encodedMenuName || !businessID) {
            return res.status(400).json({ error: 'Both encodedMenuName and businessID are required' });
        }
        // decript from safe for url formate
        const menuName = decodeURIComponent(encodedMenuName);

        const filter = {
            title: menuName,
            restaurant: businessID, 
        };
        // get only the menu
        const menu = await Menu.findOne(filter);

        res.status(200).json(menu || []);
    } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Could not fetch menu' });
    }
});

// @route GET /api/menuitems
// @desc Get menu items by menuID (optional)
// @access Public
router.get('/', async (req, res) => {
  try {
    const { menuID } = req.query; 

    let filter = {};
    // only get menuItems with the menuID in their menuIDs
    if (menuID) {
      filter = { menuIDs: menuID };  
    }

    const menuitems = await MenuItem.find(filter);

    res.status(200).json(menuitems || []);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Could not fetch menu items' });
  }
});
  

// @route   PUT api/menuitems
// @desc    Edit an existing menu item
// @access  Public (no auth yet)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients, allergens, menuIDs } = req.body;

    // Ensure the ID is provided
    if (!id) {
      return res.status(400).json({ error: 'Menu item ID is required' });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      // updated fields
      { name, description, ingredients, allergens, menuIDs },
       // Return the updated document and validate the data
      { new: true, runValidators: true}
    );

    // If no menu item is found, return an error
    if (!updatedMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(200).json(updatedMenuItem);
  } catch (err) {
    res.status(500).json({ error: 'Error editing menu item: ' + err.message });
  }
});

// @route   DELETE api/menuitems/:id
// @desc    Delete a menu item by ID
// @access  Public (no auth yet)
// @route DELETE /api/menuitems/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Menu Item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete menu item' });
  }
});


///
/// AddMenuItem.jsx
///

// @route   POST /api/menuitems/add-menu-item
// @desc    Create a new menu item
// @access  Public (no auth yet)
router.post('/add-menu-item', async (req, res) => {
  try {
    const { name, description, ingredients, allergens, menuIDs } = req.body;

    // Create new menu document from request body
    const newMenuItem = new MenuItem({
      name,
      description,
      ingredients,
      allergens,
      menuIDs
    });

    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (err) {
    res.status(400).json({ error: 'Error creating menu: ' + err.message });
  }
});

///
/// MenuItemSwap.jsx
///
// @route   GET /api/menuitems/menuswap-menus
// @desc    Get all menus for business id
// @access  Public (no auth yet)
router.get('/menuswap-menus', async (req, res) => {
  try {
    const { businessID } = req.query; 
    let filter = {};

    // only get menus belonging to the business
    if (businessID) {
      filter = { restaurant: businessID };  
    }

    const menus = await Menu.find(filter);

    // Always ensure Master Menu appears first
    menus.sort((a, b) => {
      if (a.title === 'Master Menu') return -1;
      if (b.title === 'Master Menu') return 1;
      return 0;
    });

    // Return the menus
    res.json(menus);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Could not fetch menus' });
  }
});

// @route   GET /api/menuitems/menuswap-items
// @desc    Get all menu items associated with Master Menu ID
// @access  Public (no auth yet)
router.get('/menuswap-items', async (req, res) => {
  try {
    const { menuID } = req.query; 
    let filter = {};

    // only get menuItemss on the menu
    if (menuID) {
      filter = { menuIDs: menuID };  
    }
	  // Get the menu items 
    const menuItems = await MenuItem.find(filter);

    res.status(200).json(menuItems || []);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Could not fetch menu items' });
  }
  });

// @route   PUT /api/menuitem/swap-menu
// @desc    Update the existing menuItems
// @access  Public (no auth yet)
router.put('/swap-menu/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, ingredients, allergens, menuIDs } = req.body;
    
        if (!id) {
            return res.status(400).json({ error: 'Menu item ID is required' });
        }
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            id,
            { name, description, ingredients, allergens, menuIDs },
            { new: true, runValidators: true }
        );
    
        if (!updatedMenuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
    
        res.status(200).json(updatedMenuItem);
    } catch (err) {
        res.status(500).json({ error: 'Error editing menu item: ' + err.message });
    }
});


module.exports = router;
