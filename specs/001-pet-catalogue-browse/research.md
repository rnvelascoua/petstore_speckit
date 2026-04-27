# Research: Browse Pet Catalogue with Category Filtering

**Feature**: `001-pet-catalogue-browse`
**Date**: 2026-04-25
**Phase**: 0 — Outline & Research

---

## 1. Pagination Strategy

**Decision**: Spring Data JPA `Pageable` (server-side pagination) with page size 12 on
the backend; React Query infinite scroll or simple page-number navigation on the frontend.

**Rationale**: The spec (FR-001, US1 SC3) requires pagination for catalogues > 20 pets.
Server-side pagination avoids loading the entire dataset. Page size 12 fits a 3-column
grid cleanly on desktop.

**Alternatives considered**:
- Client-side pagination (load all, slice in React): rejected — wastes bandwidth, breaks
  SC-002 for larger catalogues.
- Cursor-based pagination: overkill for a small, static catalogue; sequential page numbers
  suffice.

---

## 2. Category Filtering: Query Parameter vs. Path Segment

**Decision**: Query parameters — `GET /api/pets?category=DOG&category=CAT&page=0&size=12`

**Rationale**: Multiple categories can be passed as repeated params (standard HTTP). Easy
to serialize/deserialize with Spring's `@RequestParam(required = false) List<Category>`.
Clean URL structure that maps naturally to URL state on the frontend (FR-005).

**Alternatives considered**:
- Path segment `/api/pets/dogs`: cannot support multi-category filtering without complex
  path combinatorics.
- Request body filter object (POST): semantically incorrect for a read operation; breaks
  REST conventions and browser history/bookmark behaviour.

---

## 3. Frontend State Management for Filters

**Decision**: URL search params via React Router 6 `useSearchParams`. No global state
store (Redux/Zustand) needed for this feature.

**Rationale**: Filter state lives in the URL (FR-005), so the URL is the source of truth.
`useSearchParams` syncs React state with the URL automatically. This gives free
bookmarkability and browser back/forward support (US3 AC3).

**Alternatives considered**:
- Zustand/Redux: adds complexity with no benefit when URL is the source of truth.
- `useState` only: filter state lost on page reload; violates FR-005.

---

## 4. Data Fetching: React Query

**Decision**: `@tanstack/react-query` with `useQuery` for catalogue and detail fetches.
Axios as the HTTP client.

**Rationale**: React Query handles loading/error/success states out of the box (FR-011,
FR-012), provides caching to meet SC-003 (filter updates feel instant after first load),
and keeps component code clean. Integrates naturally with MUI skeleton loaders.

**Alternatives considered**:
- `useEffect` + `useState` fetch: verbose, error-prone cache invalidation, no retry logic.
- SWR: viable alternative, but React Query has richer devtools and better TypeScript
  support for this use case.

---

## 5. Image Storage & Fallback

**Decision**: Store image URLs as strings in the `pet_photos` table. Images hosted
externally (e.g., public CDN, static hosting, or relative `/public` folder in the React
app for seed images). Frontend uses `onError` handler on `<img>` to swap to a placeholder.

**Rationale**: Avoids blob storage complexity in v1. Seed data can use free placeholder
services (e.g., `https://placehold.co/300x200`). The spec edge case (image load failure)
is handled entirely in the frontend component.

**Alternatives considered**:
- Storing binary blobs in PostgreSQL: excessive for this scale; hurts query performance.
- S3/object storage: over-engineered for v1 scope (Principle V — YAGNI).

---

## 6. DTO Projection Strategy

**Decision**: Two separate DTOs — `PetSummaryDto` (card view) and `PetDetailDto` (detail
page). Both mapped from JPA entity in the service layer using a simple mapper method.

**Rationale**: The catalogue endpoint returns many records; sending full detail
(description, all photos) wastes bandwidth. The detail endpoint returns one record;
sending full data is appropriate. Principle I mandates that mapping logic lives in the
service layer, not the controller.

**Alternatives considered**:
- Single DTO for both: returns unnecessary fields in list view; couples API response to
  the most verbose case.
- Projections / `@JsonView`: more complex than needed for two clearly distinct views.

---

## 7. Database Schema Decisions

**Decision**:
- `pets` table: `id` (UUID PK), `name`, `category` (enum/varchar), `breed`, `age_months`
  (integer), `description`, `price` (numeric 10,2), `available` (boolean), `created_at`.
- `pet_photos` table: `id` (UUID PK), `pet_id` (FK → pets), `url`, `is_primary` (boolean).
- Category stored as a `VARCHAR` with a `CHECK` constraint matching the four valid values.
- Flyway migration `V1__create_pets_schema.sql` creates tables; `V2__seed_pets.sql` inserts
  sample data covering all four categories.

**Rationale**: UUID PKs are preferable to sequential integers for distributed safety.
`is_primary` flag avoids a separate join just to get the thumbnail URL. Flyway satisfies
Principle IV.

**Alternatives considered**:
- PostgreSQL native `ENUM` type for category: harder to migrate if categories change; a
  `CHECK` constraint on `VARCHAR` is simpler to evolve.
- Embedding photos as a JSON array in `pets`: non-normalised, harder to query and extend.

---

## 8. CORS Configuration

**Decision**: Enable CORS on the Spring Boot backend for `http://localhost:5173` (Vite
dev server) via `@CrossOrigin` or a `WebMvcConfigurer` bean. In production, serve both
from the same origin or configure the allowed origin via `application.yml`.

**Rationale**: React dev server runs on a different port from the Spring Boot server.
Without CORS configuration, browser requests will be blocked.

**Alternatives considered**:
- Proxy via Vite's `server.proxy`: valid for dev only; CORS config on the server is
  environment-agnostic.

---

## All NEEDS CLARIFICATION items resolved

No `[NEEDS CLARIFICATION]` markers were present in the spec. All technical decisions
above are derived from the spec requirements, constitution constraints, and standard
Spring Boot / React best practices.
