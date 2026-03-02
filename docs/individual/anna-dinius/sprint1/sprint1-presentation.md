---
marp: true
title: NomNom Safe Sprint 1 Presentation (S1P) – Dinius
paginate: true
footer: NomNom Safe S1P - Anna Dinius
---

# NomNom Safe

## Sprint 1 Presentation & Sprint 2 Plan

**ASE 485 – Capstone Project**

> Anna Dinius

---

## What is NomNom Safe?

### A platform for restaurants to own their allergen data

- Restaurants manage menus that carry **real safety implications**
- Allergen information is often incomplete, inconsistent, or out of date
- NomNom Safe treats menu data as **living, safety-relevant information** — not static text

### Who it serves

- **Business users** (restaurant owners/staff): clear ownership of menu and allergen data
- **Customers** (future scope): reliable, structured allergen information

---

# Sprint 1

---

## Sprint 1 Goals

- **Features:** 4
- **Requirements:** 41
- **Focus:** a stable, modern MVP

---

## Features

| Feature                                    | Goal                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------- |
| **1. Switch Backend to Firebase**          | Migrate from MongoDB/Mongoose to Firebase for scalability and consistency |
| **2. Refactor Using SW Design Principles** | Improve structure, maintainability, and testability                       |
| **3. Improve Navigation**                  | Make the app intuitive and easy to move through                           |
| **4. Responsive Design**                   | Consistent, usable experience across mobile, tablet, and desktop          |

Each feature was driven by actor–goal requirements documented before work began.

---

## Feature 1: Switch Backend to Firebase

### Goal: migrate to Firebase without disrupting workflows

---

**What was delivered**

- **MongoDB/Mongoose** replaced with **Firebase Admin SDK** across the backend
- **Zod schemas** for validation of all incoming data
- **Firestore service layer** abstracting CRUD and query operations
- All API routes updated to use the new service layer
- MongoDB and Mongoose dependencies removed
- **Firebase credentials** loaded securely via environment configuration

**Significance**

- Backend is aligned with a scalable, managed data layer
- Data integrity enforced through validation; clean architecture preserved

---

## Feature 2: Refactor Using SW Design Principles

### Goal: improve structure without changing behavior

---

**Principles applied**

- **Centralized API layer** — all API calls in a dedicated service layer for consistency
- **Separation of concerns** — business logic separated from UI logic
- **SOLID and clean architecture** — smaller, testable units; duplicated logic removed
- **Standardized error handling and loading states** — predictable user experience
- **Consistent naming and documentation** — contributor onboarding and long-term maintainability

**Significance**

- Technical debt reduced before Sprint 2; new features are easier to add and test

---

## Feature 3: Improve Navigation

### Goal: help business users find and use features efficiently

---

**What was delivered**

- **Clear, consistent navigation structure** guiding users through the app
- **Obvious entry points** for all major features
- **Contextual aids** such as breadcrumbs so users know where they are
- **Accessible navigation** and **no broken routes or dead ends**
- **Responsive navigation patterns** for mobile and desktop
- **Preserved user state** and **loading indicators** during route transitions

**Significance**

- Users can complete tasks without getting lost; workflow stays uninterrupted

---

## Feature 4: Responsive Design

### Goal: consistent, professional experience on any device

---

**What was delivered**

- **Responsive breakpoints** for mobile, tablet, and desktop layouts
- **Fluid components** that adapt to screen size; fixed dimensions replaced with flexible layouts
- **Typography and spacing** that scale across breakpoints
- **Images and icons** that resize without distortion
- **Mobile-friendly navigation** (e.g., mobile menu) for smaller devices
- **No horizontal scrolling**; **accessibility preserved** across screen sizes

**Significance**

- Business users can manage their information from any device; the app feels professional everywhere

---

# Sprint 1 Metrics

### Sprint 1 is complete.

| Metric             | Result      |
| ------------------ | ----------- |
| Features completed | **4 / 4**   |
| Requirements met   | **41 / 41** |
| Burndown rate      | **100%**    |
| LoC                | \*\*\*\*    |
| File count         | \*\*\*\*    |

