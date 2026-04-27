---

description: "Task list for Browse Pet Catalogue with Category Filtering"
---

# Tasks: Browse Pet Catalogue with Category Filtering

**Input**: Design documents from `specs/001-pet-catalogue-browse/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅ · quickstart.md ✅

**Tests**: Test tasks are included per Constitution Principle III (Test-First). Backend
service unit tests and `@WebMvcTest` integration tests MUST be written before implementation.
Frontend smoke tests MUST pass before merge.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in all descriptions

## Path Conventions

- **Backend**: `backend/src/main/java/com/petstore/`, `backend/src/test/java/com/petstore/`
- **Frontend**: `frontend/src/`
- **Migrations**: `backend/src/main/resources/db/migration/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — backend and frontend scaffolding, tooling, and
shared config. No user story work depends on this being split into multiple steps;
all [P] tasks here can start simultaneously.

- [ ] T001 Initialize Maven Spring Boot 3.x project in `backend/` with dependencies: spring-boot-starter-web, spring-boot-starter-data-jpa, flyway-core, postgresql, springdoc-openapi-starter-webmvc-ui, spring-boot-starter-test
- [ ] T002 [P] Initialize React + Vite + TypeScript project in `frontend/` and install dependencies: react-router-dom@6, @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, tailwindcss, @tanstack/react-query, axios
- [ ] T003 [P] Configure Tailwind CSS in `frontend/tailwind.config.js` and `frontend/src/index.css` with MUI font imports
- [ ] T004 [P] Configure `backend/src/main/resources/application.yml` with datasource (PostgreSQL), JPA (ddl-auto: validate), Flyway (enabled: true), and server port 8080
- [ ] T005 [P] Configure CORS in `backend/src/main/java/com/petstore/config/WebConfig.java` allowing origin `http://localhost:5173`
- [ ] T006 [P] Configure Vite API proxy in `frontend/vite.config.ts` to forward `/api` requests to `http://localhost:8080`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure that ALL user stories depend on. No user story
can be implemented until this phase is complete.

**⚠️ CRITICAL**: Complete this entire phase before beginning any user story phase.

- [ ] T007 Create `Category` enum in `backend/src/main/java/com/petstore/pet/Category.java` with values DOG, CAT, BIRD, FISH
- [ ] T008 [P] Create Flyway migration `backend/src/main/resources/db/migration/V1__create_pets_schema.sql` — creates `pets` table (id UUID PK, name, category CHECK constraint, breed, age_months, description, price NUMERIC nullable, available BOOLEAN, created_at) and `pet_photos` table (id UUID PK, pet_id FK cascade, url, is_primary BOOLEAN, sort_order) with indexes on category, pet_id, and (pet_id, is_primary)
- [ ] T009 [P] Create Flyway migration `backend/src/main/resources/db/migration/V2__seed_pets.sql` — inserts at least 20 seed pets covering all four categories (DOG, CAT, BIRD, FISH) with corresponding primary photo rows using placehold.co URLs
- [ ] T010 Create `Pet` JPA entity in `backend/src/main/java/com/petstore/pet/Pet.java` — maps to `pets` table with UUID id (@GeneratedValue), @Enumerated(STRING) category, @OneToMany(mappedBy="pet", cascade=ALL, fetch=LAZY) photos, all field constraints
- [ ] T011 Create `PetPhoto` JPA entity in `backend/src/main/java/com/petstore/pet/PetPhoto.java` — maps to `pet_photos` table with UUID id, @ManyToOne pet, url, isPrimary, sortOrder
- [ ] T012 Create `PetSummaryDto` record in `backend/src/main/java/com/petstore/pet/dto/PetSummaryDto.java` — fields: id, name, category, breed, ageMonths, price (BigDecimal nullable), available, primaryPhotoUrl
- [ ] T013 [P] Create `PetDetailDto` record in `backend/src/main/java/com/petstore/pet/dto/PetDetailDto.java` — extends summary fields with: description, photos (List<PhotoDto>)
- [ ] T014 [P] Create `PhotoDto` record in `backend/src/main/java/com/petstore/pet/dto/PhotoDto.java` — fields: url, isPrimary
- [ ] T015 Create `PetRepository` interface in `backend/src/main/java/com/petstore/pet/PetRepository.java` — extends JpaRepository<Pet, UUID> with query method: `Page<Pet> findByCategoryIn(List<Category> categories, Pageable pageable)` and `Page<Pet> findAll(Pageable pageable)`
- [ ] T016 [P] Configure OpenAPI/Swagger in `backend/src/main/java/com/petstore/config/OpenApiConfig.java` — sets API title "Petstore API", version "1.0.0", description
- [ ] T017 [P] Configure React Query client in `frontend/src/main.tsx` — wrap app with `QueryClientProvider`; configure `ReactRouter` with routes `/` → CataloguePage and `/pets/:id` → PetDetailPage in `frontend/src/App.tsx`
- [ ] T018 [P] Create Axios API client in `frontend/src/api/petsApi.ts` — exports `getPets(categories: string[], page: number, size: number)` and `getPetById(id: string)` functions using the base URL from `import.meta.env.VITE_API_BASE_URL`

