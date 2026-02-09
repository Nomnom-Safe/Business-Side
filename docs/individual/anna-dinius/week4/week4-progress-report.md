# Individual Project

## Week 4 Progress Report

> (commit range starting ea536c131fec5af3a9ec602d849da213d0e70f24 → HEAD)

### Summary

This week focused on migrating server-side models and routes toward a schema-driven approach (using `zod`), renaming domain concepts from "restaurant" to "business" for consistency, wiring address and allergen support, and removing legacy model wrappers. On the client side, UI components and routes were updated to match the renamed entities and new server contracts; on the server side, routes were reorganized and services and new schemas were added.

Key outcomes:

- Added typed schemas for server-side validation and replaced many legacy model objects with schema-driven services.
- Renamed occurrences of "restaurant" → "business" across client/server and adjusted field names (e.g., `businessID` → `businessId`).
- Introduced address routes and services, allergen routes + client-side `allergenCache`, and menu-related service improvements (including `item_type` support).
- Removed legacy mongoose `models/` directory and legacy tests.

### New files

- `server/src/schemas/Address.js` — `zod` schema for addresses used to validate address payloads.
- `server/src/schemas/Allergen.js` — `zod` schema for allergens.
- `server/src/schemas/BusinessUser.js` — user schema for business-related users.
- `server/src/schemas/Menu.js` — schema for `Menu` documents.
- `server/src/schemas/MenuItem.js` — schema for `MenuItem` documents (includes new `item_type`).
- `server/src/schemas/Business.js` — schema for `Business` documents.
- `server/src/schemas/index.js` — schema exports and central index.
- `server/src/routes/addressRoutes.js` — new express routes for address endpoints.
- `server/src/services/addressService.js` — service implementing address persistence/queries.
- `server/src/services/menuService.js` — added/updated server-side menu service (query helpers used by routes).
- `server/src/services/firestoreInit.js` — Firestore client initialization helper.
- `client/src/utils/allergenCache.js` — client-side cache and helper for allergen labels.
- `server/src/routes/allergenRoutes.js` — routes exposing allergen data used by the client.
- `server/src/middleware/auth.js` — new auth middleware used by server routes.

### File modifications (major changes)

Note: file paths are relative to the repository root.

- `server/package.json` — added `zod` dependency and updated server package metadata.

- `server/src/routes/*.js` (many files modified)
  - `adminRoutes.js`, `businessRoutes.js`, `menuItemRoutes.js`, `menuRoutes.js`, `userRoutes.js` updated to use `zod` schemas for request validation and to adapt to service refactors.
  - `addressRoutes.js` added for address CRUD endpoints.
  - `allergenRoutes.js` added to serve allergen lists to the client (and used by `client/src/utils/allergenCache.js`).

- `server/src/services/*`
  - Support for the new schema validation:
    - `addressService.js`
    - `businessService.js`
    - `businessUserService.js`
    - `menuItemService.js`
    - `menuService.js`
  - `firestoreInit.js` - added to standardize Firestore initialization across services.

- `server/src/models/*` removed
  - The legacy mongoose `models/` directory (including `Business.js`, `Menu.js`, `MenuItem.js`, `User.js` and their tests) was deleted as the codebase moved to `zod` schemas + services.

- Client-side changes (selected highlights)
  - `client/src/components/*` updated to use `business` naming and new route/prop contracts: `EditBusinessInfo` moved from `restaurant` to `business` path; `ChooseBusiness`, `SetUp`, and `Step1` adjusted for renamed props.
  - `MenuDashboard.jsx`, `MenuCard.jsx`, `MenuItemsPage.jsx`, `MenuItemSwap.jsx`, and `MenuItemPanel.jsx` updated — a number of UI/route references were updated.
  - `client/src/App.jsx` and `client/src/components/auth/GetAuthForm/GetAuthForm.jsx` updated to reflect route and naming changes.
  - `client/src/utils/allergenCache.js` was added and integrated with `MenuDashboard` and menu item components to show allergen labels rather than raw IDs.

