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

![bg fit](../nomnomurlimport/add_business_1.png)

---

![bg fit](../nomnomurlimport/menu_page_2.png)

---

![bg fit](../nomnomurlimport/url_import_3.png)

---

![bg fit](../nomnomurlimport/import_wating_4.png)

---

![bg fit](../nomnomurlimport/import_review_5.png)

---

![bg fit](../nomnomurlimport/import_review_6.png)

---

![bg fit](../nomnomurlimport/import_review_7.png)

---

![bg fit](../nomnomurlimport/after_import_8.png)

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
<style scoped>section { font-size: 115%; }</style>
## Ontology Research Deliverables (Why They Matter)

### The real question

- "Can this dish be called safe for an allergen?"

### Why this needed research

- Menu wording is often incomplete.
- Staff language can be inconsistent.
- AI can sound confident even when evidence is missing.

### What the deliverables do

- Turn vague language into a clear evidence process.
- Separate "what we know" from "what we are guessing."
- Require proof before any safety claim is allowed.

---

# Learning with AI - Topic 2
<style scoped>section { font-size: 115%; }</style>
## Documents Explained

| Deliverable | Plain-language outcome |
|---|---|
| **R3.1 - Failure Taxonomy** | Identified common unsafe reasoning patterns (for example, treating "not listed" as "safe"). |
| **R3.2 - Evidence Requirements** | Defined the minimum evidence needed before a conclusion can be trusted. |
| **R3.3 - Core Exposure Model** | Built a simple state model (including **Unknown**) with a strict rule for when "safe" is allowed. |
| **R3.4 - Scenario Test Suite** | Validated the model on 18 realistic food-service scenarios to confirm behavior under ambiguity. |
| **R3.5 - Communication Layer** | Mapped real menu/staff/disclaimer language into structured evidence without changing the core safety rule. |

### Bottom line

- The research produced a reusable safety framework that supports AI assistance while protecting against false confidence.

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