**Checkpoint**: Backend compiles, Flyway migrations run, pets table seeded. Frontend dev server starts. Foundation ready — user story phases can begin.

---

## Phase 3: User Story 1 — Browse All Pets (Priority: P1) 🎯 MVP

**Goal**: Visitor opens Petstore and sees a full paginated grid of all pets, each card
showing photo, name, category, and price. Empty state and error state handled.

**Independent Test**: Run `npm run dev` + `mvn spring-boot:run`. Open `http://localhost:5173`.
Pet grid loads with cards for all four categories. No filter applied. Matches quickstart
manual check #1.

### Backend — Unit Tests for US1 (write first, verify they fail)

- [ ] T019 [P] [US1] Write `PetServiceTest` in `backend/src/test/java/com/petstore/pet/PetServiceTest.java` — test cases: `getAllPets_returnsPageOfSummaryDtos`, `getAllPets_emptyResult_returnsEmptyPage`, `getAllPets_nullPrice_returnedAsNull` (use Mockito to mock PetRepository)
- [ ] T020 [P] [US1] Write `PetControllerTest` (GET /api/pets, no filter) in `backend/src/test/java/com/petstore/pet/PetControllerTest.java` — test cases: `getPets_noFilter_returns200WithContent`, `getPets_emptyDb_returns200WithEmptyContent`, `getPets_invalidPaginationParams_returns400` (use @WebMvcTest, MockMvc)

### Backend — Implementation for US1

- [ ] T021 [US1] Implement `PetService.getAllPets(List<Category> categories, Pageable pageable)` in `backend/src/main/java/com/petstore/pet/PetService.java` — calls repository, maps Pet → PetSummaryDto (extract primaryPhotoUrl from photos where isPrimary=true), returns Page<PetSummaryDto>
- [ ] T022 [US1] Implement `PetController.getPets(...)` in `backend/src/main/java/com/petstore/pet/PetController.java` — @GetMapping("/api/pets"), @RequestParam(required=false) List<Category> category, @PageableDefault(size=12) Pageable pageable; delegates to PetService; returns ResponseEntity<Page<PetSummaryDto>>; validates size ≤ 50
- [ ] T023 [US1] Add global exception handler `backend/src/main/java/com/petstore/config/GlobalExceptionHandler.java` — @RestControllerAdvice handling MethodArgumentTypeMismatchException (invalid category → 400 with error message) and generic Exception → 500

### Frontend — Implementation for US1

- [ ] T024 [P] [US1] Create `usePets` React Query hook in `frontend/src/hooks/usePets.ts` — `useQuery` calling `petsApi.getPets`, accepts categories array and page number, returns `{ data, isLoading, isError, refetch }`
- [ ] T025 [P] [US1] Create `PetCard` component in `frontend/src/components/PetCard.tsx` — MUI Card with pet photo (onError fallback to placeholder), name, category chip, price (or "Contact us for pricing" if null), availability badge; clicking navigates to `/pets/:id`
- [ ] T026 [P] [US1] Create `LoadingSpinner` component in `frontend/src/components/LoadingSpinner.tsx` — centered MUI CircularProgress with accessible aria-label
- [ ] T027 [P] [US1] Create `EmptyState` component in `frontend/src/components/EmptyState.tsx` — MUI Box with icon, configurable message prop, e.g. "No pets available at the moment"
- [ ] T028 [P] [US1] Create `ErrorState` component in `frontend/src/components/ErrorState.tsx` — MUI Alert (severity="error") with message and a "Retry" button that calls a passed `onRetry` callback
- [ ] T029 [US1] Create `PetGrid` component in `frontend/src/components/PetGrid.tsx` — MUI Grid container rendering list of PetCard; handles loading (LoadingSpinner), error (ErrorState with onRetry), empty (EmptyState), and populated states; accepts pets array, isLoading, isError, onRetry props
- [ ] T030 [US1] Create `CataloguePage` (browse all, no filter) in `frontend/src/pages/CataloguePage.tsx` — reads `category` from URL search params (useSearchParams), calls usePets hook with empty categories array, renders PetGrid; include MUI Pagination component at bottom when totalPages > 1

