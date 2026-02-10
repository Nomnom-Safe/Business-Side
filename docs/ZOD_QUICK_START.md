# Quick Start Guide: Implementing Zod Schemas

## Installation

```bash
npm install zod
```

## File Organization

Copy the `schemas` folder into your `server/src/` directory:

```
server/
├── src/
│   ├── schemas/           ← New folder
│   │   ├── Restaurant.js
│   │   ├── Address.js
│   │   ├── Menu.js
│   │   ├── MenuItem.js
│   │   ├── BusinessUser.js
│   │   ├── Allergen.js
│   │   ├── allergenValidation.js
│   │   ├── index.js
│   │   └── README.md
│   ├── config/
│   ├── middleware/
│   ├── models/           ← Your existing Mongoose models
│   └── ...
```

## Implementation Steps

### 1. Import Schemas in Your Routes

```javascript
// In your route files
const { CreateMenuItemSchema, UpdateMenuItemSchema } = require('../schemas');
const { AllergenCache } = require('../schemas/allergenValidation');

// Initialize allergen cache once per application
const allergenCache = new AllergenCache(db);
```

### 2. Validate on Create

```javascript
// Example: Creating a menu item
router.post('/menu-items', async (req, res) => {
  try {
    // Validate with database allergen check
    const validatedData = await allergenCache.validateMenuItem(req.body);
    
    // Generate ID
    const id = generateMenuItemId(); // Your ID generator
    
    // Save to Firebase
    await setDoc(doc(db, 'menu_items', id), {
      id,
      ...validatedData
    });
    
    res.status(201).json({ id, ...validatedData });
  } catch (error) {
    if (error.message.includes('Validation failed')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});
```

### 3. Validate on Update

```javascript
// Example: Updating a restaurant
router.patch('/restaurants/:id', async (req, res) => {
  try {
    const { UpdateRestaurantSchema } = require('../schemas');
    
    // Validate update
    const validatedData = UpdateRestaurantSchema.parse({
      id: req.params.id,
      ...req.body
    });
    
    // Update in Firebase
    const docRef = doc(db, 'restaurants', req.params.id);
    await updateDoc(docRef, validatedData);
    
    res.json({ success: true, data: validatedData });
  } catch (error) {
    // Zod validation errors
    if (error.name === 'ZodError') {
      const errors = error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      return res.status(400).json({ errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});
```

### 4. User Registration Example

```javascript
const { CreateBusinessUserSchema } = require('../schemas');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  try {
    // Validate user data (includes password strength requirements)
    const validatedData = CreateBusinessUserSchema.parse(req.body);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Generate ID
    const id = generateBusinessUserId();
    
    // Save to Firebase
    await setDoc(doc(db, 'business_users', id), {
      id,
      ...validatedData,
      password: hashedPassword
    });
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: id 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      const errors = error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      return res.status(400).json({ errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});
```

## Key Differences from Mongoose

| Mongoose | Zod + Firebase |
|----------|----------------|
| Schema defines DB structure | Schema only validates data |
| `Model.create()` saves to DB | Validate, then manually save with Firebase SDK |
| Middleware (pre-save hooks) | Validate → Transform → Save manually |
| ObjectId references | String IDs |
| Built-in password hashing | Use bcrypt separately |

## Common Patterns

### Pattern 1: Safe Parse with Error Handling

```javascript
const result = RestaurantSchema.safeParse(data);

if (result.success) {
  // Use result.data
  await saveToFirebase(result.data);
} else {
  // Handle result.error
  console.error(result.error.issues);
}
```

### Pattern 2: Parse (throws on error)

```javascript
try {
  const validatedData = RestaurantSchema.parse(data);
  await saveToFirebase(validatedData);
} catch (error) {
  // Zod throws ZodError
  console.error(error);
}
```

### Pattern 3: Allergen Validation with Cache

```javascript
// Initialize once in your app
const allergenCache = new AllergenCache(db);

// Use in routes
const validMenuItem = await allergenCache.validateMenuItem(menuItemData);

// Clear cache when allergens are updated
allergenCache.clear();
```

## Testing Your Schemas

```javascript
const { RestaurantSchema } = require('./schemas');

// Test valid data
const validData = {
  id: 'rstr_a1b2c3d4e5f6',
  name: 'Test Restaurant',
  menu_id: 'menu_x1y2z3a4b5c6',
  address_id: 'add_m1n2o3p4q5r6',
  hours: ['Mon-Fri: 9am-5pm'],
  phone: '555-123-4567',
  website: 'https://test.com',
  disclaimers: ['May contain allergens'],
  cuisine: 'Italian'
};

const result = RestaurantSchema.safeParse(validData);
console.log(result.success); // true

// Test invalid data
const invalidData = { ...validData, phone: 'invalid' };
const result2 = RestaurantSchema.safeParse(invalidData);
console.log(result2.success); // false
console.log(result2.error.issues); // Shows validation errors
```

## Migration Checklist

- [ ] Install Zod: `npm install zod`
- [ ] Copy schemas folder to `server/src/schemas/`
- [ ] Update route handlers to use Create schemas
- [ ] Update PATCH/PUT routes to use Update schemas
- [ ] Initialize AllergenCache for menu item validation
- [ ] Test all validation with sample data
- [ ] Update error handling to work with Zod errors
- [ ] Remove old Mongoose models (optional, after migration complete)

## Next Steps

1. Start with one route (e.g., create menu item)
2. Test validation thoroughly
3. Gradually add validation to other routes
4. Monitor for validation errors in production
5. Refine schemas based on real-world usage

## Need Help?

- Check the `schemas/README.md` for detailed examples
- Review `allergenValidation.js` for allergen-specific patterns
- Each schema file has JSDoc comments explaining usage
