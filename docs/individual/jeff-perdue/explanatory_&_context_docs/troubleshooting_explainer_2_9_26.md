# Troubleshooting Summary: February 9, 2026

This document outlines the issues encountered and fixes implemented during initial application testing and debugging. All fixes were related to schema validation mismatches between the frontend payloads, backend expectations, and actual Firestore document structure.

---

## Overview

The primary issue was that **Zod validation schemas were enforcing strict ID formats** (`bid_`, `bus_`, `add_`, `menu_` prefixes) that didn't match the actual Firestore auto-generated document IDs. Additionally, several schemas required fields that weren't available during initial user/business creation flows.

---

## Issue 1: Server Not Running / Missing Firebase Credentials

### Symptoms
- `ERR_CONNECTION_REFUSED` errors for all API calls (`/api/auth/signup`, `/api/auth/logout`, etc.)
- Server crashes on startup with: `Error: Cannot find module '../config/serviceAccountKey.json'`

### Root Cause
The backend server wasn't running, and when attempting to start it, Firebase Admin SDK couldn't find the service account key file.

### Fix
1. **Place Firebase service account key** in `server/src/config/serviceAccountKey.json`
   - Download from Firebase Console → Project Settings → Service accounts → Generate new private key
   - Ensure the file is named exactly `serviceAccountKey.json`
   - Keep it in `.gitignore` (should already be there)

2. **Start the server**:
   ```powershell
   npm run dev:server
   ```

### Files Affected
- `server/src/config/serviceAccountKey.json` (must exist, not in repo)

---

## Issue 2: User Signup Failing with 401 Error

### Symptoms
- Signup form returns `401 Unauthorized`
- Network response shows: `"Business ID must start with 'bid_' followed by 11 lowercase alphanumeric characters"`
- Payload includes `business_id: ""` (empty string)

### Root Cause
`CreateBusinessUserSchema` required `business_id` to match `/^bid_[a-z0-9]{11}$/`, but new users don't have a business yet, so the frontend sends an empty string.

### Fix
Made `business_id` optional in `CreateBusinessUserSchema` to allow empty strings or missing values at signup time.

**File:** `server/src/schemas/BusinessUser.js`

**Change:**
```javascript
const CreateBusinessUserSchema = BusinessUserSchema.omit({ id: true })
	.extend({
		password: z.string()...,
		business_id: z
			.union([
				z.string().regex(/^bid_[a-z0-9]{11}$/, "..."),
				z.literal(''),
			])
			.optional()
			.default(''),
	});
```

### Files Affected
- `server/src/schemas/BusinessUser.js`

---

## Issue 3: Business Creation Failing with 400 Error

### Symptoms
- Creating a business returns `400 Bad Request`
- Zod validation errors for required fields: `address_id`, `hours`, `phone`, `website`, `disclaimers`, `cuisine`

### Root Cause
`CreateBusinessSchema` required all fields from `BusinessSchema`, but the frontend only sends minimal data (`name`, `website`, `address`, `allergens`, `diets`) during initial creation.

### Fix
Made most fields optional in `CreateBusinessSchema` with sensible defaults, matching the MVP flow where details are filled in during onboarding.

**File:** `server/src/schemas/Business.js`

**Change:** Extended `CreateBusinessSchema` to make `address_id`, `hours`, `phone`, `website`, `disclaimers`, `cuisine` optional with defaults, and added `allergens` and `diets` fields.

### Files Affected
- `server/src/schemas/Business.js`

---

## Issue 4: Firestore Rejecting `undefined` Values

### Symptoms
- Business creation fails with: `"Cannot use \"undefined\" as a Firestore value (found in field \"address_id\")"`

### Root Cause
The route handler sets `address_id: undefined` when both `address_id` and `address` are missing, but Firestore doesn't allow `undefined` values in documents.

### Fix
Added code to remove `undefined` fields before saving to Firestore, matching the pattern already used in `updateBusiness`.

**File:** `server/src/services/businessService.js`

