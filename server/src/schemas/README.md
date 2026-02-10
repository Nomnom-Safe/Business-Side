# Zod Schemas for Firebase Collections

This directory contains Zod validation schemas for all Firebase collections in the Business-Side application.

## Installation

```bash
npm install zod
```

## Schema Files

- **Restaurant.js** - Restaurant/business validation
- **Address.js** - US address validation
- **Menu.js** - Menu validation
- **MenuItem.js** - Menu item validation with allergen support
- **BusinessUser.js** - Business user/authentication validation
- **Allergen.js** - Allergen validation
- **index.js** - Central export for all schemas

## Usage Examples

### Basic Validation

```javascript
const { RestaurantSchema } = require('./schemas');

// Validate data
const result = RestaurantSchema.safeParse(restaurantData);

if (result.success) {
  console.log('Valid data:', result.data);
} else {
  console.error('Validation errors:', result.error.issues);
}
```

### Creating New Documents

```javascript
const { CreateRestaurantSchema } = require('./schemas');
const { doc, setDoc } = require('firebase/firestore');

async function createRestaurant(restaurantData) {
  // Validate without ID
  const validatedData = CreateRestaurantSchema.parse(restaurantData);
  
  // Generate ID
  const id = generateRestaurantId(); // Your ID generator
  
  // Save to Firebase
  await setDoc(doc(db, 'restaurants', id), {
    id,
    ...validatedData
  });
  
  return id;
}
```

### Validating Menu Items with Database Allergens

```javascript
const { createMenuItemSchemaWithAllergens } = require('./schemas');
const { collection, getDocs } = require('firebase/firestore');

async function validateMenuItem(menuItemData) {
  // Fetch allergens from Firebase
  const allergensSnapshot = await getDocs(collection(db, 'allergens'));
  const validAllergenIds = allergensSnapshot.docs.map(doc => doc.id);
  
  // Create schema with valid allergen IDs
  const MenuItemSchemaWithAllergens = createMenuItemSchemaWithAllergens(validAllergenIds);
  
  // Validate menu item
  const result = MenuItemSchemaWithAllergens.safeParse(menuItemData);
  
  if (!result.success) {
    throw new Error(result.error.issues.map(i => i.message).join(', '));
  }
  
  return result.data;
}
```

### User Registration with Password Validation

```javascript
const { CreateBusinessUserSchema } = require('./schemas');
const bcrypt = require('bcrypt');

async function registerUser(userData) {
  // Validate user data (includes strong password requirements)
  const validatedData = CreateBusinessUserSchema.parse(userData);
  
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
  
  return id;
}
```

### Updating Documents

```javascript
const { UpdateRestaurantSchema } = require('./schemas');

async function updateRestaurant(id, updates) {
  // Validate update data
  const validatedData = UpdateRestaurantSchema.parse({ id, ...updates });
  
  // Update in Firebase
  await updateDoc(doc(db, 'restaurants', id), validatedData);
}
```

### Error Handling

```javascript
const { MenuItemSchema } = require('./schemas');

const result = MenuItemSchema.safeParse(data);

if (!result.success) {
  // Format errors for API response
  const errors = result.error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message
  }));
  
  return res.status(400).json({ errors });
}
```

## Schema Types

Each schema has three variants:

1. **Base Schema** - Full validation including ID
   - Use when reading from database or validating complete documents
   
2. **Create Schema** - Excludes ID field
   - Use when creating new documents before ID generation
   
3. **Update Schema** - All fields optional except ID
   - Use when partially updating existing documents

## ID Format Patterns

All IDs follow a specific pattern:

- Restaurants: `rstr_` + 12 lowercase alphanumeric characters
- Addresses: `add_` + 12 lowercase alphanumeric characters
- Menus: `menu_` + 12 lowercase alphanumeric characters
- Menu Items: `item_` + 12 lowercase alphanumeric characters
- Business Users: `bus_` + 12 lowercase alphanumeric characters
- Allergens: `all_` + 12 lowercase alphanumeric characters

Example: `rstr_a1b2c3d4e5f6`

## Best Practices

1. **Always validate before saving to Firebase** - Catch errors early
2. **Use safeParse() for user input** - Prevents throwing errors
3. **Use parse() for internal operations** - Throws errors for better stack traces
4. **Validate allergen IDs dynamically** - Fetch from database before validation
5. **Hash passwords after validation** - Keep raw passwords out of database
6. **Use Create schemas for new documents** - Ensures ID is generated properly
7. **Use Update schemas for partial updates** - Allows optional fields

## Constants

### US States
Available from `Address.js`:
```javascript
const { US_STATES } = require('./schemas');
console.log(US_STATES); // ['AL', 'AK', 'AZ', ...]
```

### Item Types
Available from `MenuItem.js`:
```javascript
const { ITEM_TYPES } = require('./schemas');
console.log(ITEM_TYPES); // ['entree', 'dessert', 'drink', 'side', 'appetizer']
```

## Common Validation Rules

- **Phone numbers**: Must be format `###-###-####`
- **Zip codes**: Must be format `#####` or `#####-####`
- **Email**: Must be valid email format
- **URLs**: Must be valid URL or string "None"
- **Passwords** (on creation): 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Menu item descriptions**: Maximum 10 words

## Migration from Mongoose

If migrating from Mongoose models:

1. Your existing validation logic is preserved in these schemas
2. Password hashing still uses bcrypt (same as before)
3. References (ObjectId) are now strings (Firebase document IDs)
4. Schemas validate data but don't interact with the database directly

## Notes

- Allergens are fetched from the database, not hardcoded
- All addresses must be valid US addresses
- Each restaurant has exactly one menu and one address
- Allergen IDs on menu items can be empty arrays or contain multiple IDs
