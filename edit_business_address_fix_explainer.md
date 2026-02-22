# Edit Business Info: Address Not Populating — Fix Summary


**Scope:** Why the address fields were empty on the Edit Business Information page and how we fixed it.

---

## In a Nutshell

- **Problem:** On Edit Business Information, name and website showed up but Street, City, State, and ZIP were blank.
- **Cause:** Some businesses had a full address sentence stored in `address_id` (e.g. `"123 doc st, Bakersfield, CA 14251"`) instead of an ID that points to a document in the `addresses` collection. The app tried to load an address by that string as if it were a document ID, got nothing back, and the form stayed empty.
- **Fix:** The server now “resolves” the address when you fetch a business: if `address_id` is a real address doc ID it returns that address; if it’s legacy free text it parses it into street/city/state/zip and includes that in the same response. The edit page uses this resolved address so the form fills in. On save, if `address_id` was legacy text we create a real address document and point the business at it, so the data is correct after the first save.

---

## The Problem (More Detail)

1. **User → business is fine.** The logged-in user is linked to a business via `business_id` on the business user document. The edit page gets the business with `GET /api/businesses/:id` using the business ID from localStorage, so the business loads and name/website come from there.

2. **Business → address was broken for some data.** The design is: `business.address_id` should be the **ID** of a document in the `addresses` collection. The client then called `GET /api/addresses/{address_id}` to load street, city, state, zip.

3. **For some businesses, `address_id` was not an ID.** In Firestore, `address_id` had been stored as a **full address string** (e.g. `"123 doc st, Bakersfield, CA 14251"`). When the client requested `GET /api/addresses/123 doc st, Bakersfield, CA 14251`, the server looked for a Firestore document with that exact string as its document ID. No such document exists, so the server returned nothing and the address fields on the form stayed empty.

So the issue was **what was stored in `address_id`** (free text vs. a reference), not a missing link between user, business, and address.

---

## The Solution

### Server

- **When we return a business** (`GET /api/businesses/:id`), we now resolve the address in one place:
  - If `address_id` is a valid address document ID, we fetch that document and add an **`address`** object to the response with `street`, `city`, `state`, `zipCode` (and `id` when it’s a real doc).
  - If `address_id` is not a valid document ID but looks like legacy free text (e.g. contains a comma), we **parse** it into street, city, state, zip and include that same **`address`** shape in the response (no `id` for parsed legacy).
- The client gets **one response** that can include both business and address, so it doesn’t need a second request that could fail for legacy data.

### Client (Edit Business Information page)

- **On load:** If the API response includes `response.data.address`, we use it to fill the address fields. If not (e.g. older API), we still fall back to calling `api.addresses.getById(business.address_id)` like before.
- **On save:** If there’s no `address_id` or if `address_id` looks like legacy text (e.g. contains a comma), we **create** a new address document and then update the business’s `address_id` to that new document’s ID. Otherwise we **update** the existing address document. So the first save “normalizes” the data: after that, `address_id` always points to a real address document.

---

## What Changed (By File)

| Where | File | What we did |
|-------|------|-------------|
| **Server** | `server/src/controllers/businessController.helpers.js` | Added `parseLegacyAddressString(value)` to turn a free-text address string into `{ street, city, state, zipCode }`. Added `getResolvedAddress(business)` to fetch the address doc by `address_id` or, if that fails and the value looks like legacy text, parse it. Updated `mapBusinessResponse(business, resolvedAddress)` so it can include an `address` object when a resolved address is provided. |
| **Server** | `server/src/controllers/businessController.js` | In `getBusinessById`, we now call `getResolvedAddress(business)` and pass the result into `mapBusinessResponse`, so the JSON response may include an `address` object. |
| **Client** | `client/src/components/business/EditBusinessInfo/EditBusinessInfo.jsx` | **Load:** Use `response.data.address` when present to set the address fields; otherwise keep the existing fallback that fetches by `business.address_id`. **Save:** If `address_id` is missing or contains a comma (legacy), create a new address and set the business’s `address_id` to the new doc ID; otherwise update the existing address. |

---

## Takeaways

- **Data:** Businesses that had a full address string in `address_id` will now see that address on the edit page (parsed into the form). The first time they save, we create a real address document and set `address_id` to that doc’s ID, so the data model is correct from then on.
- **API:** `GET /api/businesses/:id` may now include an optional **`address`** object: `{ id?, street, city, state, zipCode }`. The `id` is only present when the address is a real document; for legacy parsed strings we omit `id`. Other consumers can ignore `address` if they don’t need it.
- **No schema or DB migrations:** I didn’t change Firestore collection structure or the Business/Address schemas; Only added read-time resolution and legacy parsing, and normalized data on save.
