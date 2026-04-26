---
marp: true
title: NomNomSafe – Sprint 2 Week 13 Recap (Jeff)
paginate: true
---

# NomNomSafe  
## Sprint 2 – Week 13 Recap

**ASE 485 – Capstone Project**  
Jeff Perdue

---

# Week 13 Focus: Reliability + Validation

### Goal

Complete Week 13 by:

- hardening Track A import workflows for robustness and safety
- completing Track B Phase 1 validation deliverable work (R3.4)

### Context

- Week 12 delivered core import flow and R3.3 ontology completion
- Week 13 shifted toward quality gates and stress-tested validation

---

# Track A — Week 13 Scope Executed

### Primary Quality Gate Work

- timeout + retry protection for LLM parse calls
- parse quality classification and dedicated no-valid-items failure path
- route-level abuse protections via import endpoint rate limiting
- structured import telemetry for stage-level observability
- stricter MIME/extension mismatch rejection path

### Intent

Move from "works in happy path" to "predictable under failures."

---

# Track A — Timeout/Retry + Error Resilience

### Implemented in `menuParseService.js`

- model timeout ceiling added for parse calls
- one safe retry for transient provider/network conditions
- no blind retries on validation/format failures
- structured parse-stage logs for start/success/failure

### Outcome

Improved reliability under temporary provider instability without duplicate unsafe writes.

---

# Track A — Parse Quality Gates

### Added in `menuImportController.js`

- parse quality assessment:
  - `ok`
  - `low` (many sparse/incomplete fields)
  - `none` (no valid rows)
- dedicated zero-valid parse response:
  - `IMPORT_ZERO_ITEMS_PARSED`
- low-confidence warning returned to UI and surfaced in review

### Outcome

Users now get explicit guidance for weak/empty parses before save.

---

# Track A — Security & Abuse Controls

### Added protections

- import endpoint rate limiter middleware (file/url/save)
- tighter MIME + extension mismatch guard
- existing SSRF URL blocking retained and carried forward

### Why this mattered

Week 13 hardening required reducing abuse risk and malformed upload ambiguity.

---

# Track A — Observability Additions

### New telemetry utility

- in-memory counters:
  - parse attempts
  - parse success
  - parse failed
  - failure reasons
- median parse latency snapshot
- structured event logging at pipeline completion

### Outcome

Import behavior is now measurable and diagnosable during demo and QA runs.

---

# Track A — Validation Status

### Regression checks run

- import-focused backend tests pass (`menuImport|importNormalize|inferMime`)
- client build passes after Week 13 changes
- integration tests updated for new zero-valid parse behavior and parse call signature

### Result

Hardening changes landed without breaking core import flow.

---

# Track B — Week 13 Goal

### Sprint Plan Goal

Complete Phase 1 by applying the ontology to stress-test scenarios and producing R3.4.

### Week 13 Deliverable

`R3.4 — Scenario Test Suite` finalized with 18 scenarios and explicit validation rationale.

---

# Track B — R3.4 Test Suite Highlights

### Coverage structure

18 scenarios across 6 categories:

- simple dishes with complete evidence
- shared fryer / cross-contact
- oil and ingredient ambiguity
- bakery/dessert complexity
- modification request cases
- missing preparation context cases

### Validation balance

3 justified inference-permitted cases, 15 blocked cases (intentional stress profile).

---

# Track B — Key Week 13 Outcomes

### What was validated

- ontology permits justified inference when evidence is complete
- ontology blocks unjustified inference when pathways remain unresolved
- Modification Request Rule validated with dedicated paired scenarios

### Status at end of Week 13

Phase 1 fully complete (R3.1–R3.4 finalized), ahead of schedule heading into Phase 2.

---

# Outcomes vs Week 13 Plan

| Deliverable | Status |
|---|---|
| Track A robustness hardening pass | ✅ Complete |
| Track A parse quality + no-valid-items guard | ✅ Complete |
| Track A rate limiting + observability | ✅ Complete |
| Track A regression validation | ✅ Complete |
| Track B R3.4 scenario suite | ✅ Complete |
| Track B Phase 1 completion (R3.1–R3.4) | ✅ Complete |

---

# Week 13 Milestone Status

> **Planned:** Robustness hardening for import + Phase 1 completion/validation.

- Track A quality gate work completed and verified ✅  
- Track B Phase 1 validation completed with R3.4 ✅  

**Week 13 closed with both tracks in a stable handoff state for Week 14.**

---

# Looking Ahead — Week 14

### Track A

- finish remaining polish and demo-readiness checks
- continue reliability verification on mixed-quality import sources

### Track B

- execute Phase 2 epistemic extension work (R3.5)
- map communication acts to exposure-state contributions

**Week 14 milestone:** final Sprint 2 deliverables packaged for presentation readiness.

