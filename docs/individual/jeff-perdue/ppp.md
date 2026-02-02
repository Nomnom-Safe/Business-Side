---
marp: true
title: NomNomSafe – Project Plan Presentation (PPP)
paginate: true
---

# NomNomSafe  
## Business-Facing MVP & Learning With AI

**ASE 485 – Capstone Project**  
Project Plan Presentation (PPP)

---

# Problem Context

### What is NomNomSafe?

NomNomSafe is a system designed to help restaurants **manage and communicate allergen-related menu information clearly and intentionally**.

It treats menu data as **living, safety-relevant information**, not static text.

---

# Problem Context

### The Domain

- Restaurant menu management  
- Food allergens and safety communication  
- Business-owned data and accountability  

### The Problem

- Menus change frequently
- Allergen information is often implicit or inconsistent
- Updates are manual and error-prone
- Small mistakes can carry real risk

---

# Problem Context

### Motivation

For business users:
- Confidence that menu data is accurate
- Clear ownership of allergen information
- Reduced ambiguity during updates

For the system:
- Structured, reviewable data
- Predictable behavior
- A foundation that supports safety-first decisions

---

# Sprint Structure

### Incremental and Intentional

Sprint 1 is designed to:
- Reduce complexity before adding features
- Establish clear MVP boundaries
- Produce a stable, usable business-facing foundation

Each sprint builds on **clarity and correctness**, not feature volume.

---

# Sprint 1 Scope (Culminates in MVP)

### What Sprint 1 Delivers

- A functional **business-user MVP**
- Clear separation between MVP and non-MVP features
- Improved front-end structure and maintainability
- Core workflows that could realistically ship

This sprint focuses on *doing fewer things well*.

---

# Feature 1: Archive Non-MVP Features

### Goal

Reduce active system complexity.

---

### What This Means

- Non-MVP features are hidden from the UI
- Archived features cannot be accessed through routing
- Code is retained, clearly labeled, and inactive

### Why It Matters

- Prevents accidental use
- Clarifies project scope
- Makes refactoring safer

---

# Feature 2: Refactor MVP Features (Front-End)

### Goal

Improve structure without changing behavior.

---

### What This Means

- MVP behavior remains unchanged
- Validation and error handling become consistent
- Front-end code follows clean design principles

### Why It Matters

- Easier to maintain and extend
- Reduces technical debt early
- Improves confidence in future changes

---

# Feature 3: Expanded Search, Filter, and Sort

### Goal

Improve item discovery for business users.

---

### What This Means

- Search items by name
- Filter by menu
- Filter by allergen inclusion or exclusion
- Combine search, filter, and sort predictably

### Why It Matters

- Faster item management
- Less friction during review
- Better control over allergen-related data

---

# Feature 4: Improved Business Onboarding

### Goal

Make onboarding clear and unambiguous.

---

### What This Means

- Structured onboarding flow
- Manual entry supported
- Optional prefilled data from external services
- Required fields clearly indicated and validated

### Why It Matters

- Fewer onboarding errors
- Clear expectations
- Cleaner business data

---

# Sprint 1 Schedule & Milestones

### Week-by-Week

**Week 4:** Feature Isolation  
- Identify MVP vs non-MVP  
- Archive non-MVP features  

**Week 5:** Front-End Refactoring  
- Apply design principles  
- Standardize validation  

---

**Week 6:** Item Discovery Enhancements  
- Search, filter, sort  

**Week 7:** Onboarding Improvements  
- Structured, validated business profiles  

---

# Learning With AI – Topic 1  
## Food Allergen Ontology

### What I Am Exploring

- How allergen concepts can be structured
- Entities, relationships, and rules
- Where ambiguity naturally appears


---

# Learning With AI – Topic 2  
## AI-Assisted Menu Parsing & Review

### What I Am Exploring

- Whether AI can assist during menu imports
- Highlighting possible allergens
- Catching misspellings or ambiguous terms

### Key Boundary

- AI suggestions are **reviewable and editable**
- Business users remain responsible for decisions


---

# Closing

### Where This Leaves Us

- Sprint 1 delivers a clear, stable business-user MVP
- Scope is intentional and controlled
- Learning with AI is exploratory and reflective

More detailed requirements and documentation are available in:
- The project repository
- Canvas capstone pages

**Questions or discussion?**
