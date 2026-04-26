# Track A Phase 1 API Envelope Examples

## Purpose

These examples make the Phase 1 contract concrete for implementation and testing. They illustrate:

- full parse success
- partial parse success (Option B)
- pipeline-level failure with standardized error envelope

All examples include `correlationId`.

## Example 1: Success (No Partial Issues)

```json
{
  "success": true,
  "partial": false,
  "correlationId": "5f4c6a54-0b73-4b98-9d9c-1f2f5f95f3f2",
  "summary": {
    "totalRows": 3,
    "validRows": 3,
    "invalidRows": 0,
    "duplicateRows": 0
  },
  "items": [
    {
      "status": "valid",
      "item": {
        "name": "Margherita Pizza",
        "description": "Tomato, mozzarella, basil",
        "ingredients": ["tomato", "mozzarella", "basil", "wheat flour"],
        "price": 12.5,
        "category": "Pizza",
        "possible_allergens": ["dairy", "gluten"]
      },
      "issues": []
    },
    {
      "status": "valid",
      "item": {
        "name": "Garden Salad",
        "description": "Mixed greens and house vinaigrette",
        "ingredients": ["mixed greens", "cucumber", "tomato", "vinaigrette"],
        "price": 9,
        "category": "Salads",
        "possible_allergens": []
      },
      "issues": []
    },
    {
      "status": "valid",
      "item": {
        "name": "Iced Tea",
        "description": "",
        "ingredients": ["black tea", "water"],
        "price": null,
        "category": "Beverages",
        "possible_allergens": []
      },
      "issues": []
    }
  ]
}
```

## Example 2: Partial Success (Row-Level Issues Present)

```json
{
  "success": true,
  "partial": true,
  "correlationId": "d7d5347f-89e2-4eb2-8a3f-2f10c5c3ec90",
  "summary": {
    "totalRows": 4,
    "validRows": 2,
    "invalidRows": 1,
    "duplicateRows": 1
  },
  "items": [
    {
      "status": "valid",
      "item": {
        "name": "Chicken Alfredo",
        "description": "Fettuccine in creamy sauce",
        "ingredients": ["chicken", "fettuccine", "cream", "parmesan"],
        "price": 16.99,
        "category": "Pasta",
        "possible_allergens": ["dairy", "gluten"]
      },
      "issues": []
    },
    {
      "status": "invalid",
      "item": {
        "name": "",
        "description": "Soup of the day",
        "ingredients": ["broth"],
        "price": null,
        "category": "Soups",
        "possible_allergens": []
      },
      "issues": [
        {
          "field": "name",
          "code": "REQUIRED_MISSING",
          "message": "Name is required."
        }
      ]
    },
    {
      "status": "duplicate",
      "item": {
        "name": "Chicken Alfredo",
        "description": "Creamy pasta with grilled chicken",
        "ingredients": ["chicken", "pasta", "cream"],
        "price": 17.5,
        "category": "Pasta",
        "possible_allergens": ["dairy", "gluten"]
      },
      "issues": [
        {
          "field": "name",
          "code": "DUPLICATE_NAME_CATEGORY",
          "message": "Duplicate detected by normalized name + category key."
        }
      ]
    },
    {
      "status": "valid",
      "item": {
        "name": "Sparkling Water",
        "description": "",
        "ingredients": ["carbonated water"],
        "price": 3,
        "category": "Beverages",
        "possible_allergens": []
      },
      "issues": []
    }
  ]
}
```

## Example 3: Pipeline-Level Failure

```json
{
  "success": false,
  "code": "IMPORT_UNSUPPORTED_FILE_TYPE",
  "error": "We couldn't parse this file type.",
  "fallback": "Upload a PDF, DOCX, or CSV file, or add items manually.",
  "correlationId": "22e824be-37d9-4d74-8985-8df14b284da0"
}
```

## Example 4: URL Timeout Failure

```json
{
  "success": false,
  "code": "IMPORT_URL_TIMEOUT",
  "error": "We couldn't read this page in time.",
  "fallback": "Try another URL, upload a file instead, or add items manually.",
  "correlationId": "f3b3e03b-05e2-43cd-aab9-31f55cb90d75"
}
```

## Notes for Client Integration

- Treat `success: true` as parse pipeline completion, not guarantee that every row is importable.
- Use `partial` and row `status` to drive review UI badges, filters, and save eligibility.
- Always surface `fallback` when `success: false`.
- Persist `correlationId` in client logs and support diagnostics.
