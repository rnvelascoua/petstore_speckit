# Implementation Plan: Browse Pet Catalogue with Category Filtering

**Branch**: `001-pet-catalogue-browse` | **Date**: 2026-04-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-pet-catalogue-browse/spec.md`

## Summary

Implement the Petstore public-facing pet catalogue: a paginated grid of pet cards
browsable by any visitor, filterable by category (Dogs / Cats / Birds / Fish), with
URL-persistent filters and a detail page per pet. The backend exposes two REST
endpoints (`GET /api/pets` with optional category query params, `GET /api/pets/{id}`).
The frontend renders the catalogue and detail views using React + MUI + Tailwind, reading
from those endpoints. Seed data is delivered via a Flyway migration.

## Technical Context

**Language/Version**: Java 17 (backend) · Node 20 / TypeScript (frontend)
**Primary Dependencies**:
- Backend: Spring Boot 3.x, Spring Data JPA, Flyway, SpringDoc OpenAPI 2.x, PostgreSQL driver
- Frontend: React 18, React Router 6, MUI v5, Tailwind CSS v3, Axios, React Query

**Storage**: PostgreSQL 15 — `pets` table + `pet_photos` table
**Testing**:
- Backend: JUnit 5 + Mockito + Spring Boot Test (`@WebMvcTest`, `@DataJpaTest`)
- Frontend: React Testing Library + Jest (smoke + interaction tests)

**Target Platform**: Web application — desktop and mobile browsers
**Project Type**: Full-stack web application (Spring Boot REST API + React SPA)
**Performance Goals**: Catalogue initial load ≤ 2 s; filter response ≤ 500 ms (SC-002, SC-003)
**Constraints**: No authentication required; seed data 10–30 pets; no search/sort in v1
**Scale/Scope**: Small catalogue (~30 pets), single-region deployment, no CDN required in v1

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Compliance | Notes |
|---|-----------|------------|-------|
| I | Separation of Concerns | ✅ PASS | Backend = Spring Boot REST only. Frontend = React SPA only. No server-side HTML rendering. Business logic (filtering, pagination) in service layer, not controller. |
| II | API-First Design | ✅ PASS | REST contracts defined in `contracts/` before any frontend code is written. SpringDoc generates Swagger UI automatically. |
| III | Test-First | ✅ PASS | Service-layer unit tests written before implementation. `@WebMvcTest` integration tests cover all endpoints. Frontend smoke tests required pre-merge. |
| IV | Data Integrity | ✅ PASS | PostgreSQL sole store. JPA entities with constraints. Flyway migrations manage schema and seed data. No ad-hoc mutations. |
| V | Simplicity (YAGNI) | ✅ PASS | No payment processing in this feature. Monolithic Spring Boot app + single React SPA. No additional infrastructure (no cache, no queue). |

**GATE STATUS: ALL PASS — Phase 0 research may proceed.**

## Project Structure

### Documentation (this feature)

```text
specs/001-pet-catalogue-browse/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── GET-pets.md
│   └── GET-pets-id.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (repository root)

```text
backend/                          # Maven project root (Spring Boot)
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/petstore/
    │   │   ├── PetstoreApplication.java
    │   │   ├── pet/
    │   │   │   ├── Pet.java                   # JPA entity
    │   │   │   ├── PetPhoto.java              # JPA entity
    │   │   │   ├── Category.java              # Enum: DOG, CAT, BIRD, FISH
    │   │   │   ├── PetRepository.java         # Spring Data JPA repository
    │   │   │   ├── PetService.java            # Business logic
    │   │   │   ├── PetController.java         # REST controller
    │   │   │   └── dto/
    │   │   │       ├── PetSummaryDto.java     # Card view
    │   │   │       └── PetDetailDto.java      # Detail view
    │   │   └── config/
    │   │       └── OpenApiConfig.java
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/
    │           ├── V1__create_pets_schema.sql
    │           └── V2__seed_pets.sql
    └── test/
        └── java/com/petstore/
            ├── pet/
            │   ├── PetServiceTest.java        # Unit tests (Mockito)
            │   └── PetControllerTest.java     # @WebMvcTest integration
            └── PetstoreApplicationTests.java

frontend/                         # React + Vite app root
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── api/
    │   └── petsApi.ts                # Axios API client
    ├── hooks/
    │   └── usePets.ts                # React Query hooks
    ├── pages/
    │   ├── CataloguePage.tsx         # /  — full catalogue + filter
    │   └── PetDetailPage.tsx         # /pets/:id — detail view
    ├── components/
    │   ├── PetCard.tsx
    │   ├── PetGrid.tsx
    │   ├── CategoryFilter.tsx
    │   ├── PetDetailView.tsx
    │   ├── LoadingSpinner.tsx
    │   ├── EmptyState.tsx
    │   └── ErrorState.tsx
    └── tests/
        ├── CataloguePage.test.tsx
        ├── PetCard.test.tsx
        └── CategoryFilter.test.tsx
```

**Structure Decision**: Web application (Option 2). `backend/` is the Maven/Spring Boot root;
`frontend/` is the React/Vite root. Both live at the repository root. This matches the
constitution's defined project structure and Principle I (separation of concerns).
