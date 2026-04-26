# Track A Robust-First Implementation Plan (Post Week 11)

## Purpose

Deliver Track A end-to-end with high correctness and resilience on first implementation:
- reliable import paths (file + URL),
- safe human-in-the-loop review,
- clear fallback behavior,
- comprehensive validation and tests before polish/demo.

## Current Baseline (Completed)

- Week 10:
  - Sprint 2 scope + requirements completed.
  - LLM provider architecture decided and made swappable.
  - `menuParseService.js` implemented.
  - `menuImportController.js` scaffolded.
- Week 11:
  - `pdf-parse`, `mammoth`, `csv-parse`, `multer` wired.
  - `POST /api/menu/import/file` implemented and tested.
  - `menuImportRoutes.js` mounted.
  - `menuParseService` env-init bug fixed.
  - `menuImportApi.importFile` wired in client.

---

## Step-by-Step Plan (What remains for Track A)

## Phase Status Check (Post Week 12 Reality)

Track A is now beyond the original Week 12 target. The following are already implemented in the codebase:
- file + URL import endpoints with standardized envelopes and correlation IDs,
- review/edit/select UX with allergen confirmation gating,
- bulk save with idempotency,
- improved import-result UX and menu context handling,
- SSRF baseline protections for URL import.

Therefore Week 13 should focus on reliability hardening, observability, and abuse controls rather than rebuilding core flow.

## Phase 1 — Lock Contracts First (Do this before UI build)

1. Freeze canonical import item schema (single source of truth):
   - `name` (required, string)
   - `description` (optional string)
   - `ingredients` (array<string> or normalized string -> choose one and lock)
   - `price` (nullable number, normalized)
   - `category` (string, default “Uncategorized”)
   - `possible_allergens` (array<string>, suggestions only)
2. Define and document API response envelopes:
   - success shape for file/url parse,
   - standardized error shape (`success/error/fallback/code`),
   - partial-success behavior if only some items parse.
3. Add explicit validation rules at server boundary:
   - trim/length limits,
   - numeric parsing behavior,
   - max items returned,
   - dedupe rules by normalized name + category.
4. Add request correlation IDs to import requests for traceability in logs.

**Exit criteria:** API behavior and schema are stable enough that UI can be built once.

---

## Phase 2 — Week 12 Core Build (ImportMenuFlow + Review)

5. Implement `ImportMenuFlow` entry surface with 3 tabs:
   - File upload,
   - URL import,
   - Manual entry shortcut.
6. Build URL endpoint `GET /api/menu/import/url` (or `POST` if you need body payload):
   - fetch with timeout + user-agent,
   - extract meaningful text with `cheerio`,
   - strip nav/footer/noise,
   - pass extracted text through `menuParseService`.
7. Add URL failure fallback UX:
   - explicit “couldn’t read this page” message,
   - “upload file instead” and “add manually” CTAs.
8. Build Import Review screen:
   - parsed rows editable inline,
   - row-level select/deselect,
   - row-level validation badges,
   - allergen suggestions shown as untrusted suggestions.
9. Enforce human confirmation rule (R2.8) in UI:
   - require explicit user acknowledgement per allergen field before save,
   - prevent one-click blind accept-all import.
10. Implement bulk save path:
   - send only selected rows,
   - support partial-save reporting (success/fail rows),
   - idempotency guard to prevent duplicate submit on retry.

**Exit criteria:** upload/url -> parse -> review/edit/select -> bulk-save works end-to-end.

---

## Phase 3 — Week 13 Robustness Hardening (Primary quality gate)

11. Add strict input guards:
   - MIME allowlist and extension cross-check,
   - size cap + text-length cap,
   - reject encrypted/unreadable PDFs with clear error.
12. Add timeout and retry strategy:
   - LLM timeout ceiling,
   - one safe retry for transient failures,
   - no retry on validation failures.
13. Add empty/low-quality parse handling:
   - “0 items parsed” dedicated UX state,
   - “low confidence parse” warning when many fields missing.
14. Add normalization pipeline:
   - normalize currency symbols and decimal format,
   - normalize allergen names to controlled vocabulary mapping,
   - trim duplicates and blank ingredients.
