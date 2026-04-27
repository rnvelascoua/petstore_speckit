# Contract: GET /api/pets/{id}

**Feature**: `001-pet-catalogue-browse`
**Method**: `GET`
**Path**: `/api/pets/{id}`
**Auth**: None (public endpoint)

---

## Purpose

Returns the full detail for a single pet by its UUID. Intended for the pet detail page.

---

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID string | Yes | The unique identifier of the pet. |

**Example request**:
```
GET /api/pets/a1b2c3d4-0001-0000-0000-000000000001
```

---

## Response: 200 OK

```json
{
  "id": "a1b2c3d4-0001-0000-0000-000000000001",
  "name": "Buddy",
  "category": "DOG",
  "breed": "Golden Retriever",
  "ageMonths": 18,
  "price": 850.00,
  "available": true,
  "primaryPhotoUrl": "https://placehold.co/400x300?text=Buddy",
  "description": "Friendly and energetic Golden Retriever puppy.",
  "photos": [
    {
      "url": "https://placehold.co/400x300?text=Buddy",
      "isPrimary": true
    },
    {
      "url": "https://placehold.co/400x300?text=Buddy+2",
      "isPrimary": false
    }
  ]
}
```

### Response Fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID string | Unique identifier |
| `name` | string | Pet's display name |
| `category` | string | One of: `DOG`, `CAT`, `BIRD`, `FISH` |
| `breed` | string | Breed or species |
| `ageMonths` | integer | Age in months |
| `price` | number \| null | `null` → display "Contact us for pricing" |
| `available` | boolean | `false` → disable "Add to Cart", show "Currently Unavailable" |
| `primaryPhotoUrl` | string | URL of the primary photo (convenience field) |
| `description` | string | Full narrative description |
| `photos` | array | All photos for this pet, ordered by `sort_order` ascending |
| `photos[].url` | string | Photo URL |
| `photos[].isPrimary` | boolean | True for the primary thumbnail |

---

## Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| `400 Bad Request` | `id` is not a valid UUID format | `{"error": "Invalid pet ID format"}` |
| `404 Not Found` | No pet exists with the given `id` | `{"error": "Pet not found: {id}"}` |
| `500 Internal Server Error` | Database or unexpected error | `{"error": "An unexpected error occurred"}` |

---

## Behaviour Notes

- Always returns exactly one pet or a `404`. Never returns an array.
- `photos` array is ordered by `sort_order` ascending; primary photo may appear anywhere
  in the list (use the `isPrimary` flag to identify it).
- `photos` will always contain at least one entry (the primary photo). An empty `photos`
  array MUST NOT occur for a valid pet (enforced by seed data and future admin tooling).
- Frontend MUST handle `404` by navigating the user back to the catalogue with an
  appropriate notification ("This pet is no longer available").
