# Week 5: Front-End Refactoring Plan

**Sprint 1 – NomNomSafe Business-Side MVP**  
**Focus:** Refactor the front-end using SOLID principles and design patterns. Maintain and improve MVP functionality without compromising existing behavior. All work is confined to the client (`client/`); no backend changes.

---

## 1. Context

### 1.1 PPP and Sprint 1

- **Week 5 goal (PPP):** “Refactor MVP Features (Front-End)” — improve structure without changing behavior; validation and error handling become consistent; front-end code follows clean design principles.
- **Sprint 1 scope:** A functional business-user MVP, clear separation of MVP vs non-MVP, improved front-end structure and maintainability.

### 1.2 Week 4 Outcome

- **Feature isolation completed.** Non-MVP features (Admin/User Maintenance, Menu Item Swapping) are archived and inaccessible.
- **Active MVP surface:** Sign in / sign out; single menu management (view, create, delete); menu items CRUD; business CRUD; account CRUD (edit email/password); setup wizard / onboarding.

### 1.3 Scope Boundary: Front-End Only

| Category    | In scope for Week 5? |
|------------|----------------------|
| **Front-End** | Yes. All work is under `client/`: components, routing, route guards, API facade usage, client-side validation, error/confirmation UI, client state, code structure. |
| **Backend**   | No. No changes to `server/` routes, services, or server-side validation. |
| **Other**     | Only the client side of shared concerns (how the client calls the API, reads cookies, runs validation). |

---

## 2. Current State: Findings

| Area | Issue | SOLID / pattern impact |
|------|--------|------------------------|
| **API** | Base URL `http://localhost:5000` and raw `fetch`/`axios` in 10+ files | Violates SRP (components do HTTP + UI) and DIP (tied to concrete URLs/client). |
| **Validation** | Only `formValidation.js` (email, password); used in GetAuthForm and EditLoginInfo; AddMenuItem, SetUp, etc. use `alert()` and ad-hoc checks | Inconsistent; no single place to extend (violates O/C). |
| **Error/feedback** | GetAuthForm uses `ErrorMessage`; AddMenuItem, MenuItemsPage, SetUp use `alert()` | Inconsistent UX; feedback logic scattered (SRP). |
| **ProtectedRoute** | One component with many guard conditions in a single block | Hard to test and extend; adding a guard means editing the same block (O/C). |
| **AddMenuItem** | Large file; API + UI mixed; inline `CollapsiblePanel`; hardcoded allergen map (duplicate of server-backed `allergenCache.js`) | SRP violation; duplication; no single source of truth. |
| **EditBusinessInfo** | Fetches in component; partial validation; mixed concerns | Same as above. |

---

## 3. SOLID Principles: How We Apply Them

### 3.1 Single Responsibility (SRP)

- **API access:** One module (API facade) is responsible for all HTTP calls to the backend. Components are responsible for UI and user flow, not for constructing URLs or choosing HTTP client.
- **Validation:** One validation layer (extended `formValidation.js` or small validation module) is responsible for rules; forms consume it instead of implementing their own ad-hoc checks.
- **Route protection:** Guard logic is separated into small, single-purpose handlers; `ProtectedRoute` orchestrates the chain rather than encoding every condition inline.
- **AddMenuItem:** Split so that a dedicated panel component handles one panel’s UI/state, and the parent handles layout, panel list state, and “Save All” orchestration.

### 3.2 Open/Closed (O/C)

- **Validation:** New rules (e.g. URL format, min length) are added by introducing new strategies or rule functions, not by editing every form.
- **Route guards:** New or reordered checks are added by adding/reordering handlers in the chain, not by modifying a single large conditional in `ProtectedRoute`.

### 3.3 Liskov Substitution (LSP)

- Not emphasized in this refactor. We are not introducing inheritance hierarchies where substitutability of subtypes is critical. Any future abstractions (e.g. validation strategies) will be used in a way that preserves substitutability if we introduce multiple implementations.

### 3.4 Interface Segregation (ISP)

- **API facade:** Exposes domain-focused methods (auth, businesses, menus, menuItems, allergens) rather than a single “do everything” API. Callers depend only on the methods they use.

### 3.5 Dependency Inversion (DIP)

