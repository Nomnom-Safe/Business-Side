## Project Overview

NomNom Safe is a software project focused on improving how restaurants manage and communicate allergen-related menu information. The system is designed to help business users maintain accurate, explicit, and trustworthy menu data while reducing ambiguity and risk for both restaurants and customers.

Rather than treating menus as static text or informal documentation, NomNom Safe treats menu information as **living, safety-critical data** that must remain accurate, reviewable, and intentionally managed over time.

This repository contains the main NomNom Safe capstone project and documents the scope, goals, and Sprint 1 plan for development related to ASE 485 at Northern Kentucky University.

- --

## Project Context, Domain, and Motivation

Restaurants regularly change menus, ingredients, suppliers, and preparation methods. However, allergen information is often:

- Scattered across multiple systems or documents
- Outdated or implicitly stated
- Manually maintained with little validation
- Communicated inconsistently to customers

This creates risk for businesses and uncertainty for individuals with food allergies or dietary restrictions.

NomNom Safe addresses this problem by reframing a menu as a **structured collection of menu items, explicit allergen signals, and contextual disclaimers**. Instead of relying on free-text notes or generic warnings, the system makes allergen information intentional, explicit, and reviewable by business users.

The primary users of NomNom Safe are restaurant owners, managers, and staff responsible for maintaining menu accuracy and allergen transparency. Sprint 1 focuses exclusively on the **business-facing side of the application**.

- --

## Sprint 1 MVP (Minimum Viable Product)

The Sprint 1 MVP focuses on stabilizing, clarifying, and improving the business-user experience while reducing technical complexity introduced during early development.

At a high level, the Sprint 1 MVP includes:

- Clearly defined MVP boundaries
- Removal of non-MVP functionality from active use
- Improved front-end structure and consistency
- Enhanced item discovery through search and filtering
- A clearer and more structured business onboarding experience

Sprint 1 intentionally prioritizes **correctness, clarity, and maintainability** over feature expansion.

- --

## Jeff — Features, Requirements, and Milestones

Jeff’s Sprint 1 work focuses on defining, stabilizing, and refining the MVP through feature isolation, front-end refactoring, improved item discovery, and clearer business onboarding.

### SRS – Actor–Goal Requirements

#### Feature 1: Archive Non-MVP Features

- *R1.1**

As a **business user**, the system shall hide non-MVP features from the user interface so that only relevant and supported functionality is visible.

- *R1.2**

As a **business user**, the system shall prevent access to non-MVP features through direct navigation or routing so that archived functionality cannot be accidentally used.

- *R1.3**

As a **system**, the system shall retain archived feature code in the codebase while removing it from execution paths so that future reactivation remains possible.

- *R1.4**

As a **system**, the system shall clearly label archived code and components as non-MVP so that their status and intent are unambiguous to future developers.

- *R1.5**

As a **system**, the system shall ensure archived features do not affect current application behavior so that active MVP functionality remains stable.

- --

#### Feature 2: Refactor MVP Features and Code (Front-End Focus)

- *R2.1**

As a **business user**, the system shall preserve all externally observable MVP feature behavior during refactoring so that existing workflows continue to function without disruption.

- *R2.2**

As a **business user**, the system shall provide consistent validation and error handling across refactored MVP features so that interactions behave predictably.

- *R2.3**

As a **business user**, the system shall expose only fully refactored and stable MVP functionality so that incomplete or unstable behavior is not encountered.

- *R2.4**

As a **system**, the system shall refactor front-end MVP code using good software design patterns and principles so that the codebase is easier to maintain and extend.

- *R2.5**

As a **system**, the system shall reduce redundant or duplicated front-end MVP logic so that technical debt introduced during initial development is minimized.

- --

#### Feature 3: Expanded Search, Filter, and Sort for Business Users

- *R3.1**

As a **business user**, the system shall allow searching for menu items by item name so that I can quickly locate a specific item.

- *R3.2**

As a **business user**, the system shall allow filtering menu items by the menu they belong to so that I can focus on a specific menu context.

- *R3.3**

As a **business user**, the system shall allow filtering menu items by the presence of one or more specified allergens so that I can identify items containing those allergens.

- *R3.4**

As a **business user**, the system shall allow filtering menu items by the absence of one or more specified allergens so that I can identify items that do not contain those allergens.

- *R3.5**

As a **business user**, the system shall allow search, filter, and sort operations to be used together so that I can refine item lists without losing applied criteria.

- *R3.6**

As a **system**, the system shall restrict searchable, filterable, and sortable fields to supported item, menu, and allergen attributes so that results remain predictable.