All Sprint 1 features and requirements were completed on time according to the defined milestones.

---

### Requirements breakdown

- **R1.1–R1.8** — Switch Backend to Firebase (8 requirements)
- **R2.1–R2.11** — Refactor Using SW Design Principles (11 requirements)
- **R3.1–R3.11** — Improve Navigation (11 requirements)
- **R4.1–R4.11** — Responsive Design (11 requirements)

---

# MVP App State

### What the app delivers today

- Backend runs on **Firebase** with validated data and a clean service layer
- **Refactored** server and auth code with SOLID principles and centralized APIs
- **Intuitive navigation** with breadcrumbs, clear entry points, and preserved state
- **Responsive layout** that works on mobile, tablet, and desktop

The foundation is stable and ready for Sprint 2: user testing, MVP revisions, and presentation prep.

---

# Sprint 2

---

## Sprint 2 Goals

- **Features:** 4
- **Requirements:** 41
- **Focus:** test and revise the MVP

---

### Goals

| Goal                 | Focus                                                        |
| -------------------- | ------------------------------------------------------------ |
| **1. User Testing**  | Round 1 and Round 2 with business users; capture feedback    |
| **2. MVP Revisions** | Prioritize and implement changes based on user feedback      |
| **3. Presentation**  | Celebration of Student Research — slides, demo, and delivery |

Sprint 2 runs **Weeks 10–15 (March 16 – April 26)**.

---

## Sprint 2: User Testing

### What we're doing

- **Round 1:** Recruit 10–15 app users; conduct 15-30 minute usability sessions; capture feedback via surveys and notes
- **Round 2:** Focus on revised areas; validate improvements with targeted feedback
- **Environment:** Demo data and logging so bugs are trackable and reproducible

### Key requirements (R1.1–R1.9)

- Outreach to 20+ businesses; recruit participants; run sessions; set up test environment for both rounds

---

## Sprint 2: MVP Revisions

### What we're doing

- **After Round 1:** Prioritize top 5–10 issues; create revision spec; implement UI/UX changes, backend tweaks, and bug fixes in a 1-week sprint
- **After Round 2:** Prioritize top 5–10 issues; analyze themes; implement final revisions on schedule

### Key requirements (R2.1–R2.8)

- Developer and researcher roles aligned so iterations stay documented and on track

---

## Sprint 2: Presentation

### Celebration of Student Research

- **Slide deck** — project background, app features, testing results, and outcomes
- **Demo** — live demo video or screenshots of the final app
- **Rehearsal** — 15 minute presentation with user quotes and metrics
- **Testing summary** — participant counts, satisfaction scores, and visuals
- **Demo-ready app** — polished so there are no technical issues during the event

### Key requirements (R3.1–R3.5)

---

## Sprint 2 Schedule & Milestones

| Week   | Dates        | Milestone                                                       |
| ------ | ------------ | --------------------------------------------------------------- |
| **10** | Mar 16–22    | Round 1 testing prep: outreach, recruitment, test setup         |
| **11** | Mar 23–29    | Round 1 user testing and feedback capture                       |
| **12** | Mar 30–Apr 5 | Round 1 analysis, revisions, and Round 2 prep                   |
| **13** | Apr 6–12     | Round 2 testing                                                 |
| **14** | Apr 13–19    | Round 2 analysis, final revisions, and presentation drafting    |
| **15** | Apr 20–26    | Final polish and presentation (Celebration of Student Research) |

---

## Final Delivery: Celebration of Student Research

### Sprint 2 outcome

- **User testing** complete (Round 1 and Round 2)
- **MVP revised** based on real user feedback
- **Presentation** delivered with slides, demo, and testing summary

The presentation tells the story: what NomNom Safe is, what was built in Sprint 1, how it was tested and refined in Sprint 2, and what was learned.

---

# Learning with AI

---

## Slow progress

- Focus on Capstone project (NomNom Safe)
  - Unknown unknown: scope of the work required for sprint 1 features
- 6-week roadmap for exploring market and user testing research
- Replace ontology topic with learning SCSS/Sass

---

# Questions?
