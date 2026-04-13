---
marp: true
title: NomNomSafe – Sprint 2 Week 11 Recap (Jeff)
paginate: true
---

# NomNomSafe  
## Sprint 2 – Week 11 Recap

**ASE 485 – Capstone Project**  
Jeff Perdue

---

# Week 11 Focus: Import Infrastructure

### Goal

Build the **server-side file import pipeline** — accepting real menu documents, extracting their text, and returning structured menu items via Gemini 2.5 Flash.

### Context

- Week 11 milestone: Server can receive a file, parse it, and return structured items  
- Track A carried forward a working `menuParseService.js` from Week 10  
- Track B Phase 0 data collection begins this week  

---

# File Parsing Libraries

### Installed & Wired

Three libraries added to `server/package.json`:

| Library | Purpose |
|---|---|
| `pdf-parse` | Extract plain text from PDF documents |
| `mammoth` | Extract plain text from DOCX files |
| `csv-parse` | Parse CSV as plain text for LLM ingestion |
| `multer` | Handle multipart file uploads in Express |

All four installed alongside existing dependencies via `npm install`.

---

# `menuImportController.js` — Full Implementation

### What It Does

- Receives a raw file upload via `multer` (memory storage — no disk I/O)  
- Validates: file present, MIME type supported, size ≤ 5 MB  
- Detects file type by MIME and routes to the appropriate extraction library  
- Passes extracted text to `menuParseService.parseMenuText()`  
- Returns structured items array to client  

---

### Supported Types

`application/pdf` → `pdf-parse`  
`application/vnd.openxmlformats-officedocument.wordprocessingml.document` → `mammoth`  
`text/csv` + `application/vnd.ms-excel` → UTF-8 buffer decode

---

# `menuImportController.js` — Error Handling

### R2.7 Compliance

Every failure path returns the same user-readable shape:

```json
{
  "success": false,
  "error": "We couldn't parse this menu automatically.",
  "fallback": "Try uploading a different file format, or add items manually."
}
```

Distinct 400 responses for: no file, unsupported type, file too large, empty extract.  
500 fallback for LLM or unexpected failures.

---

# `menuImportRoutes.js` — New Routes File

### What Was Created

- `multer` configured with **memory storage** and 5 MB file size limit  
- `POST /file` registered with multer middleware + `asyncHandler`  
- Exported and mounted in `server.js` at `/api/menu/import`  

### Live Endpoint

```
POST http://localhost:5000/api/menu/import/file
```

Accepts: multipart form-data with field name `file`

---

# `menuParseService.js` — Bug Fix

### Issue Discovered During Testing

`GoogleGenAI` client was instantiated at **module load time**:

```js
// Before (broken)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```

`dotenv` had not yet run when the module was first `require()`d — so `process.env.GEMINI_API_KEY` was `undefined`, causing every request to fail with `API_KEY_INVALID`.

### Fix

Client instantiation moved **inside** `parseMenuText()` — reads the env var at request time, after `dotenv.config()` has run.

---

# End-to-End Test — Postman

### Test File: `diner_menu.csv` (27 items across 6 categories)

**Result:** `200 OK` — all 27 items parsed and returned correctly

```json
{
  "success": true,
  "items": [
    {
      "name": "The Stack",
      "description": "Three buttermilk pancakes...",
      "price": 9.99,
      "category": "Breakfast Classics",
      "possible_allergens": ["gluten", "dairy", "eggs"]
    },
    ...
  ]
}
```

Categories inferred correctly. Allergens extracted only from explicit source text (**R2.8** enforced).

---

# Client API — `menuImportApi`

### Added to `client/src/api/index.js`

```js
export const menuImportApi = {
  importFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/api/menu/import/file`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  },
};
```

- Raw `fetch` with `FormData` — **not** `jsonRequest` (which forces `Content-Type: application/json`)  
- Consistent `{ ok, status, data, message }` response shape  
- Exposed on default `api` object as `api.menuImport`

---

# Track B — Phase 0: In Progress

### Status

Phase 0 data collection is underway. A working document has been created at:

`docs/individual/jeff-perdue/ontology/phase0_prompts.md`

### Structure

- 20–30 allergen-related prompts written across four failure categories  
- LLM responses being recorded from **Gemini 2.5 Flash** and **ChatGPT**  
- Failures being categorized into the taxonomy  

---

### Four Failure Categories

1. Overconfident Safety  
2. Omission-as-Absence  
3. Cross-Contact Blindness  
4. Preparation-Context Blindness  

---

# Track B — Phase 0: Deliverables Pending

### Two Docs to Be Produced

**Allergen Safety Failure Taxonomy**  
Each failure category defined with examples drawn from recorded LLM responses.

**Structural Evidence Requirements**  
For each failure type: what structured knowledge (using Phase 1 concepts — `ExposureState`, `CrossContactSource`, `PreparationContext`, etc.) would have prevented the failure.

These docs form the direct justification for the Phase 1 ontology build in Week 12.

---

# Outcomes vs Week 11 Plan

| Deliverable | Status |
|---|---|
| File parsing libraries installed | ✅ Complete |
| `menuImportController.js` — full implementation | ✅ Complete |
| `menuImportRoutes.js` — created and mounted | ✅ Complete |
| `menuParseService.js` — lazy-init bug fixed | ✅ Complete (unplanned fix) |
| End-to-end file import tested (CSV) | ✅ Complete |
| `menuImportApi` wired in client | ✅ Complete |
| Track B Phase 0 — prompts + LLM data collection | 🔄 In Progress |
| Track B Phase 0 — Taxonomy + Evidence docs | 🔜 Completing this week |

---

# Week 11 Milestone Status

> **Planned:** Server can receive a file, parse it, and return structured items. Phase 0 deliverables complete.

- Server receives file, extracts text, returns structured items ✅  
- Phase 0 prompt collection underway 🔄  
- Phase 0 deliverable docs: in progress 🔜  

**Track A milestone: fully met.**  
Track B carries into the final days of Week 11.

---

# Looking Ahead — Week 12

### Track A — Import Review UI

- New `ImportMenuFlow` component — modal with File / URL / Manual tabs  
- Import review screen — editable parsed items with allergen confirmation  
- User can deselect items, edit any field, then bulk-save  
- Server-side `GET /api/menu/import/url` — fetch + `cheerio` text extraction  

### Track B

- Complete Phase 0 deliverables  
- Begin Phase 1 — Core Exposure-State Ontology draft  

**Week 12 Milestone:** End-to-end file import works; URL parsing with fallback; Phase 1 ontology draft started.