15. Add observability:
   - structured logs for each import stage,
   - counters (attempts/success/fail-by-reason),
   - median parse latency tracking.
16. Add security checks:
   - input sanitization for rendered text in review UI,
   - SSRF protections for URL import (block private/local addresses),
   - rate limiting on import endpoints.

**Exit criteria:** failure modes are handled cleanly and safely; no silent bad saves.

### Week 13 execution notes (updated)

- Keep single-menu assumption for Sprint 2; defer multi-menu to stretch only.
- Prioritize production-grade behavior over UI expansion:
  - parse timeout + transient retry,
  - dedicated zero-valid-items error state,
  - low-confidence parse warning signal,
  - import telemetry counters + latency snapshot,
  - route-level import rate limiting.

---

## Phase 4 — Week 13 Stretch (Only if Phase 3 passes)

17. Re-enable multiple-menu support in `MenuDashboard`:
   - unarchive add/delete menu code,
   - ensure import target menu selection is explicit,
   - block import if no target menu chosen.
18. Add migration/compat checks for existing businesses with single-menu assumptions.

**Exit criteria:** multi-menu is stable and does not regress existing flows.

---

## Phase 5 — Week 14 Final Polish + Demo Readiness

19. UX polish pass:
   - loading/progress states for each import stage,
   - clearer microcopy for errors/fallbacks,
   - keyboard and screen-reader accessibility checks.
20. Full regression run on manual CRUD/search/filter/sort (protect Sprint 1 value).
21. Demo script validation on production-like seed files:
   - one clean CSV,
   - one noisy PDF,
   - one URL expected to fail (to show graceful fallback),
   - one URL expected to succeed.
22. Freeze feature scope and create “known limitations” list for presentation honesty.

**Exit criteria:** demo path is deterministic and resilient under normal errors.

### Week 14 execution notes (in progress)

- Added stage-based loading/progress messaging and improved import microcopy in `ImportMenuFlow`.
- Added accessibility-oriented status messaging (`aria-live`) and panel busy states.
- Created demo validation checklist:
  - `week14_demo_validation_checklist.md`
- Created scope-freeze known limitations list:
  - `week14_tracka_known_limitations.md`

---

## Test Plan (Robust on first implementation)

## Backend tests
- Unit tests:
  - parser selection by MIME,
  - text extraction transforms,
  - schema normalization/validation,
  - LLM response parsing (including markdown-fenced JSON),
  - error envelope consistency.
- Integration tests:
  - `/api/menu/import/file` happy path for PDF/CSV/DOCX,
  - no-file/unsupported-type/oversize/empty-text,
  - LLM timeout/failure path,
  - `/api/menu/import/url` success/failure/blocked-host cases.

## Frontend tests
- Component tests:
  - tab switching,
  - upload state transitions,
  - edit/select/deselect behavior,
  - allergen confirmation gating,
  - bulk-save with partial row failures.
- End-to-end tests:
  - file import full success,
  - URL fallback flow,
  - duplicate submit prevention,
  - accessibility smoke checks.

## Manual QA checklist
- Validate at least 10 real-world menus with mixed quality.
- Verify no allergen suggestion is persisted without explicit user confirmation.
- Verify safe fallback always offers manual path.

---

## Definition of Done (Track A)

Track A is “done” only when all are true:
- File import is stable across PDF/CSV/DOCX.
- URL import works for static pages and fails gracefully otherwise.
- Review/edit/select/bulk-save works without data corruption.
- R2.7 and R2.8 are enforced in both API and UI behavior.
- Automated tests cover core happy paths + critical failures.
- Demo path is rehearsed and repeatable.

---

## Risk Controls (First-Implementation Correctness)

- Keep provider-swappable abstraction untouched (no provider-specific leakage into controllers/UI).
- Avoid schema churn after Phase 1 contract freeze.
- Treat model output as untrusted input; always validate/normalize.
- Ship with explicit limits (file size, text size, item count, request timeout).
- Prefer explicit user-confirmed safety data over automation convenience.