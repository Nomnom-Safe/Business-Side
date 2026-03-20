# P-Diagram: NomNom Safe (Business-Side)

## Technology Readiness Assessment

## Main Function

Enable restaurant businesses to create, manage, and maintain structured allergen-aware menus through a web application backed by Firestore.

---

## Inputs (Signal Factors)

| Category                | Input                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Authentication**      | Email, password, first name, last name                                                                                |
| **Business Setup**      | Business name, website, address                                                                                       |
| **Business Onboarding** | Selected allergens, selected diets, Google Places search text                                                         |
| **Menu Items**          | Item name, description, ingredients, allergen IDs, category, availability flag                                        |
| **Search/Filter**       | Search text (name, description, ingredients, allergens), filter inputs (category, availability, allergen), sort field |
| **Account**             | Updated name, updated email, updated password                                                                         |

---

## Desired Outputs (Ideal Response)

| Category           | Output                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| **Authentication** | Authenticated session (cookies), user record in Firestore                                                 |
| **Business**       | Stored business profile with allergen data, address record                                                |
| **Menus**          | Persistent menu tied to a business                                                                        |
| **Menu Items**     | Authorized updates to menu items with correct allergen associations, categorized and searchable item list |
| **Account**        | Updated user credentials and profile                                                                      |
| **UI Feedback**    | Toast notifications confirming success/failure, form validation messages                                  |
| **Data Retrieval** | Allergen list, business details, menu with items, account details                                         |

---

## Noise Factors (Dysfunctional Inputs / Disturbances)

| Factor                        | Description                                                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Malformed input**           | Invalid email format, weak passwords, missing required fields, non-numeric price, empty item name                          |
| **Duplicate data**            | Registering with an existing email, creating a business with a duplicate name                                              |
| **Network failure**           | Lost connection between client and server, database unavailable, Google Places API timeout                                 |
| **Corrupted session**         | Deleted or tampered cookies (`isAuthorized`, `hasBusiness`, `token`), cleared localStorage (`businessId`, `currentMenuId`) |
| **Concurrent edits**          | Multiple users editing the same business or menu item simultaneously (no conflict resolution)                              |
| **Stale client state**        | Browser cache or localStorage out of sync with database data                                                               |
| **Database misconfiguration** | Exceeded database quotas                                                                                                   |
| **Injection/abuse**           | Excessively long strings, script injection in text fields, rapid repeated requests                                         |

---

## Failure Modes (Error States)

| Failure Mode                | Trigger                                                        | Current Mitigation                                                                              |
| --------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Registration failure**    | Duplicate email, invalid email format, weak password           | Zod validation returns 400; `AuthError` with codes (`EMAIL_EXISTS`, `INVALID_EMAIL`)            |
| **Login failure**           | Wrong password, nonexistent email                              | `AuthError` (`INCORRECT_PASSWORD`, `USER_NOT_FOUND`); client surfaces first field error         |
| **Validation rejection**    | Missing or malformed request body fields                       | Zod `safeParse` → 400 with flattened error details                                              |
| **Unhandled server error**  | Unexpected exception in any route handler                      | `asyncHandler` catches, `errorHandler` returns 500 `SERVER_ERROR`                               |
| **Google Places failure**   | Bad API key, quota exceeded, network error                     | Server returns error response; onboarding still allows manual entry                             |
| **Firestore write failure** | Quota exceeded, permission denied, network issue               | Propagated as 500 to client; toast displays generic error                                       |
| **Session loss**            | Cookies cleared, expired, or tampered                          | `ProtectedRoute` redirects unauthenticated users to login                                       |
| **Unauthorized API access** | No server-side auth enforcement on business/menu routes        | **Unmitigated** — API routes are unprotected; relies on client-side cookie checks only          |
| **Data inconsistency**      | Concurrent writes, orphaned menu items after business deletion | **Unmitigated** — no transactions, no cascade deletes, no optimistic locking                    |
| **CORS block**              | Deploying client to a domain other than `localhost:3000`       | **Unmitigated** — CORS origin is hardcoded                                                      |
| **XSS via stored input**    | Malicious strings saved as item names/descriptions             | **Partially mitigated** — React escapes rendered output by default; no server-side sanitization |
| **Broken onboarding flow**  | User navigates away mid-setup, clears `justSignedUp` flag      | Guard chain redirects to dashboard or choose-business; partial business data may persist        |

---

## Control Factors (Design Parameters)

| Factor                        | Current State                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| **Validation library**        | Zod schemas enforce structure on all request bodies                                   |
| **Password hashing**          | bcrypt with 12 salt rounds                                                            |
| **Error handling middleware** | Centralized `errorHandler` differentiates `AuthError`, `ZodError`, and generic errors |
| **Client route guards**       | `ProtectedRoute` component enforces auth/onboarding flow via cookies                  |
| **Cookie config**             | `secure: true`, `sameSite: 'None'`                                                    |
| **Database**                  | Firebase Firestore (managed, serverless)                                              |
| **API architecture**          | RESTful Express routes with controller/service/schema separation                      |
| **Frontend state**            | Cookies + localStorage; no global state library                                       |
| **Testing**                   | Jest + React Testing Library + Supertest (present but coverage level unknown)         |

---

## System Constraints

| Constraint                              | Impact                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Platform**                            | Web app depends on a modern browser with JavaScript enabled                                       |
| **Backend availability**                | Client requires the Express API server to be running and reachable                                |
| **Database dependency**                 | Core business, menu, and account functions depend on Firebase Firestore availability              |
| **Google Places dependency**            | Business autofill depends on a valid Google Places API key; manual entry is fallback              |
| **Deployment config**                   | API base URL and CORS are configured for localhost, limiting production readiness                 |
| **Auth design**                         | Access control is enforced mainly on the client; server-side route protection is limited          |
| **Session storage**                     | Navigation and session flow depend on browser cookies and localStorage remaining intact           |
| **Single-business / single-menu scope** | Current MVP design limits operational flexibility and does not fully support multi-menu workflows |
| **Data integrity controls**             | No transaction, conflict resolution, or cascade delete strategy is evident                        |
| **Security controls**                   | No visible rate limiting or server-side sanitization beyond schema validation                     |

---

## Summary Assessment

**Strengths:**

- Structured validation (Zod) on all API inputs reduces malformed data risk.
- Centralized error handling provides consistent error responses.
- Client-side route protection enforces onboarding flow.
- Google Places integration is optional — manual entry is the fallback.

**Gaps:**

- No server-side authentication on business, menu, or menu-item routes. Any HTTP client can read/write data.
- No data integrity enforcement (transactions, cascade deletes, optimistic locking).
- CORS origin and API base URL are hardcoded to localhost. Not deployment-ready.
- No rate limiting or input sanitization beyond Zod type checks.
- Test coverage scope is unclear.
