# Onboarding Renovation — Step-by-Step Implementation Plan

This document lays out the implementation plan for renovating the new-business onboarding experience. The goal is an **engaging, frictionless, and visually appealing** flow that gets users to their first win quickly. **No layout-selection step** is part of the renovated flow. **Menu upload is out of scope** for onboarding.

Use this as the sequence of work when implementing; resolve the listed decisions before or during the relevant steps.

---

## Scope and Out of Scope

**In scope**

- New-business onboarding only (Choose Business → collect essentials → optional allergens/diets → dashboard).
- Flow, validation, data/API contract, and UI/UX refresh for that path.
- Optional prefill (UX and data shape only; no specific external service).
- Optional: save-and-resume and minimal success metrics (phase 2).

**Out of scope**

- Existing-business path (unchanged: choose business → dashboard).
- Menu upload / document parsing (post-onboarding feature only).
- Layout-selection step (removed from flow and from implementation).
- Changes to ProtectedRoute guard logic beyond what the new flow requires.

---

## Step 1: Data and API Contract

**Objective:** Define how onboarding data is sent and stored so the rest of the implementation is consistent.

1. **Address handling**
   - Choose one approach:
     - **Option A:** Client serializes address (street, city, state, zipCode) into a single string and sends it as `address` in the business payload. Backend accepts `address` (string) or `address_id` as it does today. Document the exact format (e.g. `"street, city, state zipCode"`).
     - **Option B:** Client sends structured address; backend creates an address document (if needed), returns `address_id`, and business is created/updated with `address_id`. Document the client payload shape and the backend endpoint or creation path.
   - Implement the chosen approach so that the client no longer sends an address object that the backend cannot use (current gap).

2. **Remove placeholder-business creation on "new"**
   - When the user chooses "Create a new business," do **not** create a business record with a placeholder name (e.g. "New Business - {timestamp}"). Only set user intent (e.g. in state or session) and navigate to the onboarding experience (first step or single screen).
   - Ensure no code path creates a business until the user completes the final submit (see Step 2).

3. **Onboarding payload**
   - The business is created **once** at final submit with: name, website, address (or address_id), allergens, diets. Do **not** include `menuLayout` in the onboarding flow or payload.

4. **Document**
   - Document the chosen address approach and the exact request/response shape for business create (and any address create/link) so future work and tests are consistent.

**Done when:** Address is handled correctly end-to-end, placeholder business is no longer created on "new," and the payload for onboarding is documented and used consistently.

---

## Step 2: Flow and Validation

**Objective:** Implement the renovated flow (essentials + optional allergens/diets only) with a single business creation at submit and clear validation.

1. **Choose flow structure**
   - Decide between:
     - **One screen:** Essentials (name, website, address) + optional allergen/diet section on the same page, with a single "Go to dashboard" and a skip for allergens/diets.
     - **Two steps:** Step A = essentials only; Step B = allergens/diets with "Skip for now" and "Continue to dashboard."
   - Remove or bypass any step that corresponds to the old layout selection (former Step 3). Routes and components should reflect only the chosen structure (one or two steps).

2. **Choose Business behavior**
   - For "Create a new business": navigate to the first onboarding screen/step without creating a business or storing a placeholder `businessId` for that path. For "Join an existing business," keep current behavior (select business → set business → dashboard).

3. **Collect essentials**
   - Collect: business name (required), website (optional), address (required: e.g. street, city, state, ZIP).
   - Use the shared validation layer (e.g. `formValidation.js`). Validate before allowing the user to proceed (or to submit, if single screen). Show inline errors and block completion until essentials are valid (or show errors on submit).
   - Clearly mark required fields (e.g. "*" and/or `aria-required`).

4. **Optional allergens and diets**
   - If a separate step: offer a clear **"Skip for now"** so users can go to the dashboard without selecting allergens/diets. Reassure them they can add this later in settings.
   - If on one screen: use a compact checkbox section and keep it skippable (no validation required for allergens/diets).
   - Allergens and diets are optional; no validation required unless product decides otherwise.

5. **Submit and business creation**
   - On "Go to dashboard" (or "Finish"), create the business **once** with all collected data (name, website, address, allergens, diets). Create or link address per the contract from Step 1. Set `hasBusiness` cookie and redirect to dashboard.
   - Re-validate required fields before calling the API. Rely on server-side validation as source of truth (e.g. duplicate business name); surface errors via shared `ErrorMessage` / `ConfirmationMessage`, not alerts.

6. **Routes**
   - Keep or rename routes as needed for the chosen structure (e.g. `/choose-business`, then either one onboarding route or `/step1` and `/step2`). Remove or repurpose any route that was used only for the layout step. Document the final route names.

**Done when:** A new user can complete onboarding in the chosen structure (one or two steps), with validation and skip where specified, and a single business creation at the end. No placeholder business is created on "new"; no layout step is present.

---

## Step 3: Prefill UX and Data Shape

**Objective:** Support optional prefill so that, when data is available, the user can review and edit rather than type everything manually. No specific external service is in scope; only the UX and data contract.