- **API:** Components depend on the API facade (abstraction), not on concrete `fetch`/`axios` or hardcoded URLs. The facade depends on a single config (e.g. base URL) and one HTTP implementation.
- **Validation:** Forms depend on a validation abstraction (e.g. a function or small set of validators); they do not depend on low-level regex or ad-hoc logic scattered in components.

---

## 4. Design Patterns We Employ

### 4.1 Facade

- **Intent:** Provide a simplified interface to a complex subsystem (here: backend HTTP and configuration).
- **Use:** Introduce a single API client under `client/src/api/` (e.g. `apiClient.js` or `apiFacade.js`) that:
  - Reads base URL from one config (e.g. env or `config.js`).
  - Exposes methods per domain: auth, businesses, menus, menuItems, allergens.
  - Uses one HTTP client (fetch or axios) internally.
- **Participants:** Facade = API client; subsystem = HTTP + backend routes; clients = React components.
- **Reference:** `Design Patterns/Facade.md`.

### 4.2 Strategy

- **Intent:** Define a family of algorithms (validation rules), encapsulate each one, and make them interchangeable.
- **Use:** Validation layer with pluggable rules (e.g. email, password, required, min length, URL). Forms pass field values to validators and get results; they do not hard-code rules. New rules are new strategies.
- **Participants:** Strategy = validation rule interface/function; ConcreteStrategies = email, password, required, etc.; Context = form or field that uses the selected strategy.
- **Reference:** `Design Patterns/Strategy.md`.

### 4.3 Chain of Responsibility

- **Intent:** Pass a request along a chain of handlers until one handles it.
- **Use:** In `ProtectedRoute.jsx`, replace the single block of conditionals with a chain of guard functions. Each handler receives (e.g.) route, cookies, and context; it either returns a redirect or passes to the next handler. Order: e.g. “not authorized → redirect to sign-in”, “route === chooseBusiness → allow”, “route === signInUp and authorized → redirect to dashboard”, “admin required and !isAdmin → redirect”, “setup + hasBusiness and !justSignedUp → redirect”, “!hasBusiness → redirect to choose-business”, “allow”.
- **Participants:** Handler = function that either redirects or calls next; ConcreteHandlers = each guard; Client = `ProtectedRoute` that builds and runs the chain.
- **Reference:** `Design Patterns/ChainOfResponsibility.md`.

---

## 5. Target Architecture (High Level)

```
┌─────────────────────────────────────────────────────────────────┐
│  UI: Page components, form components                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐  ┌───────────────┐  ┌─────────────────────┐
│  API Facade     │  │  Validation   │  │  Route guards        │
│  (client/src/   │  │  (strategies) │  │  (chain of           │
│   api/)         │  │               │  │   responsibility)     │
└────────┬────────┘  └───────────────┘  └──────────┬──────────┘
         │                                            │
         ▼                                            ▼
  Backend (unchanged)                        Cookies / auth state
```

- Components call the **API facade** for all server communication.
- Forms use the **validation** layer (strategy-based) and shared **ErrorMessage** / **ConfirmationMessage** for feedback.
- **ProtectedRoute** runs a **chain of guard** functions; same props and behavior, clearer structure.

---

## 6. Refactoring Tasks (Detailed)

### Task 1: API Facade (Facade + DIP)

1. Add `client/src/api/` with:
   - A small config (e.g. base URL from env or `config.js`).
   - A single module that exposes methods for: auth (signin, signup, logout, set-business, edit-login), businesses (get, create, update), menus (get, create, update, delete), menuItems (get by menu, get menu by business, add, update, delete), allergens (list).
2. Implement these methods using one HTTP client (fetch or axios) and the configured base URL.
3. Replace all direct `fetch('http://localhost:5000/...')` and `axios.*('http://localhost:5000/...')` in **MVP** components with calls to this facade. Leave archived components (UserMaintenance, AdminTable, MenuItemSwap) unchanged.
4. **MVP files to update:** `GetAuthForm.jsx`, `EditLoginInfo.jsx`, `ProfileIcon.jsx`, `EditBusinessInfo.jsx`, `MenuDashboard.jsx`, `MenuCard.jsx`, `MenuItemsPage.jsx`, `AddMenuItem.jsx`, `MenuItemPanel.jsx`, `SetUp.jsx`, `ChooseBusiness.jsx`, `allergenCache.js` (have it use the facade for the allergens endpoint).

**Outcome:** One place for base URL and HTTP behavior; components depend on the facade only.

