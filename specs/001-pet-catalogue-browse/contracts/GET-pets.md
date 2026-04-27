# Contract: GET /api/pets

**Feature**: `001-pet-catalogue-browse`
**Method**: `GET`
**Path**: `/api/pets`
**Auth**: None (public endpoint)

---

## Purpose

Returns a paginated list of pet summaries. Supports optional multi-value category
filtering. Intended for the catalogue grid view.

---

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | string (repeatable) | No | (all) | Filter by category. Allowed values: `DOG`, `CAT`, `BIRD`, `FISH`. Repeat to filter by multiple. |
| `page` | integer | No | `0` | Zero-based page index. |
| `size` | integer | No | `12` | Page size. Max: `50`. |

**Example requests**:
```
GET /api/pets
GET /api/pets?category=DOG
GET /api/pets?category=DOG&category=CAT
GET /api/pets?category=BIRD&page=1&size=12
```

---

## Response: 200 OK

```json
{
  "content": [
    {
      "id": "a1b2c3d4-0001-0000-0000-000000000001",
      "name": "Buddy",
      "category": "DOG",
      "breed": "Golden Retriever",
      "ageMonths": 18,
      "price": 850.00,
      "available": true,
      "primaryPhotoUrl": "https://placehold.co/400x300?text=Buddy"
    }
  ],
  "page": 0,
  "size": 12,
  "totalElements": 1,
  "totalPages": 1,
  "last": true
}
```

### Response Fields

| Field | Type | Notes |
|-------|------|-------|
| `content` | array | Array of `PetSummaryDto` objects (may be empty) |
| `content[].id` | UUID string | Unique identifier |
| `content[].name` | string | Pet's display name |
| `content[].category` | string | One of: `DOG`, `CAT`, `BIRD`, `FISH` |
| `content[].breed` | string | Breed or species |
| `content[].ageMonths` | integer | Age in months |
| `content[].price` | number \| null | `null` → display "Contact us for pricing" |
| `content[].available` | boolean | `false` → "Add to Cart" disabled |
| `content[].primaryPhotoUrl` | string | URL of the primary thumbnail photo |
| `page` | integer | Current zero-based page index |
| `size` | integer | Requested page size |
| `totalElements` | integer | Total matching pets |
| `totalPages` | integer | Total pages at this size |
| `last` | boolean | True if this is the last page |

---

## Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400 Bad Request` | Invalid `category` value (not in allowed set) | `{"error": "Invalid category value: 'XYZ'. Allowed: DOG, CAT, BIRD, FISH"}` |
| `400 Bad Request` | `page` < 0 or `size` < 1 or `size` > 50 | `{"error": "Invalid pagination parameters"}` |
| `500 Internal Server Error` | Database or unexpected error | `{"error": "An unexpected error occurred"}` |

---

## Behaviour Notes

- Invalid `category` values in the query string return `400`; they are NOT silently
  ignored (per spec edge case: invalid filter → show all).
  > **Note**: The spec says "invalid filter → default to all". We resolve this as a `400`
  > response rather than silent fallback, so the frontend can redirect cleanly to the
  > unfiltered catalogue. The frontend MUST handle a `400` on the filter param by
  > stripping the invalid param and retrying.
- An empty `content` array with `200 OK` represents a valid empty result (no pets in
  category). This is NOT a `404`.
- The endpoint always returns `200` for valid requests, even if `content` is empty.
