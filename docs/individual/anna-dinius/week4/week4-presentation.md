---
marp: true
theme: default
paginate: true
title: 'Capstone Project — Week 4 Progress Report'
footer: 'Week 4 Progress Report — Anna Dinius'
---

# **Capstone Project**

## **Week 4 Progress Report**

### 2/2/2026 - 2/8/2026

> Commit range:  
> `ea536c131fec5af3a9ec602d849da213d0e70f24 → HEAD`

---

# **Summary**

This week focused on:

- Migrating server-side models & routes to **schema‑driven validation** (`zod`)
- Renaming domain concepts **restaurant → business**
- Adding **address** and **allergen** support
- Removing legacy model wrappers
- Updating client UI components & routes to match new contracts

---

# **Key Outcomes**

- Added typed **Zod schemas** for server validation
- Replaced legacy model objects with **schema‑driven services**
- Renamed `restaurant` → `business` across client/server
- Added:
  - Address routes & services
  - Allergen routes + client‑side `allergenCache`
  - Menu service improvements (`item_type`)
- Removed legacy **mongoose models** and old tests

---

# **New Files (Server)**

- `server/src/schemas/Address.js`
- `server/src/schemas/Allergen.js`
- `server/src/schemas/BusinessUser.js`
- `server/src/schemas/Menu.js`
- `server/src/schemas/MenuItem.js`
- `server/src/schemas/Business.js`
- `server/src/schemas/index.js`

---

# **New Files (Server Continued)**

- `server/src/routes/addressRoutes.js`
- `server/src/routes/allergenRoutes.js`
- `server/src/services/addressService.js`
- `server/src/services/menuService.js`
- `server/src/services/firestoreInit.js`
- `server/src/middleware/auth.js`

---

# **New Files (Client)**

- `client/src/utils/allergenCache.js`  
  → Client‑side allergen label cache

---

# **Major File Modifications (Server)**

- Updated many routes under `server/src/routes/*`  
  → Now use Zod schemas + refactored services
- Added `addressRoutes.js` and `allergenRoutes.js`
- Updated services:
  - `addressService.js`
  - `businessService.js`
  - `businessUserService.js`
  - `menuItemService.js`
  - `menuService.js`

---

# **Major File Modifications (Server Continued)**

- Added `firestoreInit.js`
- Removed entire `server/src/models/*` directory

---

# **Major File Modifications (Client)**

- Updated components to use **business** naming:
  - `EditBusinessInfo`
  - `ChooseBusiness`
  - `SetUp`
  - `Step1`

---

# **Major File Modifications (Client Continued)**

- Updated menu‑related components:
  - `MenuDashboard.jsx`
  - `MenuCard.jsx`
  - `MenuItemsPage.jsx`
  - `MenuItemSwap.jsx`
  - `MenuItemPanel.jsx`
- Updated routing in `client/src/App.jsx`
- Integrated `allergenCache` into menu UI

---

# **Tests**

### Removed

- Legacy tests under `server/src/routes/*.test.js`

### Needed next

- Unit tests for all `server/src/schemas/*`
- Unit tests for all `server/src/services/*`
- Integration tests for:
  - `allergenRoutes`
  - `client/src/utils/allergenCache.js`

---

# **Rationale**

### Why these changes?

- **Schema‑driven validation**  
  → Centralizes validation, removes duplication, improves testability

- **Naming consistency**  
  → `business` aligns domain language across client/server

- **Service‑oriented architecture**  
  → Removes legacy mongoose models, simplifies backend

- **Feature completeness**  
  → Address + allergen support improves UX and client functionality

---

# **Files Touched (Concise)**

### Added

- `server/src/schemas/*`
- `server/src/routes/addressRoutes.js`
- `server/src/routes/allergenRoutes.js`
- `server/src/services/addressService.js`
- `server/src/services/firestoreInit.js`
- `server/src/services/menuService.js`
- `client/src/utils/allergenCache.js`
- `server/src/middleware/auth.js`

---

# **Files Touched (Concise)**

### Modified

- Many under `client/src/components/*`
- `client/src/App.jsx`
- `server/src/routes/*`
- `server/src/services/*`
- `docs/file-structure.txt`
- `server/package.json`

### Removed

- `server/src/models/*`
- Legacy tests under `server/src/routes/*.test.js`

---

# **How to Run / Verify Locally**

> Monorepo structure enables single commands for installing dependencies and running the app

1. **Install dependencies**

   ```powershell
   npm install
   ```

2. **Run**

   ```powershell
   npm run dev
   ```

---

# Metrics

### Total Project Statistics

- LOC: 6,858
- Production LOC: 6,851
- Test LOC: 7
- File count: 82
- Test file count: 4

---

# Metrics

### 🔥 **Week 4 Burndown Rates**

- 1/1 Week 4 feature completed
  - 100% total
  - ~14% per day
- 8/8 Week 4 requirements completed
  - 100% total
  - ~14% per day

---

# Metrics (Continued)

### 🔥 **Sprint 1 Burndown Rates**

- 1/4 Sprint 1 total features completed
  - 25% total
  - 25% per week
  - ~3% per day
- 8/41 Sprint 1 total requirements completed
  - ~19% total
  - ~19% per week
  - ~3% per day