- --

#### Feature 4: Improved Business Onboarding

- *R4.1**

As a **business user**, the system shall guide me through a structured onboarding flow so that I can complete my business profile without ambiguity.

- *R4.2**

As a **business user**, the system shall allow manual entry of required business profile information so that onboarding can be completed without external services.

- *R4.3**

As a **business user**, the system shall optionally prefill business profile information using external services so that onboarding effort is reduced.

- *R4.4**

As a **business user**, the system shall allow review and editing of any prefilled business information so that I retain control over stored data.

- *R4.5**

As a **business user**, the system shall clearly indicate which business profile fields are required so that completion expectations are clear.

- *R4.6**

As a **system**, the system shall validate required business profile fields before marking onboarding as complete so that stored data is consistent and usable.

- --

### Sprint 1 Milestones & Deadlines (Jeff)

#### Week 1: Feature Isolation

- *Dates:** 2/2/26 – 2/8/26
- *Focus:** Reduce active system complexity before refactoring.
- *Milestones**
- Identify MVP vs non-MVP features
- Archive non-MVP features from UI and routing
- Clearly label archived code paths
- *Done**
- Non-MVP features inaccessible but retained
- MVP boundaries clearly defined
- --

#### Week 2: Front-End MVP Refactoring

- *Dates:** 2/9/26 – 2/15/26
- *Focus:** Improve front-end structure using good design practices.
- *Milestones**
- Refactor front-end MVP code
- Standardize validation and error handling
- Remove redundant front-end logic
- *Done**
- Front-end code is modular and consistent
- No observable behavior changes
- --

#### Week 3: Item Discovery Enhancements

- *Dates:** 2/16/26 – 2/22/26
- *Focus:** Improve business-user efficiency when managing items.
- *Milestones**
- Implement item-level search, filter, and sort
- Support filtering by menu and allergen inclusion/exclusion
- *Done**
- Items discoverable by name, menu, and allergens
- Combined search and filter behavior is predictable
- --

#### Week 4: Business Onboarding Improvements

- *Dates:** 2/23/26 – 3/1/26
- *Focus:** Improve clarity and efficiency of business profile onboarding.
- *Milestones**
- Implement structured onboarding flow
- Support manual and optional prefilled entry
- Validate required business profile fields
- *Done**
- Business profiles can be completed without ambiguity
- Prefilled data is editable
- Onboarding excludes menu and item workflows
- --

## Anna — Features, Requirements, and Milestones

Anna’s Sprint 1 work focuses on backend migration, architectural refactoring, navigation improvements, and responsive design.

### Features

1. Switch backend to Firebase

2. Refactor using software design principles

3. Improve navigation

4. Responsive design

- --

### Requirements

#### 1. Switch backend to Firebase

1.1 As a Business User, I want the system to behave consistently after the migration so that my workflows are not disrupted.

1.2 As a System, all MongoDB/Mongoose operations should be replaced with Firebase Admin SDK equivalents.

1.3 As a System, all incoming data should be validated using Zod schemas.

1.4 As a System, there should be a Firestore service layer that abstracts CRUD and query operations.

1.5 As a System, all API routes should be updated to use the Firestore service layer.

1.6 As a System, all MongoDB and Mongoose dependencies should be removed.

1.7 As a System, performance should be maintained or improved.

1.8 As a System, Firebase credentials should be loaded securely through environment configuration.

- --

#### 2. Refactor using Software Design Principles

2.1 As a Business User, I want the system to behave predictably so that I can complete tasks without encountering unexpected errors.

2.2 As a Business User, I want updates to be reliable so that new features do not break existing functionality.

2.3 As a Business User, I want consistent behavior across all pages so that the app feels cohesive.

2.4 As a System, business logic should be separated from UI logic to reduce complexity.

2.5 As a System, all API calls should be centralized into a dedicated service layer to ensure consistency.

2.6 As a System, duplicated logic should be removed to reduce bugs and improve clarity.

2.7 As a System, large components should be broken into smaller units to improve testability.

2.8 As a System, SOLID and clean architecture principles should be applied to improve long‑term maintainability.

2.9 As a System, consistent naming conventions should be enforced to improve contributor onboarding.

2.10 As a System, error handling and loading states should be standardized to improve user experience.

2.11 As a System, documentation should be updated to reflect the new architecture for contributor clarity.

- --

#### 3. Improve Navigation

3.1 As a Business User, I want to easily find and access all business features so that I can complete tasks efficiently.

3.2 As a Business User, I want navigation to feel intuitive so that I do not get lost in the app.