### Frontend — Smoke Tests for US1

- [ ] T031 [P] [US1] Write smoke test for `PetCard` in `frontend/src/tests/PetCard.test.tsx` — renders with mock pet data, shows name and category, navigates on click (use React Testing Library + MemoryRouter)
- [ ] T032 [P] [US1] Write smoke test for `CataloguePage` in `frontend/src/tests/CataloguePage.test.tsx` — mocks React Query, verifies loading spinner shown then pet cards rendered; verifies error state shown when query fails with Retry button

**Checkpoint**: US1 complete and independently testable. `mvn test` passes. Visit `http://localhost:5173` — all pets display in grid. Retry button works when backend down.

---

## Phase 4: User Story 2 — Filter by Category (Priority: P2)

**Goal**: Visitor selects one or more category filters (Dogs/Cats/Birds/Fish). Catalogue
updates instantly to show only matching pets. Filter state persists in the URL.

**Independent Test**: Select "Birds" filter → only birds shown. Select "Dogs" additionally
→ dogs and birds shown. Click "All" → all pets return. Copy URL with `?category=BIRD`,
open new tab → Birds filter active. Matches quickstart checks #2–5.

### Backend — Unit Tests for US2 (write first, verify they fail)

- [ ] T033 [P] [US2] Write `PetServiceTest` category filter test cases in `backend/src/test/java/com/petstore/pet/PetServiceTest.java` — add: `getPetsByCategory_DOG_returnsOnlyDogs`, `getPetsByCategory_multipleCategories_returnsMatching`, `getPetsByCategory_noMatch_returnsEmptyPage` (Mockito mock repository)
- [ ] T034 [P] [US2] Write `PetControllerTest` category filter test cases in `backend/src/test/java/com/petstore/pet/PetControllerTest.java` — add: `getPets_filterByDog_returns200WithDogsOnly`, `getPets_filterByMultipleCategories_returns200WithMatching`, `getPets_invalidCategoryValue_returns400`

### Backend — Implementation for US2

- [ ] T035 [US2] Update `PetService.getAllPets` in `backend/src/main/java/com/petstore/pet/PetService.java` — when categories list is non-empty call `findByCategoryIn`, otherwise `findAll`; no other change needed (contract already designed for this)
- [ ] T036 [US2] Verify `PetController.getPets` correctly passes List<Category> to service (already wired in T022); add @Operation annotation documenting the `category` query param and its allowed values for Swagger UI

### Frontend — Implementation for US2

- [ ] T037 [P] [US2] Create `CategoryFilter` component in `frontend/src/components/CategoryFilter.tsx` — row of MUI ToggleButton items (All, Dogs, Cats, Birds, Fish); supports multi-select; "All" clears all selections; selected state highlighted; accessible aria-labels; fires `onFilterChange(categories: string[])` callback
- [ ] T038 [US2] Update `CataloguePage` in `frontend/src/pages/CataloguePage.tsx` — add CategoryFilter above PetGrid; read/write category filter state via `useSearchParams` (e.g. `?category=DOG&category=CAT`); pass categories to `usePets` hook; reset page to 0 when filter changes; show "No [Category] available right now" via EmptyState when result is empty with active filter

### Frontend — Smoke Tests for US2

- [ ] T039 [P] [US2] Write smoke test for `CategoryFilter` in `frontend/src/tests/CategoryFilter.test.tsx` — renders all four category buttons plus "All"; clicking Dogs calls onFilterChange with ['DOG']; clicking All calls onFilterChange with []; clicking multiple categories accumulates selection

**Checkpoint**: US1 + US2 independently functional. Filter buttons appear on catalogue page, clicking updates URL and displayed pets. All tests pass.

---

