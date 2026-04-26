---
marp: true
title: NomNomSafe – Sprint 2 Week 14 Recap (Jeff)
paginate: true
---

# NomNomSafe  
## Sprint 2 – Week 14 Recap

**ASE 485 – Capstone Project**  
Jeff Perdue

---

# Week 14 Focus: Final Polish + Sprint Readiness

### Goal

Close Sprint 2 with:

- **Track A:** Phase 5 polish and demo-readiness completion
- **Track B:** Phase 2 epistemic extension completion (R3.5)

### Context

- Week 13 completed Track A hardening and Track B Phase 1 validation
- Week 14 emphasized presentation readiness and final deliverables

---

# Track A — Week 14 Plan Executed

### Scope (Phase 5)

- UX polish pass for import flow
- clearer fallback/error messaging
- accessibility-minded loading/status improvements
- demo validation checklist and known limitations freeze
- full manual regression confirmation

### Result

Track A reached demo-ready stability with explicit scope boundaries.

---

# Track A — UX Polish Delivered

### `ImportMenuFlow` upgrades

- stage-based progress messaging per import phase  
  (`upload/fetch → extract → parse`)
- visual progress indicator + status text
- clearer import guidance copy for file/URL paths
- improved result-state messaging retained from Week 13

### Why it mattered

Users now understand what the system is doing during long-running import actions.

---

# Track A — Error/Fallback Microcopy Improvements

### Added normalized user-facing messaging for key failure codes

- zero valid rows parsed
- empty extracted text
- MIME/extension mismatch
- parse timeout
- request rate-limited

### Outcome

Failure states now consistently guide users to safe next steps (upload alternate format or manual entry).

---

# Track A — Accessibility and Interaction Quality

### Improvements applied

- `aria-live` status updates for progress/state changes
- `aria-busy` on active import panels
- clearer status copy during ingest/save transitions

### QA impact

Better keyboard/screen-reader compatibility and clearer feedback loops during async operations.

---

# Track A — Week 14 Artifacts Added

### Demo validation checklist

`week14_demo_validation_checklist.md`

- clean CSV success path
- noisy PDF partial-warning path
- failing URL graceful fallback path
- successful URL path
- accessibility smoke checks

### Known limitations list

`week14_tracka_known_limitations.md`

- scope-frozen constraints documented for honest presentation framing

---

# Track A — Regression Status

### Automated checks

- client production build passes
- import backend regression suite passes (`67/67`)

### Manual checks

- full manual regression on CRUD/search/filter/sort completed
- **status: all passed** ✅

---

# Track B — Week 14 Goal

### Sprint Plan Goal

Complete Phase 2 epistemic extension:

- model communication-layer allergen risk expression
- produce R3.5 deliverable

### Week 14 outcome

`R3.5 — Phase 2 Epistemic Extension` completed.

---

# Track B — R3.5 Key Design Decisions

### Decisions finalized in Week 14

- **RoleType:** selected 3-value model (Structural, Incidental, Flavor)
- **Scope:** selected as ExposureState modifier mapped to evidence dimensions
- **CertaintyLevel:** selected 4-value transition-oriented model
- **DeclarationBasis:** added to resolve roadmap ambiguity around “Purpose”

### Impact

Phase 2 remains structurally connected to Phase 1 exposure logic instead of forming a disconnected reasoning layer.

---

# Track B — R3.5 Deliverable Structure

### Six-part document completed

1. Communication Act model
2. Seven Phase 2 concepts
3. Translation framework (act → evidence contribution)
4. Mapping table (real-world language patterns)
5. Worked examples
6. Relationship to Phase 1 and forward compatibility

### Outcome

All semester research deliverables (R3.1–R3.5) are complete.

---

# Outcomes vs Week 14 Plan

| Deliverable | Status |
|---|---|
| Track A UX polish + microcopy pass | ✅ Complete |
| Track A accessibility/status improvements | ✅ Complete |
| Track A demo checklist + known limitations | ✅ Complete |
| Track A regression validation (manual + automated) | ✅ Complete |
| Track B R3.5 Phase 2 deliverable | ✅ Complete |
| Full Track B deliverable set R3.1–R3.5 | ✅ Complete |

---

# Week 14 Milestone Status

> **Planned:** Demo-readiness polish for Track A; Phase 2 completion for Track B.

- Track A Phase 5 delivered and regression-validated ✅  
- Track B Phase 2 completed with R3.5 ✅  

**Week 14 closed with Sprint 2 deliverables complete and presentation-ready.**

---

# Looking Ahead — Week 15 (Sprint Close)

### Track A

- final demo rehearsal and presentation framing
- communicate known limitations transparently

### Track B

- sprint-close synthesis and forward roadmap framing
- handoff context for future Phase 3/4 ontology work

**Week 15 milestone:** polished sprint close and clean handoff materials.

