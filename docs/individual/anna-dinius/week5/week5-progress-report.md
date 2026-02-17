# Individual Project

## Week 5 Progress Report

> Commit range:
>
> - 52c90c810d78b6bb2a90d51da8701d78c1c4b51c → f543c57962c212b3283e17db2e07f0ef0eedd01f
>
> See `project-statistics-detailed.md` for LoC and other project statistics.

### Summary

This week focused on stabilizing server route error handling, expanding controller coverage for business and menu-related resources, implementing async handling for routes, and improving client-side menu/allergen/address UX. Notable work included adding controllers for `menu`, `menuItem`, `address`, and `business` resources, introducing `errorHandler` middleware and auth/business membership services, implementing `asyncHandler` util, and several client updates to support `item_type`, address components, and tighter integration with the `allergenCache` util.

Key outcomes:

- Completed route stabilization and centralized error handling with `errorHandler`.
- Added controllers and related service/schema validation wiring.
- Continued improving client forms and components by extracting common `AddressFields`, adding `item_type` support, and wiring `allergenCache` into item-add/edit flows.
- Implemented route-level async handling and renamed `userRoutes.js` → `businessUserRoutes.js` to match domain language.

### New files

- `server/src/controllers/menuController.js` — controller for menu endpoints (create/update/archive flows consolidated).
- `server/src/controllers/menuItemController.js` — controller for menu item endpoints; enforces `menu_id` requirement and schema validation.
- `server/src/controllers/addressController.js` — address endpoint controller wired to `AddressSchema` validation.
- `server/src/controllers/businessController.js` — business-level controller and helper functions.
- `server/src/controllers/businessUserController.js` — controller for business user actions.
- `server/src/middleware/errorHandler.js` — centralized Express error handler used by `server.js`.
- `server/src/services/authService.js` — auth-oriented service utilities.
- `server/src/services/businessMembershipService.js` — business membership helper service.
- `server/src/utils/getIdToken.js` — helper to extract and validate ID tokens from requests.
- `client/src/components/common/AddressFields.jsx` — extracted address fields component reused by `EditBusinessInfo` and setup steps.

### File modifications (major changes)

Note: file paths are relative to the repository root.

- `server/src/routes/*` — applied `asyncHandler` across routes; renamed and reorganized `userRoutes` → `businessUserRoutes` and enforced SRP for route files.
- `server/src/services/*` — added/updated `authService`, `businessMembershipService`, `responseHelpers`, and continued schema-driven validation in `addressService`, `menuService`, and `menuItemService`.
- `server/src/schemas/*` — removed overly strict id-format validations to reduce friction when accepting new documents; exported auth schemas via `schemas/index.js`.
- `server/server.js` — wired `errorHandler` middleware and updated route imports to match renamed files.
- `client/src/components/*` — extracted `AddressFields` into a shared component and applied it to `EditBusinessInfo` and setup `Step1`; updated `AddMenuItem` and `AllergenList` to use `allergenCache` and added client-side `item_type` support; made `menu_item` description optional.
- `docs/file-structure.txt` — updated to reflect reorganization and new controllers/services.

### Tests

- Continued to apply `asyncHandler` to routes; tests that relied on the old synchronous behavior will need updating.
- Suggested tests to add/update:
  - Unit tests for new controllers (`menuController`, `menuItemController`, `addressController`, `businessController`) validating success and error responses using a Firestore emulator or mocks.
  - Integration tests to ensure `errorHandler` correctly formats and returns errors across the route surface.
  - Client tests for `AddressFields` extraction, `item_type` rendering, and `allergenCache` integration in menu item components.

### Why these changes were made (rationale)

- Centralized error handling: Adding `errorHandler` simplifies consistent error formatting across routes and makes controller code clearer.
- Clearer controller/service separation: Introducing focused controllers for `menu`, `menuItem`, `address`, and `business` consolidates request handling and keeps services responsible for persistence/validation.
- UX improvements: Extracting `AddressFields` and wiring `allergenCache` reduces duplication and improves performance and maintainability of the client UI.
- Data validation pragmatism: Removing overly strict id formats from schemas reduces friction when interacting with existing Firestore documents and during migrations.

### Files touched (concise list)

- Added:
  - `server/src/controllers/menuController.js`
  - `server/src/controllers/menuItemController.js`
  - `server/src/controllers/addressController.js`
  - `server/src/controllers/businessController.js`
  - `server/src/controllers/businessUserController.js`
  - `server/src/middleware/errorHandler.js`
  - `server/src/services/authService.js`
  - `server/src/services/businessMembershipService.js`
  - `server/src/utils/getIdToken.js`
  - `client/src/components/common/AddressFields.jsx`

- Modified:
  - `server/src/routes/*` (applied `asyncHandler`, renamed `userRoutes.js` → `businessUserRoutes.js`)
  - `server/src/services/*` (added responseHelpers, updated validation usage)
  - `server/src/schemas/index.js` (exported auth schemas)
  - `server/server.js` (use `errorHandler` and updated route references)
  - `client/src/components/*` (address extraction, `item_type` support, allergenCache integration)
  - `docs/file-structure.txt`

- Removed/Archived:
  - Archived non-MVP multi-menu features in `MenuItemPanel` and archived a small admin var in `ProfileIcon` to reduce UI complexity for this sprint.

### How to run / verify locally

1. Install dependencies (from repo root):

```powershell
npm install
```

2. Start the app:

```powershell
npm run dev
```

3. Manual verification checklist:

- Visit the app and exercise menu creation/edit flows; ensure `item_type` shows where expected.
- Walk through the business setup screens (`EditBusinessInfo`, setup steps) and verify the shared `AddressFields` component displays and validates correctly.
- Call server endpoints (e.g., `/api/menus`, `/api/menuItems`, `/api/addresses`) and verify they return expected shape and that errors are formatted consistently by `errorHandler`.

4. Notes on tests and CI:

- Update tests that assumed strict id formats or the old sync route behavior; the `asyncHandler` and schema relaxations change the expected error shapes and validation failure messages.

### Notes, caveats and next steps

- Update tests to use the new controllers and error formatting; consider adding Firestore emulator-based integration tests.
- Add unit tests for `businessMembershipService` and auth-related flows.
- Performance: Consider memoizing `allergenCache` lookups further on client-side if heavy render paths still use linear scans.

### Completion summary

This commit range improved server robustness (centralized error handling, controllers/services expansions), implemented route async handling, and continued client UX improvements (address extraction and allergen integration). The repository is more consistent in its error handling and request validation surface; next steps focus on tests and migration compatibility.

### Metrics

🔥 **Burndown Rates**

- 6/6 Week 5 requirements completed
  - 100% total
  - ~14% per day
- 1.5/4 Sprint 1 total features completed
  - 37.5% total
  - ~19% per week
  - ~2.7% per day
- 14/41 Sprint 1 total requirements completed
  - ~34% total
  - ~17% per week
  - ~2.4% per day
