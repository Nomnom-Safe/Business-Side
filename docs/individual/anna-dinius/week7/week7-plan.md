# NomNom Safe – Feature 4 (Responsive Design) Plan

> Generated with Perplexity AI

## 0. Updated scope (5–10 min)

- Explicitly exclude:
  - Admin components and any archived admin files.
  - Setup/onboarding pages (`components/setup/**`).
- Primary targets:
  - Shell: `PageLayout`, `Header`, `ToastContainer`, `App`.
  - Navigation: breadcrumb `Nav` at top of pages.
  - MVP flows: `account`, `business`, `menu`, `menuItems`, `common` components (forms, modals, cards, pickers).
- Write this scope in sprint notes to avoid scope creep.

---

## 1. Global responsive foundation (45–60 min)

- In `global.scss`:
  - Define 3 breakpoints:
    - Mobile: `≤ 640px`
    - Tablet: `641–1024px`
    - Desktop: `> 1024px`  
      with SCSS mixins for consistent usage.
  - Set global responsive typography: headings and body text scale via media queries instead of per-component hard-coded sizes.
  - Ensure images/icons resize correctly:
    - `img, svg { max-width: 100%; height: auto; }`.
  - Add layout utilities: e.g. `.page-container`, `.content` with fluid widths (`width: 100%`, `max-width`, responsive padding, `box-sizing: border-box`).
  - Prevent app-wide horizontal scrolling by fixing individual offenders rather than relying solely on `overflow-x: hidden`.

**Goal:** All pages inherit a reasonable responsive baseline before touching individual components.

---

## 2. Shell and breadcrumb navigation (60–75 min)

Focus on the outer frame and breadcrumb-style navigation.

- `PageLayout` + `PageLayout.scss`:
  - Make the main content column fluid with `max-width` and responsive padding.
  - Use flex or grid so any side-by-side regions stack vertically on mobile and sit side-by-side on tablet/desktop.

- `Header` + `Header.scss`:
  - Ensure logo/title and any actions:
    - Stack vertically on small screens.
    - Align horizontally on larger screens.

- Breadcrumb `Nav` + `Nav.scss`:
  - Ensure breadcrumb text wraps instead of causing horizontal overflow on narrow screens.
  - Adjust font size and spacing for small viewports.
  - Ensure clickable areas have adequate padding and visible focus outlines for accessibility.

- `ToastContainer` / `Toast.scss`:
  - Position toasts so they do not cover critical content on mobile.
  - Make toast width responsive (e.g., `max-width: 90%` on small screens).

**Goal:** The frame and breadcrumbs are readable and navigable on phone, tablet, and desktop.

---

## 3. Shared “common” components (75–90 min)

Prioritize shared components in `common` for maximum impact:

- Targets:
  - `FormField`, `PasswordFormField`, `AddressFields`
  - `AllergenPicker`
  - `Modal`, `ManageCategoriesModal`
  - `ConfirmationMessage`, `ErrorMessage`
  - `SaveButton`, `LoadingSpinner`, `Toast`

### Forms (FormField, PasswordFormField, AddressFields)

- On mobile: stack label and input vertically.
- At tablet+ widths: use flex/grid for multi-column forms where appropriate.
- Replace fixed widths (e.g. `width: 400px`) with:
  - `width: 100%`, `max-width`, or flex-based sizing.

### Modals (Modal, ManageCategoriesModal)

- Mobile:
  - `max-width: 90–95%`, centered, with internal scroll for long content.
- Larger screens:
  - Fixed `max-width` (e.g., 480–720px) with comfortable padding.
- Ensure modals never force body-level horizontal scroll.

### AllergenPicker and list-like components

- Use CSS grid with `auto-fit` + `minmax(...)` to adapt column count to viewport width.
- Ensure checkbox/label pairs wrap nicely and maintain tap-friendly spacing.

### Toasts, messages, buttons

- Verify text wrapping and padding on narrow screens.
- Ensure tap targets are large enough and visually consistent with global typography and spacing tokens.

**Goal:** Forms, dialogs, and feedback components behave well on all screen sizes and feel visually consistent.

---

## 4. MVP flows: account, business, menu, menu items (75–90 min)

Work only on components currently in the MVP.

### 4.1 Account area (`components/account/**`)

- Ensure `AccountDetails`, `DetailRow`, and edit forms use the common responsive form patterns.
- For side-by-side “label + value” layouts:
  - Allow wrapping and stacking on small screens.
  - Ensure long text does not cause overflow.

### 4.2 Business info (`components/business/**`)

- `EditBusinessInfo` and related screens:
  - Use responsive grid for business and address fields:
    - 1 column on mobile.
    - 2 columns on tablet/desktop where appropriate.
  - Ensure any icons/images follow the global responsive image rules.

### 4.3 Menu (`components/menu/**`)

- `MenuDashboard`, `MenuCard`:
  - Implement card grids with CSS grid:
    - `grid-template-columns: repeat(auto-fit, minmax(<min-width>, 1fr));`
  - Ensure long menu names wrap, and card padding scales with viewport.

### 4.4 Menu items (`components/menuItems/**`)

- For multi-pane layouts (e.g., list + details, swap panels):
  - Stack vertically on mobile.
  - Show side-by-side starting at tablet width.
- For any table-like layouts:
  - Option A: convert each row into a card on small screens.
  - Option B: allow horizontal scroll inside a contained table wrapper (not the entire page), keeping columns readable.

**Goal:** Viewing and editing account details, business info, menus, and menu items is comfortable on a phone and scales smoothly up to desktop.

---

## 5. Quick responsive audit (45–60 min)

Use devtools to systematically check key flows at different widths.

- Test viewports:
  - ~375px (mobile)
  - ~768px (tablet)
  - Desktop (e.g., 1280px+)

- Flows to test:
  - Login → page with breadcrumbs → account → business info → menu → menu items.

- Check for:
  - Any horizontal scrolling at the page level.
  - Text too small/too large for the device.
  - Elements overlapping or overflowing containers.
  - Inconsistent spacing or fonts between pages.
  - Breadcrumbs wrapping nicely and remaining usable.

- In the editor, run project-wide searches:
  - Large fixed widths/heights in component SCSS (e.g., `width: 600px`) and selectively replace with responsive patterns.
  - `overflow-x` usage; ensure it is only applied where truly needed and scoped to specific containers.

**Goal:** Catch and fix the most visible responsive issues on MVP pages without expanding scope.

---

## 6. Minimal documentation and commits (15–20 min)

- In sprint notes, record:
  - Breakpoints used and rationale.
  - Component groups touched (shell, common, account, business, menu, menu items).
  - Brief bullets describing how you ensured:
    - No horizontal scroll on MVP pages.
    - Readable typography and spacing across breakpoints.
    - Consistent visual style and responsive breadcrumbs.

- Make clear, logical commits:
  - `feat: add responsive global layout & typography`
  - `feat: make shell, breadcrumbs, and common components responsive`
  - `feat: make account, business, menu, and menu-items responsive`

**Goal:** Have a traceable, reviewable implementation that clearly maps to the responsive design requirements and is easy to explain in demos or reports.
