# Sprint 2 — Week 11 Plan & Step-by-Step Guide

**ASE 485 – Capstone Project**
Jeff Perdue | Week 11 (3/23–3/29)

---

## Context: What Week 10 Left You

You are **ahead of schedule** in Track A, but two items carried over:

- **Track A:** `menuParseService.js` is done. `menuImportController.js` is a scaffold only — accepts pre-extracted text, no file parsing libraries wired, no routes file, not mounted in `server.js`, no API client call.
- **Track B:** Phase 0 (allergen prompt collection) was not started.

---

## Week 11 Step-by-Step

### Step 1 — Get Your Gemini API Key

`server/.env` has `GEMINI_API_KEY=your_actual_key_here`. Replace the placeholder before anything else.

1. Go to [aistudio.google.com](https://aistudio.google.com) and sign in with a Google account.
2. Click **Get API key → Create API key**.
3. Copy the key and paste it into `server/.env`:
   ```
   GEMINI_API_KEY=AIza...your-real-key...
   LLM_PROVIDER=gemini
   ```
4. Reference `docs/gemini-local-setup.md` for the full teammate onboarding flow if needed.

---

### Step 2 — Install the File Parsing Libraries

In the `server/` directory, install all required libraries:

```bash
cd Business-Side/server
npm install pdf-parse csv-parse mammoth multer
```

> `multer` handles multipart file uploads in Express — it is not yet in `package.json` and is required for `POST /api/menu/import/file`.

---

### Step 3 — Complete `menuImportController.js`

The current scaffold only accepts pre-extracted text (`req.body.text`). Expand it to:

1. Accept a raw file upload via `multer`
2. Detect the file type by MIME type
3. Extract plain text using the appropriate library:
   - PDF → `pdf-parse`
   - DOCX → `mammoth`
   - CSV → `csv-parse`
4. Pass extracted text to `parseMenuText()` (already works in `menuParseService.js`)
5. Return the structured items array

Preserve the existing **R2.7** error/fallback shape:
```json
{
  "success": false,
  "error": "We couldn't parse this menu automatically.",
  "fallback": "Try uploading a different file format, or add items manually."
}
```

File location: `server/src/controllers/menuImportController.js`

---

### Step 4 — Create `menuImportRoutes.js`

This file does not exist yet. Create `server/src/routes/menuImportRoutes.js`:

1. Configure `multer` with memory storage (no disk I/O needed at capstone scale)
2. Register `POST /file` — applies the multer middleware, calls `importFromFile`
3. Export the router

---

### Step 5 — Mount the Route in `server.js`

Open `server/server.js` and add the new route after the existing menu routes:

```js
const menuImportRoutes = require('./src/routes/menuImportRoutes');
app.use('/api/menu/import', menuImportRoutes);
```

This makes the endpoint live at `POST /api/menu/import/file`.

---

### Step 6 — Test the Endpoint Manually

Before touching the client, verify the server works end-to-end:

1. Start the server: `npm run dev` in `server/`
2. Use **Postman**, **Insomnia**, or `curl` to send a `POST /api/menu/import/file` with a multipart form field named `file` containing a real PDF, CSV, or DOCX menu.
3. Confirm the success response shape:
   ```json
   {
     "success": true,
     "items": [
       { "name": "...", "description": "...", "ingredients": "...", "price": 0.00, "category": "...", "possible_allergens": [] }
     ]
   }
   ```
4. Test an intentionally malformed/unsupported file to confirm the R2.7 fallback fires correctly.

---

### Step 7 — Wire the API Client in `client/src/api/index.js`

The file-upload call cannot use the existing `jsonRequest` helper (it sends `application/json`, not `multipart/form-data`). Add a `menuImportApi` export using a direct `fetch` with `FormData`:

```js
export const menuImportApi = {
  importFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Do NOT set Content-Type — browser sets it with the boundary automatically
    const response = await fetch(`${API_BASE_URL}/api/menu/import/file`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  },
};
```

Then add `menuImport: menuImportApi` to the default export object at the bottom of the file.

---

### Step 8 — Track B: Phase 0 Data Collection

Goal: produce the **Allergen Safety Failure Taxonomy** doc and the **Structural Evidence Requirements** doc by end of week.

1. Create a doc at `docs/individual/jeff-perdue/ontology/phase0_prompts.md`.
2. Write **20–30 allergen-related prompts** spanning diverse scenarios. Cover at minimum:
   - Shared fryer ("are the fries gluten-free?")
   - "May contain" language
   - Oil/butter ambiguity
   - Cross-contact in prep
   - Missing prep context ("is the sauce dairy-free?")
3. Run each prompt against **Gemini 2.5 Flash** and at least one other LLM (e.g. ChatGPT).
4. Record results in a structured table: `prompt | response | failure category`.
5. Classify each failure into one of the four taxonomy categories:
   - Overconfident safety
   - Omission-as-absence
   - Cross-contact blindness
   - Preparation-context blindness
6. Produce the two output docs:
   - **Allergen Safety Failure Taxonomy** — each category defined with examples from recorded data
   - **Structural Evidence Requirements** — for each failure type, what structured knowledge would have prevented it

Reference `docs/individual/jeff-perdue/explanatory_&_context_docs/ontology_roadmap.md` for prior research context.

---

### Step 9 — UX Polish (carried from Week 10, lower priority)

If time allows after Steps 1–8:

- Review `AddMenuItem` and `MenuItemPanel` for inline feedback gaps and accessibility issues
- Add loading states, success/error toasts, or resolve any friction points from the Week 10 UX audit

---

## Week 11 Milestone Checklist

| # | Item | Done? |
|---|------|-------|
| 1 | Real `GEMINI_API_KEY` in `server/.env` | ☐ |
| 2 | `pdf-parse`, `csv-parse`, `mammoth`, `multer` installed | ☐ |
| 3 | `menuImportController.js` — full file extraction logic | ☐ |
| 4 | `menuImportRoutes.js` — created with multer + POST /file | ☐ |
| 5 | `server.js` — route mounted at `/api/menu/import` | ☐ |
| 6 | Endpoint tested manually (PDF + CSV + DOCX + error case) | ☐ |
| 7 | `menuImportApi` added to `client/src/api/index.js` | ☐ |
| 8 | Phase 0 prompts collected and LLM responses recorded | ☐ |
| 9 | Allergen Safety Failure Taxonomy doc produced | ☐ |
| 10 | Structural Evidence Requirements doc produced | ☐ |

---

## Week 11 Milestone (from sprint2_plan.md)

> **Server can receive a file, parse it, and return structured items. Phase 0 deliverables complete.**