## Phase 5: User Story 3 — View Pet Detail (Priority: P3)

**Goal**: Visitor clicks a pet card and sees a full detail page: description, photos,
age, availability, and an "Add to Cart" button (disabled if unavailable). Back button
returns to catalogue with filter intact.

**Independent Test**: Click any pet card → detail page loads. Verify all fields. Find
an unavailable pet (Mochi) → "Add to Cart" disabled + "Currently Unavailable" shown.
Press back → catalogue with previous filter active. Matches quickstart checks #6–7.

### Backend — Unit Tests for US3 (write first, verify they fail)

- [ ] T040 [P] [US3] Write `PetServiceTest` detail test cases in `backend/src/test/java/com/petstore/pet/PetServiceTest.java` — add: `getPetById_exists_returnsPetDetailDto`, `getPetById_notFound_throwsException`, `getPetById_unavailablePet_returnsAvailableFalse`, `getPetById_photosOrderedBySortOrder`
- [ ] T041 [P] [US3] Write `PetControllerTest` detail test cases in `backend/src/test/java/com/petstore/pet/PetControllerTest.java` — add: `getPetById_validId_returns200WithDetail`, `getPetById_notFound_returns404`, `getPetById_invalidUuid_returns400`

### Backend — Implementation for US3

- [ ] T042 [US3] Implement `PetService.getPetById(UUID id)` in `backend/src/main/java/com/petstore/pet/PetService.java` — fetch by id, throw `PetNotFoundException` (extends RuntimeException) if absent, map Pet + sorted PetPhotos → PetDetailDto
- [ ] T043 [US3] Create `PetNotFoundException` in `backend/src/main/java/com/petstore/pet/PetNotFoundException.java` — RuntimeException with message "Pet not found: {id}"
- [ ] T044 [US3] Add `@ExceptionHandler(PetNotFoundException.class)` to `GlobalExceptionHandler` in `backend/src/main/java/com/petstore/config/GlobalExceptionHandler.java` — returns 404 with body `{"error": "Pet not found: {id}"}`
- [ ] T045 [US3] Add `PetController.getPetById(@PathVariable UUID id)` to `backend/src/main/java/com/petstore/pet/PetController.java` — @GetMapping("/api/pets/{id}"), delegates to service, returns ResponseEntity<PetDetailDto>; add @Operation Swagger annotation

### Frontend — Implementation for US3

- [ ] T046 [P] [US3] Create `usePet` React Query hook in `frontend/src/hooks/usePets.ts` — `useQuery(['pet', id], () => petsApi.getPetById(id))` returning `{ data, isLoading, isError }`
- [ ] T047 [P] [US3] Create `PetDetailView` component in `frontend/src/components/PetDetailView.tsx` — MUI layout: photo gallery (primary photo large, thumbnails below), pet name as Typography h4, category chip, breed, age (display months as "X months" or "X years Y months"), price (or "Contact us"), description, availability badge, "Add to Cart" MuiButton (disabled + "Currently Unavailable" label when available=false)
- [ ] T048 [US3] Create `PetDetailPage` in `frontend/src/pages/PetDetailPage.tsx` — reads `:id` from useParams, calls usePet hook, renders: LoadingSpinner while loading, ErrorState (with back button) on error/404, PetDetailView on success; MUI Breadcrumbs showing "Home > [Pet Name]"; Back button uses `useNavigate(-1)` to preserve catalogue URL + filter

**Checkpoint**: All three user stories independently functional and tested. Full end-to-end flow: browse → filter → detail → back → filter preserved.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories, final validation per quickstart.

