<!--
SYNC IMPACT REPORT
==================
Version change: (unversioned template) → 1.0.0
Added sections:
  - Core Principles (I–V)
  - Technology Stack
  - Development Workflow
  - Governance
Modified principles: N/A (initial constitution)
Removed sections: N/A (initial constitution)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ aligned (Constitution Check section references this file dynamically)
  - .specify/templates/spec-template.md ✅ aligned (no mandatory sections changed)
  - .specify/templates/tasks-template.md ✅ aligned (task categories reflect principles)
Follow-up TODOs: None — all placeholders resolved.
-->

# Petstore Constitution

## Core Principles

### I. Separation of Concerns (NON-NEGOTIABLE)

The backend (Spring Boot REST API) and frontend (React SPA) MUST remain strictly decoupled.
Business logic MUST live exclusively in the backend service layer. Presentation logic
MUST NOT leak into backend controllers. The frontend MUST communicate with the backend
only through defined REST API contracts — no direct database access from the frontend,
no HTML rendering from the server.

**Rationale**: Enables independent development, testing, and deployment of each tier.
Allows the frontend or backend to evolve without breaking the other.

### II. API-First Design

All backend capabilities MUST be defined and documented as REST API endpoints before
any frontend integration begins. Every endpoint MUST be documented via Swagger/OpenAPI
(SpringDoc). API contracts are the authoritative interface definition — implementation
follows the contract, not the other way around.

**Rationale**: Prevents frontend/backend coupling from forming at the design stage.
Enables parallel development and provides a testable contract boundary.

### III. Test-First (NON-NEGOTIABLE)

TDD MUST be applied to all backend service-layer logic. The workflow is:
1. Write unit tests for the service → confirm they fail.
2. Implement the service → tests must pass.
3. Write integration tests for API endpoints → confirm they pass end-to-end.

Frontend components MUST have at least smoke-level tests before merge. No feature is
complete until its acceptance scenarios from the spec are verified by automated tests
or documented manual steps.

**Rationale**: Prevents regressions and ensures each increment is independently verifiable.

### IV. Data Integrity & Single Source of Truth

PostgreSQL is the sole persistent data store. All entities MUST be mapped via JPA/Hibernate
with proper constraints (non-null, unique, foreign keys). Database schema changes MUST
use versioned migration scripts (Flyway). No ad-hoc schema mutations are permitted in
any environment. Seed data for pet catalogue MUST be managed via migration scripts,
not application code.

**Rationale**: Ensures reproducibility across environments and prevents schema drift.

### V. Simplicity & Simulated Commerce (YAGNI)

Payment processing is a SIMULATION ONLY — no real payment gateway integration is required
or permitted in this project. The cart and checkout flow MUST simulate the payment step
with a mock confirmation response. No microservices, no message brokers, no distributed
caching unless a specific, justified bottleneck demands it. Start with a monolithic Spring
Boot application and a single React SPA.

**Rationale**: Keeps the scope focused on demonstrating e-commerce UX patterns without
the complexity and compliance overhead of real payment processing.

## Technology Stack

The following technology choices are FIXED for this project. Deviations require a
constitution amendment.

| Tier | Technology | Version Guidance |
|------|-----------|-----------------|
| Backend Language | Java | 17 LTS or higher |
| Backend Framework | Spring Boot | 3.x (Jakarta EE) |
| Build Tool | Maven | 3.8+ |
| Database | PostgreSQL | 15+ |
| ORM / Migrations | Spring Data JPA + Flyway | Latest stable |
| API Documentation | SpringDoc OpenAPI (Swagger UI) | 2.x |
| Frontend Framework | React | 18+ |
| UI Component Library | MUI (Material UI) | v5+ |
| Styling | Tailwind CSS | v3+ |
| Frontend Build | Vite or Create React App | Latest stable |
| Testing (backend) | JUnit 5 + Mockito + Spring Boot Test | Bundled with Spring Boot |
| Testing (frontend) | React Testing Library + Jest | Latest stable |

**Project structure**: `backend/` (Maven project root) + `frontend/` (React app root)
at the repository root.

## Development Workflow

- **Feature branches**: All work MUST be done on a feature branch. No direct commits to
  `main` or `develop`.
- **API contract first**: Backend endpoint contract (path, method, request/response schema)
  MUST be agreed upon before implementation begins.
- **Constitution Check** (required in every plan.md): Each plan MUST explicitly verify
  compliance with all five Core Principles before Phase 0 research may begin.
- **Definition of Done**:
  - Backend: Unit tests pass, integration tests pass, Swagger docs updated.
  - Frontend: Component renders correctly, cart/payment simulation flows work end-to-end.
  - Both tiers: No compilation errors, no console errors in browser, feature tested
    against acceptance scenarios in spec.
- **Pet catalogue scope**: Products are limited to four categories — Dogs, Cats, Birds,
  Fish. New categories require a constitution amendment.
- **Complexity justification**: Any introduction of a new infrastructure dependency
  (cache, queue, external service) MUST be documented in the plan's Complexity Tracking
  table with a rejected simpler alternative.

## Governance

This constitution supersedes all other development guidelines, README instructions,
and ad-hoc agreements. When a conflict exists, the constitution wins.

**Amendment procedure**:
1. Propose the amendment in a pull request description citing the principle affected.
2. Document the rationale and any migration plan for existing code.
3. Increment `CONSTITUTION_VERSION` following semantic versioning:
   - MAJOR: Principle removal, redefinition, or incompatible stack change.
   - MINOR: New principle, new section, or materially expanded guidance.
   - PATCH: Clarifications, wording fixes, non-semantic refinements.
4. Update `LAST_AMENDED_DATE` to the date of merge.
5. Propagate changes to all dependent templates (plan, spec, tasks) before merging.

**Compliance review**: Every plan.md MUST include a Constitution Check section that
explicitly maps each principle to the proposed implementation approach.

**Version**: 1.0.0 | **Ratified**: 2026-04-25 | **Last Amended**: 2026-04-25
