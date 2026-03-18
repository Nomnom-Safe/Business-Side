# Cursor Handoff — Gemini AI Integration (Sprint 2)

## Context

This is a capstone project called NomNomSafe — a food allergen safety app for restaurant businesses. The project has a React client (`client/`) and a Node/Express server (`server/`), backed by Firestore.

In Sprint 2, we added AI-assisted menu import functionality. The goal is to let business users upload a menu file (PDF, CSV, DOCX) or paste a URL, have the text extracted and sent to an LLM, and receive a structured list of menu items back for review before saving to the database.

This handoff covers the AI integration layer specifically.

---

## What Was Added

### `server/src/services/menuParseService.js`

This is the core AI integration file. It:
- Accepts extracted plain text from a menu document or web page
- Sends it to the Gemini API (`gemini-2.5-flash`) with a structured extraction prompt
- Returns a parsed JSON array of menu items in the shape:
  `{ name, description, ingredients, price, category, possible_allergens[] }`

Key design decisions:
- `temperature: 0.1` — low temperature for deterministic, structured output
- The prompt explicitly instructs the model to only surface allergens that are textually present in the source, never inferred. This enforces R2.8 (allergen data must never be assumed without human review).
- The response is cleaned of markdown code fences before parsing, since models sometimes wrap JSON in backticks despite being told not to.
- The provider is controlled by a `LLM_PROVIDER` environment variable (`gemini` | `openai` | `anthropic`), making it swappable for Track B research without code changes.

### `server/src/controllers/menuImportController.js`

Handles the import endpoints. It:
- Receives file uploads (via multipart) or a URL
- Extracts text using the appropriate parser (`pdf-parse`, `mammoth`, `csv-parse`, `axios` + `cheerio`)
- Passes extracted text to `menuParseService.parseMenuText()`
- Returns the structured items array to the client, or a graceful error with a fallback suggestion if parsing fails (R2.7)

### `server/src/routes/menuImportRoutes.js`

Registers two routes:
- `POST /api/menu/import/file` — file upload
- `GET /api/menu/import/url` — URL fetch

---

## Environment Variables Required

These must be present in `server/.env`:

```
GEMINI_API_KEY=your_key_here
LLM_PROVIDER=gemini
```

The SDK used is `@google/genai` (the current official Google Gen AI SDK — not the legacy `@google/generative-ai`).

---

## What Still Needs to Be Built (Sprint 2 Remaining)

The service and controller are implemented. What connects to them on the client side is still in progress:

1. `ImportMenuFlow` component — the entry point UI with three tabs (file upload, URL paste, manual)
2. `ImportReviewScreen` component — displays parsed items, allows editing each field, requires explicit allergen confirmation before saving
3. Bulk save wiring — `POST /api/menu-items` (bulk) from the review screen to `menuItemController.js`

The client-side API call to the import endpoints should be added to `client/src/api/index.js` following the existing pattern there.

---

## Critical Constraints to Preserve

- **Allergen data must never be auto-saved.** The `possible_allergens` array from the LLM is always surfaced for explicit human confirmation in the review UI before any save occurs. This is a safety requirement (R2.6, R2.8), not a UX preference.
- **LLM failures must not block the user.** Any error from the parse service should return a user-readable message and suggest manual entry as a fallback.
- **The provider switch (`LLM_PROVIDER`) must remain functional.** Track B research compares LLM behavior across providers on allergen reasoning tasks. Do not hardcode the provider.
