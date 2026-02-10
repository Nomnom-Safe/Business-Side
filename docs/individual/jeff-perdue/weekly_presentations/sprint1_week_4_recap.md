---
marp: true
title: NomNomSafe – Sprint 1 Week 1 Recap (Jeff)
paginate: true
---

# NomNomSafe  
## Sprint 1 – Week 4 Recap

**ASE 485 – Capstone Project**  
Jeff Perdue 

---

# Week 4 Focus: Feature Isolation

### Goal

Reduce active system complexity before refactoring.

### Week 1 Objectives

- Identify **MVP vs non-MVP** features  
- Archive non-MVP features from the **UI and routing**  
- Clearly label archived code paths for future developers  

---

# What I Archived (Non-MVP Features)

### Admin / User Management

- User Maintenance page  
- Admin Table (promote/demote users, remove access)  
- User Maintenance menu item in the profile dropdown  
- All admin backend routes  

**Reason:** MVP assumes **single user per business**, so multi-user admin is out of scope.

---

# What I Archived (Non-MVP Features) – Continued

### Menu Item Swapping

- `MenuItemSwap` component (moving items between menus)  
- "Integrate Menus" button on the menu items page  
- Backend routes that support menu swapping  

**Reason:** MVP is a **single menu**, so moving items between menus is out of scope.

---

# What Remains Active (MVP Surface)

### MVP Features Still Available

- Sign in / sign out  
- Single menu management (view, create, delete menus)  
- Menu items CRUD (add, edit, delete items)  
- Business CRUD (edit business info)  
- Account CRUD (edit email/password)  
- Setup wizard / onboarding flow  

All archived code is preserved and marked with `// ARCHIVED:` comments for traceability.

---

# Impact of Week 1 Work

### Outcomes

- ✅ Non-MVP features are **inaccessible** but still **recoverable**  
- ✅ MVP boundaries are **explicit and documented**  
- ✅ Active code paths are smaller and safer to refactor  
- ✅ Future work can focus on a **clear, stable core**  

This completes the Week 4 milestone: **Feature Isolation** for the business-side MVP.

---

# Sprint 1 Completion Metrics

- Features completed so far (Jeff, Sprint 1 Week 1): **1 / 4**
- Completed: Feature 1 – Archive Non-MVP Features
- Actor–goal requirements completed so far: **5 / 22**
- Completed: R1.1–R1.5 (all requirements under Feature 1)
- Burndown rate: **23%**

---

# Looking Ahead

### Next Steps in Sprint 1

- Week 5: Refactor front-end MVP
- Week 6: Enhance item discovery
- Week 7: Improve business onboarding