- [ ] T049 [P] Add mobile responsiveness — verify `PetGrid` uses MUI Grid breakpoints (xs=12, sm=6, md=4, lg=3) in `frontend/src/components/PetGrid.tsx`; verify `PetDetailView` stacks vertically on small screens in `frontend/src/components/PetDetailView.tsx`
- [ ] T050 [P] Add page `<title>` management — "Petstore — Browse Pets" on CataloguePage and "Petstore — [Pet Name]" on PetDetailPage using `document.title` in `frontend/src/pages/CataloguePage.tsx` and `frontend/src/pages/PetDetailPage.tsx`
- [ ] T051 [P] Add image fallback handler — in `frontend/src/components/PetCard.tsx` and `frontend/src/components/PetDetailView.tsx` set `onError` on all `<img>` elements to swap `src` to `/placeholder-pet.png`; add `placeholder-pet.png` to `frontend/public/`
- [ ] T052 [P] Add 400 error handling for invalid URL category params — in `frontend/src/pages/CataloguePage.tsx` catch axios 400 response from usePets and strip invalid category params from URL before retrying (per contracts/GET-pets.md behaviour note)
- [ ] T053 Run full quickstart validation from `specs/001-pet-catalogue-browse/quickstart.md` — execute all 10 manual checks and all curl API checks; fix any failures before marking done
- [ ] T054 [P] Run `mvn test` in `backend/` — all unit and integration tests must pass
- [ ] T055 [P] Run `npm test -- --watchAll=false` in `frontend/` — all smoke tests must pass
- [ ] T056 [P] Verify Swagger UI at `http://localhost:8080/swagger-ui.html` — both endpoints documented with query params, response schemas, and error codes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately. All [P] tasks run in parallel.
- **Foundational (Phase 2)**: Depends on Phase 1 completion. Blocks ALL user story phases.
- **US1 (Phase 3)**: Depends on Phase 2 (Foundation). No dependency on US2 or US3.
- **US2 (Phase 4)**: Depends on Phase 2. Can start in parallel with US1 after foundation.
  Integrates with US1's `CataloguePage` and `usePets` (extend, don't replace).
- **US3 (Phase 5)**: Depends on Phase 2. Can start in parallel with US1/US2 after foundation.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1**: After Foundation complete → fully independent.
- **US2**: After Foundation complete → extends US1's CataloguePage and usePets hook; US2 does not block US1.
- **US3**: After Foundation complete → adds new page and service method; does not affect US1/US2.

### Within Each User Story

1. Write tests → verify they fail (Constitution Principle III)
2. Implement models / entities
3. Implement services
4. Implement controllers / endpoints
5. Implement frontend components
6. Run tests → verify they pass
7. Manual validation against quickstart

### Parallel Opportunities

- All Setup tasks marked [P] run simultaneously
- All Foundation tasks marked [P] run simultaneously after T007
- Once Foundation is complete: US1, US2, US3 backend work can proceed in parallel
- Within each story: all tasks marked [P] have no file conflicts and run simultaneously

---

## Parallel Example: User Story 1

```bash
# Launch all backend US1 test writing tasks together (they target different test methods):
Task: "Write PetServiceTest US1 cases in PetServiceTest.java"           # T019
Task: "Write PetControllerTest US1 cases in PetControllerTest.java"    # T020

# Launch all frontend US1 leaf components together (different files):
Task: "Create PetCard in frontend/src/components/PetCard.tsx"          # T025
Task: "Create LoadingSpinner in frontend/src/components/LoadingSpinner.tsx"  # T026
Task: "Create EmptyState in frontend/src/components/EmptyState.tsx"    # T027
Task: "Create ErrorState in frontend/src/components/ErrorState.tsx"    # T028
Task: "Create usePets hook in frontend/src/hooks/usePets.ts"           # T024
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**CRITICAL — blocks all stories**)
3. Complete Phase 3: User Story 1
4. **STOP AND VALIDATE**: Run `mvn test`, run `npm test`, open `http://localhost:5173`, verify all pets display
5. Deploy / demo if ready

### Incremental Delivery

1. Setup + Foundation → scaffold ready
2. **+ US1** → Full catalogue browsing works (**MVP!**)
3. **+ US2** → Category filtering works (add on top of US1)
4. **+ US3** → Pet detail pages work
5. **+ Polish** → Mobile, titles, edge cases hardened

### Parallel Team Strategy (3 developers after Foundation)

- **Dev A**: US1 backend (T019–T023) → US2 backend (T033–T036) → US3 backend (T040–T045)
- **Dev B**: US1 frontend (T024–T032) → US2 frontend (T037–T039) → Polish (T049–T052)
- **Dev C**: US3 frontend (T046–T048) → Polish + validation (T053–T056)

---

## Notes

- `[P]` = safe to run in parallel (different files, no dependencies on incomplete work)
- `[USn]` label maps every task to its user story for traceability
- Test tasks MUST be written and confirmed FAILING before implementation (Principle III)
- Models before services; services before controllers; controllers before frontend integration
- Commit after each phase checkpoint
- Stop at any checkpoint to validate that story independently before continuing
