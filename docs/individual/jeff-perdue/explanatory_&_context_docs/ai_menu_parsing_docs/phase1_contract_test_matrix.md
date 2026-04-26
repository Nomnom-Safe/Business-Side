# Track A Phase 1 Contract Test Matrix

## Purpose

This matrix maps each frozen Phase 1 contract requirement to concrete test coverage. It is intended to prevent contract drift and ensure backend/frontend behaviors stay aligned.

## Usage

- Unit tests validate normalization, validation, and envelope construction.
- Integration tests validate endpoint behavior and status codes.
- Frontend/component tests validate handling of `partial`, row statuses, and fallback UX.

## Matrix

| Contract Requirement | Test Type | Test Scenario | Expected Result |
|---|---|---|---|
| Canonical schema includes `ingredients: array<string>` | Unit | Parse output includes `ingredients` as array, not string | Schema validation passes only with array |
| `possible_allergens` accepts free text suggestions | Unit | Parse output contains non-standard allergen phrase | Value is retained as free text suggestion |
| Missing category defaults to `"Uncategorized"` | Unit | Parsed row has blank/missing category | Response item category set to `"Uncategorized"` |
| Required `name` must be non-empty after trim | Unit | Row has whitespace-only name | Row marked `invalid` with issue on `name` |
| Price normalization sets `null` when unparseable | Unit | Price input is non-numeric text | `price` becomes `null`; issue recorded |
| Duplicate detection uses normalized `name + category` | Unit | Same name/category with case and whitespace variation | Later row marked `duplicate` |
| Duplicate rows are not auto-dropped | Unit | Duplicate detected in parse set | Duplicate row retained with `duplicate` status |
| Option B response envelope on mixed rows | Integration | Parse returns valid + invalid + duplicate rows | `success: true`, `partial: true`, summary counts accurate |
| Full valid parse response | Integration | All rows valid | `success: true`, `partial: false`, all statuses `valid` |
| Pipeline failure uses standardized error envelope | Integration | Unsupported file type upload | `success: false` with canonical `code/error/fallback/correlationId` |
| Canonical code `IMPORT_NO_FILE` | Integration | Request sent with no file | 400 response, code is `IMPORT_NO_FILE` |
| Canonical code `IMPORT_FILE_TOO_LARGE` | Integration | Upload exceeds max size | 400 response, code is `IMPORT_FILE_TOO_LARGE` |
| Canonical code `IMPORT_EMPTY_EXTRACTED_TEXT` | Integration | Extracted text is empty | 400 response with fallback guidance |
| Canonical code `IMPORT_PARSE_TIMEOUT` | Integration | Simulated parse timeout | Timeout response with canonical code |
| Canonical code `IMPORT_PARSE_PROVIDER_ERROR` | Integration | Simulated provider error | 500-class response with canonical code |
| Max extracted text length enforced | Integration | Extraction exceeds `120000` chars | Request-level failure or safe truncation path per implementation rule |
| Max parsed items enforced (`300`) | Integration | Parse returns more than 300 items | `IMPORT_ITEM_LIMIT_EXCEEDED` or bounded response per rule |
| Correlation ID accepted from client | Integration | Request contains `X-Correlation-Id` | Same ID echoed in response header and body |
| Correlation ID generated when missing | Integration | Request omits correlation header | Server-generated ID present in header and body |
| Correlation ID logged in all import stages | Integration / Logging | Execute import through full pipeline | Structured logs contain same ID at each stage |
| Client handles partial parse for review | Frontend component | API returns `partial: true` with mixed statuses | UI renders row badges and review actions correctly |
| Client handles duplicate rows for review | Frontend component | API includes `duplicate` row | Duplicate indicator shown; row remains editable/selectable per UX rules |
| Client handles pipeline failure fallback | Frontend component | API returns `success: false` with fallback | Error + fallback CTA displayed |
| URL timeout taxonomy handling | Integration | URL fetch timeout | `IMPORT_URL_TIMEOUT` with fallback guidance |
| URL blocked host taxonomy handling | Integration | URL points to blocked/private host | `IMPORT_URL_BLOCKED_HOST` returned |

## Minimum Phase 1 Coverage Gate

Phase 1 should not be marked complete unless:

- all canonical envelope tests pass
- all correlation ID tests pass
- all limit enforcement tests pass
- duplicate review behavior is validated end-to-end
- at least one successful full parse, one partial parse, and one pipeline failure path are covered in integration tests

## Suggested Test Naming Convention

- `import.file.success.full.spec`
- `import.file.success.partial.spec`
- `import.file.failure.unsupported-type.spec`
- `import.url.failure.timeout.spec`
- `import.validation.duplicate-detection.spec`
- `import.trace.correlation-id.spec`

Consistent naming keeps contract coverage discoverable as the suite grows.