3.3 As a Business User, I want to move between pages without losing context so that my workflow is uninterrupted.

3.4 As a System, a clear and consistent navigation structure should be implemented to guide users through the app.

3.5 As a System, all major features should have obvious entry points to reduce confusion.

3.6 As a System, contextual navigation aids such as breadcrumbs should be provided to help users understand where they are.

3.7 As a System, all navigation elements should be accessible to support all users.

3.8 As a System, there should be no broken routes or dead ends to maintain a smooth experience.

3.9 As a System, navigation patterns should be responsive for mobile and desktop devices.

3.10 As a System, user state should be preserved when navigating between pages to avoid data loss.

3.11 As a System, loading indicators should be shown during route transitions when necessary to improve clarity.

- --

#### 4. Responsive Design

4.1 As a Business User, I want to manage my business information from any device so that I can work flexibly.

4.2 As a Business User, I want the interface to remain readable and usable on all screen sizes so that I can complete tasks comfortably.

4.3 As a Business User, I want a consistent visual experience across devices so that the app feels professional.

4.4 As a System, responsive breakpoints should be implemented to support mobile, tablet, and desktop layouts.

4.5 As a System, all components should adapt fluidly to screen size changes to maintain usability.

4.6 As a System, fixed dimensions should be replaced with flexible layouts to support responsiveness.

4.7 As a System, typography and spacing should scale appropriately across breakpoints.

4.8 As a System, images and icons should resize without distortion to maintain visual quality.

4.9 As a System, responsive navigation patterns such as a mobile menu should be provided to support smaller devices.

4.10 As a System, there should be no horizontal scrolling to maintain a clean layout.

4.11 As a System, accessibility should be preserved across all screen sizes to support all users.

- --

### Milestones

- **Week 1:** Convert Backend to Firebase (2/2/26 – 2/8/26)
- **Week 2:** Refactor Foundation (2/9/26 – 2/15/26)
- **Week 3:** Complete Refactor + Improve Navigation (2/16/26 – 2/22/26)
- **Week 4:** Implement Responsive Design (2/23/26 – 3/1/26)
- --

## Project Status

This repository represents the active Sprint 1 plan for the NomNom Safe capstone project. Sprint 1 establishes a stable MVP foundation that future sprints will build upon.

## Project File Structure

Below is the state of the file structure at the beginning of the project. Changes will be made throughout the sprints.

