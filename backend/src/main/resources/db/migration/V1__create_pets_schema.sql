CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE pets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100)      NOT NULL,
    category    VARCHAR(10)       NOT NULL
                    CONSTRAINT chk_category CHECK (category IN ('DOG','CAT','BIRD','FISH')),
    breed       VARCHAR(100)      NOT NULL,
    age_months  INTEGER           NOT NULL CONSTRAINT chk_age CHECK (age_months >= 0),
    description TEXT              NOT NULL,
    price       NUMERIC(10,2),
    available   BOOLEAN           NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE TABLE pet_photos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id      UUID         NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    url         VARCHAR(500) NOT NULL,
    is_primary  BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_order  INTEGER      NOT NULL DEFAULT 0
);

CREATE INDEX idx_pets_category   ON pets(category);
CREATE INDEX idx_photos_pet_id   ON pet_photos(pet_id);
CREATE INDEX idx_photos_primary  ON pet_photos(pet_id, is_primary);
