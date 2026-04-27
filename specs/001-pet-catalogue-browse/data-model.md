# Data Model: Browse Pet Catalogue with Category Filtering

**Feature**: `001-pet-catalogue-browse`
**Date**: 2026-04-25

---

## Entities

### Pet

Represents a single pet available in the store catalogue.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, NOT NULL | Auto-generated (UUID v4) |
| `name` | VARCHAR(100) | NOT NULL | Display name, e.g. "Buddy" |
| `category` | VARCHAR(10) | NOT NULL, CHECK IN ('DOG','CAT','BIRD','FISH') | Fixed set per constitution |
| `breed` | VARCHAR(100) | NOT NULL | Breed or species name |
| `age_months` | INTEGER | NOT NULL, ≥ 0 | Age in months for precision |
| `description` | TEXT | NOT NULL | Full narrative shown on detail page |
| `price` | NUMERIC(10,2) | NULL allowed | NULL → display "Contact us for pricing" |
| `available` | BOOLEAN | NOT NULL, DEFAULT TRUE | FALSE disables Add to Cart |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Insertion timestamp |

**Validation rules**:
- `name` must not be blank.
- `category` must be one of the four allowed values (enforced by DB constraint + Java enum).
- `age_months` must be ≥ 0.
- `price`, if provided, must be > 0.

---

### PetPhoto

Stores one or more photos for a Pet. Exactly one photo per pet must be designated primary.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, NOT NULL | Auto-generated |
| `pet_id` | UUID | NOT NULL, FK → pets(id) ON DELETE CASCADE | Owning pet |
| `url` | VARCHAR(500) | NOT NULL | Absolute or root-relative URL |
| `is_primary` | BOOLEAN | NOT NULL, DEFAULT FALSE | One TRUE per pet for card thumbnail |
| `sort_order` | INTEGER | NOT NULL, DEFAULT 0 | Display order on detail page |

**Validation rules**:
- Each Pet MUST have at least one PetPhoto with `is_primary = TRUE`.
- `url` must be a non-blank string.
- No two photos for the same pet may share the same `sort_order` (application-level constraint).

---

### Category (Java Enum)

```java
public enum Category {
    DOG, CAT, BIRD, FISH
}
```

Maps to the `category` column. Spring Data JPA persists as a string via `@Enumerated(EnumType.STRING)`.

---

## Relationships

```
Pet ─┬─< PetPhoto   (one-to-many, cascade delete)
     │
     └── category   (FK-constrained VARCHAR — no separate Category table needed)
```

- A Pet has one or more PetPhotos.
- A PetPhoto belongs to exactly one Pet.
- Deleting a Pet cascades to its PetPhotos.

---

## DTOs

### PetSummaryDto (catalogue card)

Used by `GET /api/pets` list response.

| Field | Type | Source |
|-------|------|--------|
| `id` | UUID | Pet.id |
| `name` | String | Pet.name |
| `category` | String | Pet.category.name() |
| `breed` | String | Pet.breed |
| `ageMonths` | int | Pet.age_months |
| `price` | BigDecimal (nullable) | Pet.price |
| `available` | boolean | Pet.available |
| `primaryPhotoUrl` | String | PetPhoto where is_primary = true |

### PetDetailDto (detail page)

Used by `GET /api/pets/{id}` response.

All fields from `PetSummaryDto`, plus:

| Field | Type | Source |
|-------|------|--------|
| `description` | String | Pet.description |
| `photos` | List\<PhotoDto\> | All PetPhotos ordered by sort_order |

### PhotoDto

| Field | Type | Source |
|-------|------|--------|
| `url` | String | PetPhoto.url |
| `isPrimary` | boolean | PetPhoto.is_primary |

---

## Database Migration Scripts

### V1__create_pets_schema.sql

