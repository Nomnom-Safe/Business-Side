# Week 14 Track A Demo Validation Checklist

## Purpose

Validate that the final Sprint 2 demo path is deterministic and resilient with production-like inputs.

## Environment Preconditions

- Server running on `http://localhost:5000`
- Client running on `http://localhost:3000`
- `DEV_DEMO_MODE=true` confirmed for local demo stability
- User can navigate to `Menu Items` and then `Import menu`

## Scenario A — Clean CSV (Expected Success)

- Input: one clean CSV with 10+ items and explicit prices/categories
- Expected:
  - import succeeds with mostly valid rows
  - review page loads with editable rows
  - save result shows: `X menu items were successfully added to {Menu Name}`
  - saved items appear on the target menu page

## Scenario B — Noisy PDF (Expected Partial / Warning)

- Input: one noisy PDF with uneven formatting and sparse fields
- Expected:
  - file accepted if text-extractable
  - low-confidence warning may appear in review state
  - invalid/duplicate badges appear where appropriate
  - user can edit/select and save valid rows only

## Scenario C — URL Expected to Fail (Graceful Fallback)

- Input: one URL that is blocked/unreachable/private or intentionally invalid
- Expected:
  - clear user-facing error appears
  - fallback actions visible: upload file / add manually
  - no crash or blank state

## Scenario D — URL Expected to Succeed

- Input: one static public menu-like page with parseable text
- Expected:
  - import succeeds
  - review table/card view appears
  - save works and items visible in menu

## Accessibility Smoke Checks

- Tab through File/URL/Manual controls and primary action buttons
- Ensure loading/progress messages are announced (`aria-live`)
- Verify alerts and warnings are readable and persistent long enough for review

## Final Sign-off

- [ ] Scenario A passed
- [ ] Scenario B passed
- [ ] Scenario C passed
- [ ] Scenario D passed
- [ ] Accessibility smoke checks passed
- [ ] No blocker regressions in manual CRUD/search/filter/sort