---

### Task 2: Validation and User Feedback (Strategy + consistency)

1. Extend `client/src/utils/formValidation.js` (or add a thin validation module) to support:
   - Required / non-empty strings.
   - Optional: min length, URL format (e.g. for business website).
   - Keep existing email and password validators; expose them in a consistent way (strategy-style: one function per rule or a small schema).
2. Replace every `alert()` in MVP flows with `ErrorMessage` or `ConfirmationMessage` as appropriate. Affected areas: AddMenuItem (save / save all), MenuItemsPage (save / delete feedback), SetUp (business name conflict, update failure), and any other MVP path that currently uses `alert()`.
3. Where forms already use `formValidation` (GetAuthForm, EditLoginInfo), keep that; ensure any new or touched forms use the same validation layer and the shared error/confirmation components.

**Outcome:** Consistent validation and feedback across MVP; no alerts.

---

### Task 3: ProtectedRoute – Chain of Responsibility

1. Keep `ProtectedRoute.jsx` as the single entry: same props and usage in `App.jsx`.
2. Extract guard logic into a list of small functions (or a small chain). Each function:
   - Input: e.g. `{ route, admin, isAuthorized, isAdmin, hasBusiness, justSignedUp }`.
   - Output: either `{ redirect: path }` or `{ next: true }` (or equivalent).
3. In `ProtectedRoute`, run the chain in order; on first `redirect`, return `<Navigate to={path} />`; otherwise render the child component.
4. Preserve exact behavior: same redirects and same conditions as today.

**Outcome:** Same behavior; guards are testable and easy to reorder or extend.

---

### Task 4: AddMenuItem – SRP and Single Source for Allergens

1. Extract the collapsible panel into a separate component (e.g. under `components/menuItems/` or `components/common/`). The panel component receives: form data, callbacks for change and save, and menu id; it does not own the full panel list or “Save All”.
2. Use `allergenCache.js` (or the API facade’s allergen API) as the single source for allergen labels in the add-item flow. Remove the hardcoded allergen map from AddMenuItem; use the cache (or facade) for display and ID/label mapping.
3. Wire AddMenuItem and the new panel component to the API facade and to the shared validation and error/confirmation components. Keep “name required” and existing rules; surface errors via `ErrorMessage` / `ConfirmationMessage` instead of `alert()`.

**Outcome:** Smaller, focused components; one source of truth for allergens; consistent API and feedback.

---

### Task 5: Consistency Pass (Optional)

1. **EditBusinessInfo:** Use the API facade for GET/PUT business; use shared validation for required business name (if applicable); use ErrorMessage/ConfirmationMessage for failures/success.
2. **Other MVP forms (SetUp steps, ChooseBusiness):** Ensure they use the API facade and shared validation/error components where applicable, without changing flow or behavior.

**Outcome:** All MVP forms and pages aligned with facade, validation, and feedback patterns.

---

## 7. What Stays Unchanged

- **Behavior:** All user-visible MVP flows (sign in/up, choose business, setup, dashboard, menus, menu items, business, edit login) must behave the same.
- **Archived code:** No refactor of archived admin or MenuItemSwap components.
- **Styling and markup:** No intentional visual or accessibility regressions; only replace `alert()` with existing message components.
- **Backend:** No server-side changes.

---

## 8. Verification

- **Manual:** Run through each MVP flow (sign in, sign up, choose/create business, setup steps, create/edit/delete menu and items, edit business, edit login, sign out) and confirm behavior matches current app.
- **Automated:** Existing client tests (e.g. `App.test.js`, integration tests) should still pass; add or adjust tests only if they were tied to implementation details that were intentionally changed (e.g. API facade).

---

## 9. Suggested Order of Work

1. **API Facade** — Implement facade and config; migrate one module (e.g. auth) and verify; then migrate remaining MVP call sites.
2. **Validation + feedback** — Extend validation utils; replace `alert()` in MVP with ErrorMessage/ConfirmationMessage.
3. **ProtectedRoute** — Extract guard chain; keep same props and behavior; add unit tests for guards if desired.
4. **AddMenuItem** — Extract panel component; switch to allergen cache/facade; plug in facade and validation/error UI.
5. **Consistency pass** — EditBusinessInfo and remaining forms; final smoke test of all MVP flows.

This order keeps behavior stable at each step and avoids big-bang changes.