1. **Define prefill payload**
   - Define a prefill payload shape that maps to essentials (and optionally allergens/diets), e.g. `{ name, website, address?: string | { street, city, state, zipCode } }`. Document how each field maps to form state.

2. **When prefill is used**
   - Optional prefill happens before or at the start of the essentials step (e.g. user clicks "Fill from …" or prefill is offered after "Create a new business"). Prefill is stored in component/session state or a small context; nothing is persisted to the backend until the user completes the final submit.

3. **Review and edit**
   - When prefill is applied, populate the form and show a short line of copy such as "Review and edit your business details." All prefilled fields must be editable; the user retains full control.

4. **Implementation**
   - Implement only the contract and UI behavior above. Do not integrate a specific external API or provider; the plan assumes a future integration will supply data in the defined shape.

**Done when:** Prefill payload is documented, and if prefill data is provided (e.g. in state), the form shows it in a "review and edit" state and allows full editing before submit.

---

## Step 4: UI Refresh — Engaging, Frictionless, Visually Appealing

**Objective:** Make onboarding feel modern, inviting, and easy to complete — not a bureaucratic form.

1. **Visual appeal**
   - Apply a **cohesive visual language**: thoughtful spacing, typography, and color so the flow feels modern and polished. Avoid dense or cluttered screens; leave breathing room.
   - If using imagery or illustration (e.g. a simple hero or welcome moment), keep it supportive of the story, not distracting. The result should feel like a product users want to use.

2. **Frictionless**
   - Minimize cognitive load and clicks: short copy, clear CTAs, inline validation so users don’t hit dead ends. Provide "Back" and "Skip for now" where specified. No unnecessary steps or questions.

3. **Avoid wall of text**
   - Use short copy, clear visual hierarchy, and optional tooltips or a brief value line (or testimonial). Long notes (e.g. mobile food truck) should be compact or behind "Learn more" / help so the main path stays light.

4. **Progress and emotion**
   - Add a **progress indicator** (e.g. a simple progress bar or 1–2 step labels such as "Business info" and "Allergens & diets" if two steps).
   - Add a **moment of celebration** on first win (e.g. "You're all set" or similar before showing the dashboard). Consider subtle animations and micro-rewards to create an emotional connection.

5. **Step names and copy**
   - Use goal-oriented titles and one short line explaining why the information is needed. Keep required-field and skip options obvious.

6. **Consistency**
   - Use the same design tokens (spacing, typography, primary/secondary buttons) as the rest of the app. Primary for "Continue" / "Go to dashboard," secondary or text for "Back" and "Skip for now." Use shared `ErrorMessage` and `ConfirmationMessage` (no alerts).

7. **Accessibility and responsiveness**
   - Ensure required fields have `aria-required` and proper labels; focus order is logical; the flow works on small and large screens (align with existing responsive patterns in the codebase).

**Done when:** Onboarding looks and feels engaging, frictionless, and visually appealing; progress and a first-win moment are present; copy is short and scannable; and accessibility and responsiveness are maintained.

---

## Step 5 (Optional): Save-and-Resume and Success Metrics

**Objective:** Optional enhancements that can be implemented after the core flow is stable.

1. **Save and resume**
   - If implementing "save and finish later," define: (1) what is persisted (e.g. draft in backend vs localStorage), (2) when the user is invited to resume (e.g. next login), (3) that the business is still only created on final submit. Implement accordingly.

2. **Analytics and success criteria**
   - Optionally define 1–2 success metrics (e.g. completion rate, time to complete) and add minimal instrumentation so the team can measure onboarding effectiveness.

**Done when:** Save-and-resume (if implemented) works as designed, and any agreed metrics are captured.

---

## Decisions to Resolve

- **Address:** Option A (client sends string) vs Option B (structured address + address_id). See Step 1.
- **Flow structure:** One screen vs two steps. See Step 2.
- **Route names:** Keep `/step1`, `/step2` or rename (e.g. `/onboarding`, `/onboarding/basics`, `/onboarding/allergens`). See Step 2.
- **Phase 2:** Whether to implement save-and-resume and/or success metrics. See Step 5.

---

## What Stays Unchanged

- **Existing-business path:** Choose Business → select business → dashboard. No changes to this flow.
- **Auth and routing:** ProtectedRoute and guard chain logic unchanged except as needed to support the new onboarding flow and routes.
- **Backend:** Existing business and auth APIs are used as-is unless the plan explicitly requires a change (e.g. address creation endpoint for Option B).

---

## Verification

After implementation:

- Run through **new business** flow: Choose "Create a new business" → complete essentials (and optionally allergens/diets or skip) → submit → dashboard. Confirm only one business is created, at submit time, with the correct payload.
- Run through **existing business** flow: Choose "Join an existing business" → select → dashboard. Confirm behavior is unchanged.
- Confirm no layout step appears and no `menuLayout` is sent in onboarding.
- Confirm the experience feels engaging, frictionless, and visually appealing, with clear progress and a first-win moment.
