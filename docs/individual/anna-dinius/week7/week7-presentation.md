---
marp: true
theme: default
paginate: true
title: 'Capstone Project — Week 7 Progress Report'
footer: 'Week 7 Progress Report — Anna Dinius'
---

# **Capstone Project**

## **Week 7 Progress Report**

### 2/23/2026 - 3/1/2026

> Commit range:
>
> - `ea476f1c95ceaae61cf1cbaf66e4b72fb3361b51 → d6c11f06446fa0c47bdebeba55e1b2714f427333`
>
> See [`project-statistics-detailed.md`](https://github.com/Nomnom-Safe/Business-Side/blob/refactor/back-end/docs/individual/anna-dinius/week7/project-statistics-detailed.md) for LoC and other project statistics.

---

# **Summary**

This week focused on:

- Responsive layout improvements across shared UI and account/menu screens
- Reusable styling infrastructure with shared SCSS variables and mixins
- Replacing checkbox implementations with a reusable/customizable checkbox component

---

# **Key Outcomes**

- Added shared SCSS helpers with `client/src/styles/_mixins.scss` and `client/src/styles/_variables.scss`, then simplified `global.scss`
- Improved responsive behavior in shared layout components including `Header`, `PageLayout`, and `ProfileIcon`
- Refined responsive styling across account, auth, business edit, menu, and menu item screens
- Added reusable `client/src/components/common/Checkbox/Checkbox.jsx` and applied checkbox styling improvements in menu item flows
- Adjusted menu item form layout, including price field positioning, and moved the `EditBusinessInfo` progress spinner for better UX

---

# **New Files (Server)**

- None

---

# **New Files (Client)**

- `client/src/components/common/Checkbox/Checkbox.jsx`
- `client/src/components/common/Checkbox/Checkbox.scss`
- `client/src/components/menuItems/Checkbox/Checkbox.scss`
- `client/src/styles/_mixins.scss`
- `client/src/styles/_variables.scss`

---

# **Major File Modifications (Server)**

- None in this commit range

---

# **Major File Modifications (Client)**

- `client/src/styles/global.scss` was cleaned up and shifted toward shared variables/mixins instead of one large stylesheet
- Shared layout and navigation styling updated in `Header.scss`, `Nav.scss`, `PageLayout.scss`, and `ProfileIcon.scss`
- `EditBusinessInfo.jsx` and `EditBusinessInfo.scss` were updated for layout fixes and spinner placement
- Menu-related styling and layout were refined in `MenuCard`, `MenuDashboard`, `MenuItemPanel`, `MenuItemsPage`, and menu-item checkbox components
- Account and auth screen styling was adjusted for smaller screens and more consistent spacing

---

# **Rationale**

### Why these changes?

- **Improve mobile and small-screen usability**  
  → Responsive spacing, breakpoints, and layout changes make the app easier to use across more device sizes

- **Reduce styling duplication**  
  → Shared SCSS variables and mixins create a more maintainable base for future UI work

- **Standardize checkbox behavior**  
  → A reusable checkbox component improves consistency and makes future form updates easier

---

# **Files Touched (Concise)**

### Notable Added (client/server)

- Client: reusable `Checkbox` component and stylesheet, menu-item checkbox stylesheet, shared SCSS `_mixins.scss` and `_variables.scss`
- Server: none

### Removed / Archived

- No major removals or archived files in this range; work primarily refactored existing styling structure

---

### **How to Run / Verify Locally**

1. **Install dependencies**

```powershell
npm install
```

2. **Run**

```powershell
npm run dev
```

---

### Manual Verification Checklist

- Resize the app to small, medium, and large widths and confirm `Header`, `PageLayout`, and navigation remain usable
- Verify account, auth, and edit business screens keep proper spacing and alignment on smaller screens
- Confirm menu item forms still save correctly after the checkbox and layout updates
- Verify the reusable checkbox renders and toggles correctly anywhere it is used

---

### Completion Summary

This week delivered a focused UI refinement pass centered on responsiveness and styling consistency. The changes improved the shared layout system, standardized checkbox behavior, and reduced styling duplication without introducing backend scope.

---

### Metrics

🔥 Week 7 Burndown Rates

- 11/11 Week 7 requirements completed
  - 100% total
  - ~14% per day

---

### Metrics (continued)

🔥 Sprint 1 Burndown Rates

- 4/4 Sprint 1 features completed
  - 100% total
  - 25% per week
  - ~3.6% per day
- 41/41 Sprint 1 requirements completed
  - 100% total
  - 25% per week
  - ~3.6% per day