**Change:**
```javascript
async function createBusiness(businessObj) {
	const valid = CreateBusinessSchema.parse(businessObj);
	valid.menu_id = null;
	
	// Remove undefined fields so Firestore doesn't reject them
	Object.keys(valid).forEach(
		(key) => valid[key] === undefined && delete valid[key],
	);
	
	const ref = await businessesCollection.add(valid);
	// ...
}
```

### Files Affected
- `server/src/services/businessService.js`

---

## Issue 5: Frontend Double-Reading Response Body

### Symptoms
- Console error: `"Failed to execute 'json' on 'Response': body stream already read"`
- Error occurs at `ChooseBusiness.jsx:180`

### Root Cause
The code called `createBusinessResponse.json()` twice:
1. Line 118: `const result = await createBusinessResponse.json();`
2. Line 125: `const createdBusiness = await createBusinessResponse.json();` ❌

Response streams can only be read once.

### Fix
Removed the second `.json()` call and reused the already-parsed `result` variable.

**File:** `client/src/components/setup/ChooseBusiness/ChooseBusiness.jsx`

**Change:**
```javascript
const result = await createBusinessResponse.json();
if (!createBusinessResponse.ok) {
    // handle error...
    return;
}

const businessId = result.id; // ✅ Use result directly
localStorage.setItem('businessId', businessId);
// Remove the duplicate: const createdBusiness = await createBusinessResponse.json();
```

### Files Affected
- `client/src/components/setup/ChooseBusiness/ChooseBusiness.jsx`

---

## Issue 6: Menu Creation Route Not Found (404)

### Symptoms
- `404 Not Found` error for `POST /api/menus`
- Error message: `{"error":"Route not found"}`

### Root Cause
The `POST /api/menus` route was commented out as a "Non-MVP Feature" in `menuRoutes.js`, but the frontend was still trying to call it.

### Fix
Removed the redundant menu creation call from the frontend. The backend already creates a menu automatically when a business is created (see `businessRoutes.js` lines 128-133).

**File:** `client/src/components/setup/ChooseBusiness/ChooseBusiness.jsx`

**Change:** Removed the entire menu creation fetch block (lines 129-152) since the backend handles it automatically.

### Files Affected
- `client/src/components/setup/ChooseBusiness/ChooseBusiness.jsx`

---

## Issue 7: Set-Business Endpoint Parameter Mismatch

### Symptoms
- `400 Bad Request` with message: `"A business is required"`
- Error occurs when calling `POST /api/auth/set-business`

### Root Cause
Backend expects `businessId` (camelCase) but frontend was sending `business_id` (snake_case).

**Backend code:**
```javascript
const { type, businessId } = req.body;
if (!businessId) { // ❌ undefined because frontend sent business_id
    return res.status(400).json({ error: 'A business is required' });
}
```

### Fix
Changed frontend to send `businessId` to match backend expectation.

**File:** `client/src/components/setup/ChooseBusiness/ChooseBusiness.jsx`

**Change:**
```javascript
body: JSON.stringify({
    type: 'new',
    businessId: businessId, // ✅ Changed from business_id
}),
```

### Files Affected
- `client/src/components/setup/ChooseBusiness/ChooseBusiness.jsx`

---

## Issue 8: User Update Failing - Strict ID Validation

### Symptoms
- `401 Unauthorized` with message: `"Could not add user to the business"`
- Error occurs when calling `POST /api/auth/set-business` after fixing Issue 7

### Root Cause
`UpdateBusinessUserSchema` required:
- `id` to match `/^bus_[a-z0-9]{11}$/`
- `business_id` to match `/^bid_[a-z0-9]{11}$/`

But Firestore auto-generates IDs like `"PWpBKs6qbHN01ESvAK1s"` (not matching the regex), so Zod validation failed silently in the catch block.

### Fix
Relaxed `UpdateBusinessUserSchema` to accept any non-empty string for IDs (Firestore auto-IDs).

**File:** `server/src/schemas/BusinessUser.js`

**Change:**
```javascript
const UpdateBusinessUserSchema = BusinessUserSchema.partial()
	.extend({
		id: z.string().min(1, 'User ID is required'), // ✅ Accepts any string
	})
	.extend({
		business_id: z.string().min(1, 'Business ID is required').optional(), // ✅ Accepts any string
	});
```

