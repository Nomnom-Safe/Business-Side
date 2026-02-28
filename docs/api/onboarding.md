# Onboarding API Contract

## POST /api/businesses (create business)

Used when the user completes onboarding (single create at final submit). **No `menuLayout`** is sent in onboarding.

### Request body

- **name** (string, required)
- **website** (string, optional; default `'None'`)
- **address_id** (string, optional) — ID of an existing address document
- **address** (object, optional) — Option B: structured address; server creates an address document and uses its ID. Exactly one of `address_id` or `address` must be provided when creating a business during onboarding.
  - **street** (string, required)
  - **city** (string, required)
  - **state** (string, required; US state abbreviation, e.g. `"KY"`)
  - **zipCode** (string, required; format `#####` or `#####-####`)
- **allergens** (array of strings, optional; default `[]`)
- **diets** (array of strings, optional; default `[]`)

Other fields (hours, phone, disclaimers, cuisine) have schema defaults and are not required for onboarding.

### Response

- **201**: Created. Response body is the created business (with menus), including `address_id`. Address details can be resolved via GET /api/businesses/:id (returns `address` when resolved).
- **400**: Validation error (e.g. missing address, duplicate business name, invalid address shape).

### Onboarding flow (Option B)

1. Client collects name, website, and structured address (street, city, state, zipCode) in Step A; optionally allergens/diets in Step B.
2. On final submit: client may either send **address** (structured) in the create payload, or call **POST /api/addresses** first and send **address_id** in the create payload. This document describes the server accepting **address** (structured) on create; the server then creates the address document and links the business via `address_id`.

## Places prefill (optional)

- **GET /api/places/autocomplete?input=...&sessionToken=...** — Returns `{ predictions: [{ place_id, description }] }`. API key is server-only (env: `GOOGLE_PLACES_API_KEY` or `PLACES_API_KEY`).
- **GET /api/places/details?place_id=...** — Returns prefill payload: `{ name, website, address: { street, city, state, zipCode } }`. Mapping: Google Place Details `name` → `name`, `website` → `website`, `address_components` (street_number + route → street, locality → city, administrative_area_level_1 → state, postal_code → zipCode) → `address`. If `address_components` is missing, `formatted_address` is parsed as fallback. Only this normalized payload is used in the form; raw place data is not stored.