```sql
CREATE TABLE pets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100)      NOT NULL,
    category    VARCHAR(10)       NOT NULL
                    CHECK (category IN ('DOG','CAT','BIRD','FISH')),
    breed       VARCHAR(100)      NOT NULL,
    age_months  INTEGER           NOT NULL CHECK (age_months >= 0),
    description TEXT              NOT NULL,
    price       NUMERIC(10,2),
    available   BOOLEAN           NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE TABLE pet_photos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id      UUID        NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    url         VARCHAR(500) NOT NULL,
    is_primary  BOOLEAN     NOT NULL DEFAULT FALSE,
    sort_order  INTEGER     NOT NULL DEFAULT 0
);

CREATE INDEX idx_pets_category    ON pets(category);
CREATE INDEX idx_photos_pet_id    ON pet_photos(pet_id);
CREATE INDEX idx_photos_primary   ON pet_photos(pet_id, is_primary);
```

### V2__seed_pets.sql (abbreviated — full script has 20+ rows)

```sql
-- Dogs
INSERT INTO pets (id, name, category, breed, age_months, description, price, available)
VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001','Buddy','DOG','Golden Retriever',18,
   'Friendly and energetic Golden Retriever puppy.',850.00,true),
  ('a1b2c3d4-0001-0000-0000-000000000002','Max','DOG','German Shepherd',24,
   'Loyal and intelligent German Shepherd.',950.00,true);

-- Cats
INSERT INTO pets (id, name, category, breed, age_months, description, price, available)
VALUES
  ('a1b2c3d4-0002-0000-0000-000000000001','Luna','CAT','Siamese',12,
   'Elegant Siamese with striking blue eyes.',400.00,true),
  ('a1b2c3d4-0002-0000-0000-000000000002','Mochi','CAT','Persian',6,
   'Fluffy Persian kitten, very calm.',500.00,false);

-- Birds
INSERT INTO pets (id, name, category, breed, age_months, description, price, available)
VALUES
  ('a1b2c3d4-0003-0000-0000-000000000001','Kiwi','BIRD','Budgerigar',3,
   'Cheerful budgie, already starting to mimic words.',80.00,true),
  ('a1b2c3d4-0003-0000-0000-000000000002','Rio','BIRD','African Grey Parrot',14,
   'Highly intelligent African Grey, excellent vocabulary.',1200.00,true);

-- Fish
INSERT INTO pets (id, name, category, breed, age_months, description, price, available)
VALUES
  ('a1b2c3d4-0004-0000-0000-000000000001','Nemo','FISH','Clownfish',2,
   'Vibrant Clownfish, great for reef tanks.',25.00,true),
  ('a1b2c3d4-0004-0000-0000-000000000002','Ariel','FISH','Betta',1,
   'Stunning Betta fish with flowing fins.',15.00,true);

-- Photos (primary thumbnails)
INSERT INTO pet_photos (pet_id, url, is_primary, sort_order) VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001','https://placehold.co/400x300?text=Buddy',true,0),
  ('a1b2c3d4-0001-0000-0000-000000000002','https://placehold.co/400x300?text=Max',true,0),
  ('a1b2c3d4-0002-0000-0000-000000000001','https://placehold.co/400x300?text=Luna',true,0),
  ('a1b2c3d4-0002-0000-0000-000000000002','https://placehold.co/400x300?text=Mochi',true,0),
  ('a1b2c3d4-0003-0000-0000-000000000001','https://placehold.co/400x300?text=Kiwi',true,0),
  ('a1b2c3d4-0003-0000-0000-000000000002','https://placehold.co/400x300?text=Rio',true,0),
  ('a1b2c3d4-0004-0000-0000-000000000001','https://placehold.co/400x300?text=Nemo',true,0),
  ('a1b2c3d4-0004-0000-0000-000000000002','https://placehold.co/400x300?text=Ariel',true,0);
```

---

## State Transitions

### Pet.available

```
available = TRUE  ──(admin marks unavailable)──►  available = FALSE
available = FALSE ──(admin marks available)─────►  available = TRUE
```

Frontend effect:
- `available = TRUE` → "Add to Cart" button enabled.
- `available = FALSE` → "Add to Cart" button disabled + "Currently Unavailable" badge shown.