### Files Affected
- `server/src/schemas/BusinessUser.js`

---

## Issue 9: Step 3 Business Update Failing

### Symptoms
- `400 Bad Request` when completing Step 3 of onboarding
- Error: `"Error updating business: [\n {\n \"origin\": \"string\",\n }"`
- PUT request to `/api/businesses/:id` fails

### Root Cause
`UpdateBusinessSchema` required:
- `id` to match `/^bid_[a-z0-9]{11}$/` (but Firestore IDs don't match)
- `address_id` to match `/^add_[a-z0-9]{11}$/` (but frontend sends plain address strings like `"123 Main St"`)
- Other fields had strict requirements that didn't match actual data

### Fix
Relaxed `UpdateBusinessSchema` to accept Firestore IDs and plain strings for address fields.

**File:** `server/src/schemas/Business.js`

**Change:** Extended `UpdateBusinessSchema` to:
- Accept any non-empty string for `id` (Firestore auto-IDs)
- Accept plain strings or empty values for `address_id` (not just `add_` format)
- Make other fields optional with lenient validation

```javascript
const UpdateBusinessSchema = BusinessSchema.partial()
	.extend({
		id: z.string().min(1, 'Business ID is required'), // ✅ Accepts Firestore IDs
	})
	.extend({
		address_id: z.union([
			z.string().regex(/^add_[a-z0-9]{11}$/),
			z.string().min(1), // ✅ Accepts plain address strings
			z.literal(''),
		]).optional().nullable(),
		// ... other fields made optional/lenient
	});
```

### Files Affected
- `server/src/schemas/Business.js`

---

## Summary of Schema Philosophy Changes

### Before
- Schemas enforced strict ID formats (`bid_`, `bus_`, `add_`, `menu_` prefixes)
- Many fields were required even during initial creation
- Schemas didn't account for Firestore's auto-generated IDs

### After
- **Create schemas**: Fields are optional with defaults, allowing minimal data during initial creation
- **Update schemas**: Accept Firestore auto-IDs (any non-empty string) and plain strings for address fields
- **Validation**: Still validates data types and formats, but doesn't enforce ID prefixes that don't match reality

### Key Principle
**Schemas should validate what the application actually produces**, not enforce theoretical formats that don't match the database implementation.

---

## Testing Checklist

After implementing these fixes, verify:

- [ ] Server starts without errors
- [ ] User can sign up successfully
- [ ] User can create a new business from "Choose Business" page
- [ ] User can complete Step 1 (basic info)
- [ ] User can complete Step 2 (allergens/diets)
- [ ] User can complete Step 3 (menu layout) and reach dashboard
- [ ] No console errors during the flow
- [ ] Business data persists correctly in Firestore

---

## Files Modified

### Backend
1. `server/src/schemas/BusinessUser.js` - Made `business_id` optional in create, relaxed ID validation in update
2. `server/src/schemas/Business.js` - Made fields optional in create, relaxed ID/address validation in update
3. `server/src/services/businessService.js` - Added undefined field removal in `createBusiness`

### Frontend
1. `client/src/components/setup/ChooseBusiness/ChooseBusiness.jsx` - Fixed response parsing, removed redundant menu creation, fixed parameter name

---

## Notes for Future Development

1. **ID Format Consistency**: Consider either:
   - Using Firestore auto-IDs everywhere and updating schemas accordingly, OR
   - Implementing a custom ID generator that creates `bid_`, `bus_`, etc. format IDs consistently

2. **Schema Validation**: When adding new fields or endpoints, ensure schemas match:
   - What the frontend actually sends
   - What Firestore actually stores
   - What the application logic expects

3. **Error Handling**: Consider adding more detailed error logging in catch blocks to surface Zod validation errors more clearly during development.

---

## Related Documentation

- See `archiving_explainer.md` for information about non-MVP features that were archived
- See `docs/modules/BackendModule.md` for backend architecture details
- See `docs/modules/AuthenticationModule.md` for auth flow details
