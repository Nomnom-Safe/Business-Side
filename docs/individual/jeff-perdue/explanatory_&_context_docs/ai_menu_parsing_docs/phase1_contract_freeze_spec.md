# Track A Phase 1 Contract Freeze Specification

## Purpose

This document freezes the Track A Phase 1 API and data contracts so implementation can proceed without schema churn. It defines canonical structures, response envelopes, validation rules, limits, error taxonomy, and traceability requirements for menu import.

Phase 1 is complete when these contracts are stable, documented, and implemented consistently across backend, frontend integration points, and tests.

## Scope

This contract applies to:

- file-based import parsing
- URL-based import parsing
- parse/review payloads returned to the UI
- standardized error handling and fallback messaging
- request traceability and logging

This contract does not define final review UI behavior details or bulk save endpoint payloads beyond parse output shape.

## Canonical Parsed Item Schema

Each parsed item MUST conform to the following canonical shape:

- `name`: required string
- `description`: optional string
- `ingredients`: required `array<string>`
- `price`: nullable number
- `category`: required string (default `"Uncategorized"` when missing)
- `possible_allergens`: `array<string>` (free text suggestions only; untrusted)

### Field Semantics

- `name` is the primary human-readable item label and must be non-empty after trim.
- `description` is optional and may be omitted or set to empty string.
- `ingredients` stores normalized ingredient tokens as strings, not a single concatenated string.
- `price` is nullable to support menus without explicit pricing.
- `category` must always be present in final output, using default fallback when needed.
- `possible_allergens` is suggestion-only metadata and MUST NOT be treated as confirmed allergen truth.

## Parse Response Envelope (Option B: Partial Success)

Top-level parse request success means the import pipeline executed successfully, even when some rows are non-importable.

### Top-Level Response Fields

- `success`: boolean
- `partial`: boolean (required when `success: true`)
- `correlationId`: string
- `items`: array of row result objects (required when `success: true`)
- `summary`: object with aggregate counts (required when `success: true`)
- `error`: user-readable message (required when `success: false`)
- `fallback`: user-guidance next step (required when `success: false`)
- `code`: machine-readable error code (required when `success: false`)

### Row-Level Parse Status

Each row in `items` MUST include:

- `status`: one of `valid`, `invalid`, `duplicate`
- `item`: canonical parsed item object when parseable enough to review
- `issues`: array of issue descriptors (can be empty for `valid`)

`partial` MUST be set to `true` when one or more rows are `invalid` or `duplicate`.  
`partial` MUST be `false` only when all rows are `valid`.

## Deduplication Rule

Deduplication key is normalized `name + category`:

- normalize by trim, lowercase, collapse internal whitespace
- compare normalized key against rows in the same parse response
- do NOT auto-drop duplicates
- mark duplicates as `status: "duplicate"` and include issue metadata for user review

This preserves operator control while preventing silent duplicate insertion.

## Validation and Normalization Rules

Validation is enforced at the server boundary after extraction and parse, before response is returned.

### String and Structural Rules

- trim all string fields
- reject/flag empty required values after trim
- enforce field length limits (see Limits section)
- remove blank ingredient entries
- preserve user-visible text fidelity while normalizing obvious whitespace noise

### Numeric Rules

- normalize price by removing currency symbols and parsing decimal representation
- if parse fails, set `price` to `null` and add a row issue
- do not coerce invalid numbers into arbitrary defaults

### Category Rules

- if missing or blank after trim, set to `"Uncategorized"`

### Allergen Rules

- `possible_allergens` remains free text in Phase 1
- values are suggestions only
- API and UI must continue to treat this field as untrusted until explicit human confirmation

## Request Correlation ID Contract

Correlation IDs are used for traceability and debugging.

### Request Handling

- server accepts optional incoming `X-Correlation-Id`
- if absent, server generates a new correlation ID
- server echoes the final correlation ID in response header `X-Correlation-Id`
- response body includes `correlationId`

### Logging Requirement

All import-stage logs MUST include `correlationId`:

- request received
- extraction started/completed
- parsing started/completed
- validation completed
- response emitted (success/partial/failure)

## Limits (Phase 1 Defaults)

- max upload size: `5 MB`
- max extracted text length sent to parser: `120000` characters
- max parsed items returned: `300`
- `name` max length: `120`
- `description` max length: `1000`
- `category` max length: `80`
- each `ingredient` max length: `80`
- max ingredients per item: `40`
- each `possible_allergen` max length: `60`
- max `possible_allergens` per item: `20`

When a limit is exceeded, API returns standardized error envelope or row-level issue depending on whether violation is request-level or row-level.

## Standard Error Code Taxonomy

The following codes are canonical for Phase 1:

- `IMPORT_NO_FILE`
- `IMPORT_UNSUPPORTED_FILE_TYPE`
- `IMPORT_FILE_TOO_LARGE`
- `IMPORT_TEXT_EXTRACTION_FAILED`
- `IMPORT_EMPTY_EXTRACTED_TEXT`
- `IMPORT_URL_FETCH_FAILED`
- `IMPORT_URL_BLOCKED_HOST`
- `IMPORT_URL_TIMEOUT`
- `IMPORT_PARSE_TIMEOUT`
- `IMPORT_PARSE_PROVIDER_ERROR`
- `IMPORT_INVALID_RESPONSE_FORMAT`
- `IMPORT_VALIDATION_FAILED`
- `IMPORT_ITEM_LIMIT_EXCEEDED`
- `IMPORT_INTERNAL_ERROR`

## Error Envelope Contract

For pipeline-level failures:

- `success` MUST be `false`
- `code` MUST be present and from canonical taxonomy
- `error` MUST be user-readable and non-empty
- `fallback` MUST provide actionable next step
- `correlationId` MUST be present

## Backward Compatibility and Churn Control

- This contract is authoritative for Phase 1 and Phase 2 build start.
- Any contract changes after freeze must be explicitly versioned and documented before implementation.
- UI and tests should be built against this frozen contract to avoid rework.

## Phase 1 Acceptance Checklist

- canonical schema is implemented and documented
- Option B partial-success envelope is implemented (`success + partial + row status`)
- duplicate rows are flagged for review, not auto-removed
- correlation ID policy is implemented end-to-end
- limits are enforced consistently
- error taxonomy is applied across file and URL flows
- automated tests cover happy path, partial path, and canonical failure paths
