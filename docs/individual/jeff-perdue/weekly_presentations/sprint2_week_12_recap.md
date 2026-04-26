---
marp: true
title: NomNomSafe – Sprint 2 Week 12 Recap (Jeff)
paginate: true
---

# NomNomSafe  
## Sprint 2 – Week 12 Recap

**ASE 485 – Capstone Project**  
Jeff Perdue

---

# Week 12 Focus: Import Review + Ontology Core

### Goal

Deliver the Week 12 milestone across both tracks:

- **Track A:** complete the end-to-end import review-and-save flow with resilient UX
- **Track B:** begin Phase 1 ontology drafting (R3.3)

### Context

- Sprint 2 Week 12 window: 3/30–4/5
- This week moved from pipeline plumbing to user-facing reliability

---

# Track A — Import Flow Hardening (Implemented)

### Import endpoint reliability

- Added MIME fallback by filename for uploads reported as `application/octet-stream`
- Expanded PDF extraction error handling with clearer user fallbacks
- Added explicit handling for image-only PDFs (no selectable text)
- Preserved correlation-id and error taxonomy patterns from Week 11

### Why this mattered

Users were reaching upload dead ends without actionable guidance.

---

# Track A — PDF Runtime Compatibility Fix

### Issue

`pdf-parse` runtime export shape changed (`PDFParse` class in installed version), causing upload failures.

### Fix implemented

- Updated import controller to support both:
  - function-style parser exports
  - class-style `PDFParse` exports (`getText()`)
- Added parser cleanup (`destroy()`) on class path

### Result

PDF upload no longer depends on a single module shape.

---

# Track A — Review Screen UX Upgrades

### Improvements delivered

- Reworked import review table into modern card-based editing layout
- Added a sticky top action area for allergen suggestion actions
- Improved spacing, fields, and hierarchy for name/price/category/ingredients
- Added clearer allergen guidance text and stronger acknowledgment flow

### Outcome

Review step is now practical for large imports instead of visually overwhelming.

---

# Track A — Allergen Suggestion Controls

### Behavior implemented

- Added global top action:  
  **“Match suggestions to allergen checkboxes (all items)”**
- Added per-row “Match suggestions” action where parser suggestions exist
- Mapped parser suggestions to database allergen IDs without auto-saving
- Kept R2.8 rule: user still confirms and explicitly stores allergen selections

### UX intent

Assist speed without removing human review safeguards.

---

# Track A — Save Result Screen Cleanup

### Previous behavior

Displayed long row-by-row internal IDs after save.

### New behavior

Displays concise success copy:

> **“X menu items were successfully added to {Menu Name}.”**

If partial failure exists, a short failure summary is shown.

---

# Track A — Post-Save Visibility / Menu Context Fixes

### Problem observed

“Saved successfully” results did not always appear on the menu page afterward.

### Fixes implemented

- Preserved `currentMenuId` at successful save
- Navigated back to menu with explicit `menuID` state
- Added menu-id fallbacks in `MenuItemsPage` to avoid context drift
- Persisted demo-mode menu/item/business/address mutations to local demo store

### Result

Saved imports reliably show in the target menu context.

---

# Track B — Week 12 (from roadmap progress)

### Sprint Plan Goal

Begin Phase 1 and draft core ontology artifacts for R3.3.

### Actual Week 12 outcome

R3.3 was not only started; it was completed in Week 12:

- Core node definitions finalized
- ExposureState model formalized
- Safety Inference Principle documented
- Modification Request Rule included with empirical grounding

---

# Track B — R3.3 Design Decision Highlight

### Modification Request Rule (key Week 12 decision)

A request like “remove butter” does **not** change ExposureState unless all evidence dimensions are resolved and execution is confirmed.

### Why it mattered

- Closed a real gap surfaced in Phase 0 scenarios
- Prevented false safety inference from partial modifications
- Created a direct bridge into Week 13 scenario validation (R3.4)

---

# Outcomes vs Week 12 Plan

| Deliverable | Status |
|---|---|
| Import review/edit/save UX completed | ✅ Complete |
| Allergen confirmation + suggestion assist flow | ✅ Complete |
| Save-result messaging simplified | ✅ Complete |
| PDF import reliability fixes | ✅ Complete |
| Post-save menu visibility/context fixes | ✅ Complete |
| Track B R3.3 draft started | ✅ Complete (finished ahead of plan) |

---

# Week 12 Milestone Status

> **Planned:** End-to-end import flow usable; Phase 1 ontology draft begun.

- Import flow: parse → review → save → menu visibility ✅  
- PDF and suggestion UX regressions resolved ✅  
- Phase 1 ontology draft begun ✅  
- Phase 1 ontology completed (R3.3) ✅  

**Week 12 finished ahead of plan on Track B and with substantial stability gains on Track A.**

---

# Looking Ahead — Week 13

### Track A

- Continue polish and test pass on import edge cases
- Validate large-file and partial-failure paths in demo workflows

### Track B

- Execute and document R3.4 scenario test suite
- Validate Modification Request Rule through structured stress cases

**Week 13 milestone:** Phase 1 validation complete via scenario testing.

