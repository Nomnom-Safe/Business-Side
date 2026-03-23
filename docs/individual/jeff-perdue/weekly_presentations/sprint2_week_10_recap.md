---
marp: true
title: NomNomSafe – Sprint 2 Week 10 Recap (Jeff)
paginate: true
---

# NomNomSafe  
## Sprint 2 – Week 10 Recap

**ASE 485 – Capstone Project**  
Jeff Perdue

---

# Week 10 Focus: Sprint 2 Foundation & AI Provider Selection

### Goal

Stand up the **Sprint 2 architecture** and select, configure, and integrate an LLM provider for the AI-assisted menu import feature (Track A).

### Context

- Sprint 2 runs Weeks 10–15 (3/16–4/26)  
- Three tracks: **Track A** — Menu UX + AI Import; **Track B** — Allergen Ontology Research; **Track C** — CSR Presentation  
- Week 10 milestone: Sprint 2 scope documented; LLM API access confirmed  

---

# Sprint 2 Plan — Scope & Requirements

### What Was Produced

- `sprint2_plan.md` — full Sprint 2 SRS with week-by-week schedule and risk register  
- **20+ actor-goal requirements** across three features:
  - Feature 1 — Manual Menu Management UX (R1.1–R1.4)  
  - Feature 2 — AI-Assisted Menu Import (R2.1–R2.8)  
  - Feature 3 — Allergen Ontology Research (R3.1–R3.5)  

### Import Architecture Defined

Three-layer pipeline: client → import endpoints → `menuParseService.js` → LLM API → review screen → Firestore

---

# Architecture Decision: Gemini Over OpenAI

### Evaluation Criteria (in priority order)

1. **Cost** — free tier, no credit card required  
2. **Accuracy** — structured JSON extraction quality  
3. **Speed** — response time for menu-length text  
4. **Latency** — round-trip for the user  

### Decision

**Gemini 2.5 Flash** selected over OpenAI and Anthropic  

- Free tier: 250 requests/day, 10 requests/minute — sufficient for capstone demo scale  
- No credit card required (critical for a shared team project)  
- `gemini-2.5-flash` performs well on structured extraction tasks  

---

# Provider-Swappable Architecture

### Design

The LLM provider is controlled by a single environment variable:

```
LLM_PROVIDER=gemini   # or: openai | anthropic
```

Switching providers for **Track B** research (LLM comparison on allergen reasoning) requires only an `.env` change — no code changes.

### SDK

`@google/genai` v1.46.0 installed (`server/package.json`)  
This is the current official Google Gen AI SDK — not the legacy `@google/generative-ai`.

---

# `menuParseService.js` — AI Integration Service

### What It Does

- Accepts extracted plain text from a menu document or web page  
- Sends it to Gemini (`gemini-2.5-flash`) with a structured extraction prompt  
- Returns a parsed JSON array of menu items:  
  `{ name, description, ingredients, price, category, possible_allergens[] }`

### Key Design Decisions

- `temperature: 0.1` — low temperature for deterministic structured output  
- Allergen prompt constrained at the LLM level: **only surface allergens explicitly stated in source text — never infer**  
- Response stripped of markdown code fences before JSON parse (models sometimes wrap output in backticks despite instructions)  
- Enforces **R2.8**: allergen data must never be assumed without human review  

---

# `menuImportController.js` — Endpoint Scaffold

### What It Does

- Receives text extracted from a file or URL  
- Passes it to `menuParseService.parseMenuText()`  
- Returns the structured items array to the client  
- **R2.7**: on any parse failure, returns a user-readable error with a manual-entry fallback suggestion  

### Status

Scaffold is in place. Full file parsing libraries (`pdf-parse`, `mammoth`, `csv-parse`) and the routes file (`menuImportRoutes.js`) are targeted for **Week 11**.

---

# Supporting Deliverables

### `gemini-local-setup.md`

Teammate onboarding guide covering:

- How to get a free Gemini API key from Google AI Studio  
- How to configure `server/.env` with `GEMINI_API_KEY` and `LLM_PROVIDER`  
- How to install the new server dependency (`npm install` in `server/`)  
- Free tier limits and what to do if a key is accidentally exposed  

### `cursor-handoff-gemini.md`

AI-assisted development handoff covering what was built, why, what remains, and which safety constraints must be preserved across future sessions.

---

# Outcomes vs Week 10 Plan

| Deliverable | Status |
|---|---|
| Sprint 2 SRS with 20+ requirements | ✅ Complete |
| LLM provider decision & API access confirmed | ✅ Complete — Gemini 2.5 Flash |
| `@google/genai` SDK installed | ✅ Complete |
| `menuParseService.js` | ✅ Complete — **ahead of Week 11 schedule** |
| `menuImportController.js` scaffold | ✅ Complete |
| Teammate onboarding + handoff docs | ✅ Complete |
| UX audit / minor polish (manual flows) | 🔜 Carrying to Week 11 |
| Track B Phase 0 data collection | 🔜 Starting Week 11 |

---

# Week 10 Milestone Status

> **Planned:** Sprint 2 scope documented; LLM API access confirmed; Phase 0 data collection underway.

- Sprint 2 scope documented ✅  
- LLM API access confirmed ✅  
- Phase 0 data collection: not yet started — carries to Week 11  

**Bonus:** `menuParseService.js` (a Week 11 deliverable) was completed this week, putting Track A one step ahead of schedule.

---

# Looking Ahead — Week 11

### Track A — Import Infrastructure

- Install and wire file parsing libraries (`pdf-parse`, `csv-parse`, `mammoth`)  
- Complete `menuImportRoutes.js` — register `POST /api/menu/import/file` and `GET /api/menu/import/url`  
- Wire API client call in `client/src/api/index.js`  
- UX audit and minor polish to existing manual add/edit/delete flows  

### Track B — Phase 0

- Collect 20–30 allergen-related prompts across diverse scenarios  
- Run against baseline LLMs; record raw responses  
- Categorize failures into the taxonomy  

**Week 11 Milestone:** Server can receive a file, parse it, and return structured items. Phase 0 deliverables complete.
