---
marp: true
title: NomNomSafe - Final Presentation (Jeff)
paginate: true
size: 4:3
---

# NomNomSafe
## Final Presentation

Jeffrey Perdue  
ASE 485 Capstone

---

# What Problem Did I Solve?

- Restaurants need frequent menu updates, but sources are messy (PDF, DOCX, CSV, URL text).
- Manual entry is slow and error-prone.
- Allergen mistakes are safety-critical.
- The core problem: turn messy menu data into trustworthy, reviewable allergen-aware records.

---

# Why This Matters

- A wrong allergen signal can harm real people.
- Businesses need confidence and accountability in their menu data.
- "Unknown" should not be treated as "safe."
- The project goal was practical safety, not just feature completion.

---

# My Semester Approach

- Two-track plan:
  - **Track A (software):** build and validate business workflows.
  - **Track B (research):** build evidence-based allergen reasoning.
- Use AI as often as it made sense, and dynamically and critically assess how AI is used.
- Human confirmation remained mandatory for safety-relevant fields.

---

# Progress Since S1P

- Sprint 1 delivered a stable MVP foundation:
  - archived non-MVP features,
  - refactored front-end structure,
  - improved search/filter/sort,
  - improved onboarding.
- Sprint 2 expanded capability:
  - AI-assisted menu import/review/save,
  - stronger reliability/security controls,
  - ontology research completed (Phases 0-2).

---

# Project Results and Validation

- End-to-end flow works: import -> review -> confirm -> save.
- Multiple import paths supported (file and URL with fallback behavior).
- Reliability improvements added: quality gates, timeout/retry, rate limiting, clearer error handling.
- Validation completed via weekly checkpoints, regression checks, and demo readiness checklist.

---

# Demo (Live or Video)

### Demonstration Link

- Video: https://youtu.be/MfqT1rB7Udw

### What the demo shows

- Successful import from clean source.
- Human-confirmed allergen decisions before save.

---

# Learning with AI - Topic 1
## AI-Assisted Structured Data Extraction

- I learned AI can convert messy menu text into usable structured records.
- I also learned model output must be treated as untrusted input.
- Best result came from combining:
  - AI extraction for speed,
  - validation rules for quality,
  - human review for safety-critical decisions.

---

# Learning with AI - Topic 2
## Ontological Modeling for Safety-Critical Inference

- I learned allergen safety is an evidence problem, not a yes/no guess.
- The ontology defines when evidence is enough to infer safety.
- Key outcome: unresolved evidence must remain **unknown**, not auto-labeled safe.
- This made AI assistance safer and more explainable.

---

# Issues I Faced and How I Solved Them

- **Scope pressure:** solved by archiving non-MVP work and keeping a clear priority order.
- **Safety ambiguity:** solved by formal reasoning rules plus mandatory human confirmation.
- **Late-stage risk:** solved by a Week 14 scope freeze and explicit known limitations.

---

# Public Artifacts and Evidence

- Canvas page contains work presented at NKU Celebration of Research Thursday April 23.
- Presentation led by project collaborator Anna Dinius

---

# Closing

## Q and A