- Misc
  - `docs/file-structure.txt` updated to reflect directory reorganizations.

### Tests

- Removed legacy test files under `server/src/routes/*` that relied on the old `models/` layout (deleted during the model-to-schema migration).
- Existing integration test harnesses will need to be updated to use the new `zod` schemas and `services/*` entry points; no new unit tests were added for the newly created schemas/services in this range.

Suggested next tests:

- Unit tests for each `server/src/schemas/*` ensuring expected validation behavior for both valid and invalid payloads.
- Unit tests for `server/src/services/*` (addressService, menuService, menuItemService, etc.) using a test Firestore emulator or `fake-cloud-firestore` mocks.
- Integration tests for `allergenRoutes` + `client/src/utils/allergenCache.js` to confirm label mapping behavior.

### Why these changes were made (rationale)

- Move to schema-driven validation: Converting to `zod` schemas centralizes validation and simplifies the server-side data contracts. This reduces duplicate model code and makes validation explicit and testable.
- Naming consistency: Replacing `restaurant` with `business` clarifies domain language and aligns client and server naming conventions and Firestore collection fields.
- Simplify services and remove legacy code: The `models/` wrappers were removed to avoid clutter from legacy code; `services/*` + `firestoreInit.js` provide clearer separation of responsibilities.
- Surface allergen/address features: Adding `allergenRoutes`, `allergenCache`, and `addressRoutes` built out missing domain features required by the client and improved UX for menu/allergen displays.

### Files touched (concise list)

- Added:
  - `server/src/schemas/*`
  - `server/src/routes/addressRoutes.js`
  - `server/src/services/addressService.js`
  - `server/src/services/firestoreInit.js`
  - `server/src/services/menuService.js`
  - `server/src/routes/allergenRoutes.js`
  - `client/src/utils/allergenCache.js`
  - `server/src/middleware/auth.js`.
- Modified:
  - many files under `client/src/components/*`
  - `client/src/App.jsx`
  - `server/src/routes/*`
  - `server/src/services/*`
  - `docs/file-structure.txt`
  - `server/package.json`.
- Removed:
  - `server/src/models/*`
  - all legacy tests under `server/src/routes/*.test.js`.

### How to run / verify locally

> Monorepo setup allows server-side & client-side dependencies to be installed with a single command from the repo root.

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Start the app:

   ```powershell
   npm run dev
   ```

3. Manual verification checklist:
   - Visit the app and confirm login flows still work.
   - Go through the setup flows (`ChooseBusiness`, `SetUp`, `Step1`) to ensure `business` renames don't break navigation.
   - Open Menu pages and check that allergen labels are shown (via `allergenCache`) and that menu items reflect `item_type` where applicable.
   - Call server endpoints (e.g., `/api/addresses`, `/api/allergens`) to confirm they respond and validate with `zod`.

4. Notes on tests and CI:
   - Because models were removed and schemas introduced, existing tests that import the old `models/*` will fail until updated. Update test fixtures to the new schema-driven payload shapes.

### Notes, caveats and next steps

- Update tests: migrate or rewrite unit/integration tests to use the `zod` schemas and service-level interfaces.
- Migrate DB fields carefully: the renaming of collection/field names (e.g., `business_id` → `businessId`) requires either a migration plan or server-side compatibility handling if older documents exist in Firestore.
- Performance: repeated allergen lookups on the client should use a prebuilt map for O(1) lookup rather than `Array.prototype.find` on every render.

### Completion summary

This commit range completed a focused migration from model objects to `zod` schemas and service-oriented server code, consistent renaming from `restaurant` → `business`, and added address/allergen support needed by the client. The repo is in a cleaner state with clearer server-side validation; next steps are test updates, performance tuning for client-side allergen lookups, and debugging.
