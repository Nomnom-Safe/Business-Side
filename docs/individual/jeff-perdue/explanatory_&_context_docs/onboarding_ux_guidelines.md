# Onboarding UX Guidelines

Summary of UX decisions and patterns for the new-business onboarding flow. Use for consistency when iterating.

## Flow

- **Entry:** Choose Business (single CTA: "Create your business" / "Get started") → Onboarding.
- **Onboarding:** Single route `/onboarding` with two steps in component state (no URL change between steps). Step 1: Business info (name, website, address). Step 2: Allergens & diets (optional, skippable).
- **Exit:** Success screen ("You're all set!") then redirect to dashboard.

## Affordances & validation

- **Required fields:** Mark with `*`, `aria-required="true"`, and clear hint text (e.g. "All address fields are required" for address block).
- **Errors:** Inline with `aria-invalid`, `aria-describedby`, and `role="alert"`. Show a short summary message ("Please fix the errors below.") and scroll the step content into view when validation fails.
- **Buttons:** Primary = "Continue" / "Continue to dashboard" (class `button`). Secondary = "Back", "Skip for now" (class `button gray-btn`). One primary CTA per step.
- **Progress:** Progress bar with step label (e.g. "Step 1/2 — Business info").

## Visual structure

- **Cards:** Use class `onboarding-card` (defined in SetUp.scss) to wrap each logical section: light border, border-radius, padding 1.25rem, white background. Step 1: one card for search, one for name/website, one for address. Step 2: one card for allergens, one for diets.

## Copy & hierarchy

- **Choose Business:** Headline "Create your business." Value line: "Help customers with dietary needs find and trust your business." What happens next: "We'll ask for your business details and, optionally, how you accommodate allergens and diets. You can change anything later." CTA: "Get started."
- **Step 1:** Headline "Basic Business Information." First card: "Find your business" with instruction "Start by searching for your business or address." After prefill: "We've filled in the details below. Review and edit if needed." Second card: business name and website. Third card: address with "All address fields are required." Optional "Tips & notes" collapsible.
- **Step 2:** Headline "Help customers find you." Optional personalization: "Almost there, {businessName}." when name is present. Optional callout: "This step is optional. Skip to go straight to your dashboard and add this later in Business settings." Allergens: "Which allergens are always present in your menu items? (Select all that apply.)" Diets: "Which diets do you offer menu items for? (Select all that apply.)"
- **Success:** "You're all set!" plus short redirect copy; checkmark and subtle animation; `role="status"` and `aria-live="polite"` for screen readers.

These copy and structure choices follow the Onboarding UX Polish plan (consultation summary).

## Consistency

- Use existing design tokens: `--mint-green`, `--turq`, `--dark-turq`, `--corners-round`, `--hard-black`, `--gray`.
- Reuse shared components: ErrorMessage, AddressFields, formValidation, progress bar.
- No new design system; align with AddMenuItem / MenuItemsPage and other app patterns.

## Data persistence

- One `SetUp` instance for `/onboarding` holds `formData` and `step` in state. Step 1 fields are controlled by parent; Step 2 initializes from `formData.allergens` and `formData.diets`. Back/Continue never loses data.
