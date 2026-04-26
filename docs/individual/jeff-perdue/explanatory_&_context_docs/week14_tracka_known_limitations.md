# Week 14 Track A Known Limitations

## Scope Freeze Context

Track A scope is frozen at Week 14 with emphasis on resilient single-menu import and review workflows.

## Known Limitations (Presentation-Ready)

1. **Single-menu assumption remains active**
   - Multi-menu targeting is intentionally deferred (Phase 4 skipped).
   - Import always resolves to the current business menu context.

2. **No OCR pipeline for scanned PDFs**
   - Image-only/scanned PDFs without selectable text cannot be parsed directly.
   - Fallback path is CSV/DOCX/manual entry.

3. **Import progress is stage-based, not byte-accurate**
   - UI shows meaningful stage updates (upload/extract/parse/save) but not true stream progress.

4. **In-memory rate limiting in current implementation**
   - Import rate-limiter state resets on server restart.
   - Sufficient for local/demo; production would use shared/distributed storage.

5. **Telemetry currently local and process-scoped**
   - Counters and median latency are logged and held in-process.
   - Not yet exported to an external metrics stack.

6. **URL import optimized for static pages**
   - Dynamic JS-rendered menus may fail extraction depending on server-side HTML content.

7. **Client-side automated tests for import UI are still limited**
   - Core backend coverage is strong; import UI relies primarily on build checks and manual QA.

## Mitigations in Place

- Standardized error envelopes + fallback CTAs
- Correlation IDs for traceability
- Parse quality warnings and no-valid-row guardrails
- Idempotent save workflow
- Human acknowledgment gating for allergen suggestions (R2.8)