See [`docs/file-structure.txt`](https://github.com/Nomnom-Safe/Business-Side/blob/main/docs/file-structure.txt)  for an up-to-date version.

```
Business-Side/
├── client/
│   ├── __tests__/
│   │   ├── integration/
│   │   │   └── integration.test.js
│   │   └── setup/
│   │       └── testUtils.js
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   ├── icons/
│   │   │   │   ├── avatar.png
│   │   │   │   ├── delete.png
│   │   │   │   ├── demote-admin.png
│   │   │   │   ├── edit_business.png
│   │   │   │   ├── edit_login.png
│   │   │   │   ├── logout.png
│   │   │   │   ├── promote-admin.png
│   │   │   │   ├── remove-user.png
│   │   │   │   └── user-maintenance.png
│   │   │   └── images/
│   │   │       ├── menu-placeholder-left.jpg
│   │   │       └── menu-placeholder-right.jpg
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminTable/
│   │   │   │   │   ├── AdminTable.jsx
│   │   │   │   │   └── AdminTable.scss
│   │   │   │   └── UserMaintenance/
│   │   │   │       ├── UserMaintenance.jsx
│   │   │   │       └── UserMaintenance.scss
│   │   │   ├── auth/
│   │   │   │   ├── AllergenList/
│   │   │   │   │   └── AllergenList.jsx
│   │   │   │   ├── ChangeEmail/
│   │   │   │   │   ├── ChangeEmail.jsx
│   │   │   │   │   └── ChangeEmail.scss
│   │   │   │   ├── ChangePassword/
│   │   │   │   │   └── ChangePassword.jsx
│   │   │   │   ├── DietList/
│   │   │   │   │   └── DietList.jsx
│   │   │   │   ├── EditLoginInfo/
│   │   │   │   │   ├── EditLoginInfo.jsx
│   │   │   │   │   └── EditLoginInfo.scss
│   │   │   │   ├── GetAuthForm/
│   │   │   │   │   ├── GetAuthForm.jsx
│   │   │   │   │   └── GetAuthForm.scss
│   │   │   │   ├── Password/
│   │   │   │   │   ├── Password.jsx
│   │   │   │   │   └── Password.scss
│   │   │   │   └── SignInUp/
│   │   │   │       ├── SignInUp.jsx
│   │   │   │       └── SignInUp.scss
│   │   │   ├── common/
│   │   │   │   ├── ConfirmationMessage/
│   │   │   │   │   └── ConfirmationMessage.jsx
│   │   │   │   ├── ErrorMessage/
│   │   │   │   │   └── ErrorMessage.jsx
│   │   │   │   ├── Header/
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   └── Header.scss
│   │   │   │   └── ProfileIcon/
│   │   │   │       ├── ProfileIcon.jsx
│   │   │   │       └── ProfileIcon.scss
│   │   │   ├── menu/
│   │   │   │   ├── MenuCard/
│   │   │   │   │   ├── MenuCard.jsx
│   │   │   │   │   └── MenuCard.scss
│   │   │   │   └── MenuDashboard/
│   │   │   │       ├── MenuDashboard.jsx
│   │   │   │       └── MenuDashboard.scss
│   │   │   ├── menuItems/
│   │   │   │   ├── AddMenuItem/
│   │   │   │   │   └── AddMenuItem.jsx
│   │   │   │   ├── Checkbox/
│   │   │   │   │   └── Checkbox.jsx
│   │   │   │   ├── MenuItemPanel/
│   │   │   │   │   └── MenuItemPanel.jsx
│   │   │   │   ├── MenuItemsPage/
│   │   │   │   │   └── MenuItemsPage.jsx
│   │   │   │   └── MenuItemSwap/
│   │   │   │       ├── MenuItemSwap.jsx
│   │   │   │       └── MenuItemSwap.scss
│   │   │   ├── ProtectedRoute/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── restaurant/
│   │   │   │   └── EditBusinessInfo/
│   │   │   │       ├── EditBusinessInfo.jsx
│   │   │   │       └── EditBusinessInfo.scss
│   │   │   └── setup/
│   │   │       ├── ChooseBusiness/
│   │   │       │   ├── ChooseBusiness.jsx
│   │   │       │   └── ChooseBusiness.scss
│   │   │       ├── SetUp/
│   │   │       │   ├── SetUp.jsx
│   │   │       │   └── SetUp.scss
│   │   │       ├── Step1/
│   │   │       │   ├── Step1.jsx
│   │   │       │   └── Step1.scss
│   │   │       ├── Step2/
│   │   │       │   ├── Step2.jsx
│   │   │       │   └── Step2.scss
│   │   │       └── Step3/
│   │   │           ├── Step3.jsx
│   │   │           └── Step3.scss
│   │   ├── styles/
│   │   │   └── global.scss
│   │   ├── utils/
│   │   │   ├── cookies.jsx
│   │   │   └── formValidation.js
│   │   ├── App.jsx
│   │   ├── App.test.js
│   │   └── index.jsx
│   └── package.json
├── docs/
│   ├── individual/
│   │   ├── anna-dinius/
│   │   │   └── ppp-dinius.md
│   │   └── jeff-perdue/
│   │       └── ppp.md
│   ├── modules/
│   │   ├── AdminModule.md
│   │   ├── AuthenticationModule.md
│   │   ├── BackendModule.md
│   │   ├── BusinessModule.md
│   │   ├── MenuItemsModule.md
│   │   ├── MenuModule.md
│   │   ├── SetupModule.md
│   │   └── TestingModule.md
│   ├── file-structure.txt
│   ├── Requirements.md
│   └── UserManual.md
├── scripts/
│   ├── compare_tree.py
│   ├── loc_counter.py
│   └── update_file_tree.py
├── server/
│   ├── __tests__/
│   │   ├── integration/
│   │   │   └── authFlow.test.js
│   │   └── setup/
│   │       └── testDb.test.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── db.test.js
│   │   ├── models/
│   │   │   ├── Business.js
│   │   │   ├── Business.test.js
│   │   │   ├── Menu.js
│   │   │   ├── Menu.test.js
│   │   │   ├── MenuItem.js
│   │   │   ├── MenuItem.test.js
│   │   │   ├── User.js
│   │   │   └── User.test.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── adminRoutes.test.js
│   │   │   ├── businessRoutes.js
│   │   │   ├── businessRoutes.test.js
│   │   │   ├── menuItemRoutes.js
│   │   │   ├── menuItemRoutes.test.js
│   │   │   ├── menuRoutes.js
│   │   │   ├── menuRoutes.test.js
│   │   │   ├── userRoutes.js
│   │   │   └── userRoutes.test.js
│   │   └── utils/
│   │       └── cookies.js
│   ├── package.json
│   ├── README.md
│   └── server.js
├── package.json
└── README.md

```