# Quickstart: Browse Pet Catalogue with Category Filtering

**Feature**: `001-pet-catalogue-browse`
**Date**: 2026-04-25

This guide walks through running the full stack locally and verifying the feature end-to-end.

---

## Prerequisites

| Tool | Minimum Version | Install |
|------|----------------|---------|
| Java | 17 | [adoptium.net](https://adoptium.net/) |
| Maven | 3.8 | [maven.apache.org](https://maven.apache.org/) |
| Node.js | 20 | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | 15 | [postgresql.org](https://www.postgresql.org/) |

---

## 1. Database Setup

```bash
# Create database and user
psql -U postgres -c "CREATE DATABASE petstore;"
psql -U postgres -c "CREATE USER petstore_user WITH PASSWORD 'petstore_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE petstore TO petstore_user;"
```

Flyway migrations run automatically on Spring Boot startup — no manual schema creation needed.

---

## 2. Backend Setup

```bash
cd backend

# Configure database connection (copy and edit)
cp src/main/resources/application.yml src/main/resources/application-local.yml
```

Edit `application.yml` (or set environment variables):

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/petstore
    username: petstore_user
    password: petstore_pass
  jpa:
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true
```

```bash
# Run backend (Flyway migrations + seed data apply on first start)
mvn spring-boot:run

# Verify: Swagger UI available at
open http://localhost:8080/swagger-ui.html
```

---

## 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure API base URL (dev proxy or env var)
# Create .env.local:
echo "VITE_API_BASE_URL=http://localhost:8080" > .env.local

# Start dev server
npm run dev

# App available at:
open http://localhost:5173
```

---

## 4. Verify End-to-End

### Manual checks

1. **Browse all pets**: Open `http://localhost:5173`. Confirm pet grid loads with cards
   showing photo, name, category, price.
2. **Filter by category**: Click "Dogs". Confirm only dogs are shown. "Dogs" filter
   appears active.
3. **Multi-filter**: Click "Cats" while "Dogs" is active. Confirm both dogs and cats show.
4. **Clear filter**: Click "All" or "Clear". Confirm all pets return.
5. **URL persistence**: Apply "Birds" filter. Copy the URL (should contain `?category=BIRD`).
   Open in new tab. Confirm "Birds" filter is active.
6. **Pet detail**: Click any pet card. Confirm detail page loads with full description,
   photos, and "Add to Cart" button.
7. **Unavailable pet**: Find a pet with `available=false` (e.g., Mochi the Persian cat).
   Confirm "Add to Cart" is disabled and "Currently Unavailable" label is shown.
8. **Empty state**: Temporarily filter by a category with no pets (none in seed) — confirm
   friendly empty-state message.
9. **Image fallback**: In browser DevTools, block image requests. Confirm placeholder
   image appears.
10. **Error state**: Stop the backend. Refresh the frontend. Confirm error message with
    "Retry" button appears.

### Backend API checks (curl / Swagger UI)

```bash
# All pets
curl http://localhost:8080/api/pets | jq .

# Filter dogs only
curl "http://localhost:8080/api/pets?category=DOG" | jq .

# Multi-category
curl "http://localhost:8080/api/pets?category=DOG&category=CAT" | jq .

# Pet detail
curl http://localhost:8080/api/pets/a1b2c3d4-0001-0000-0000-000000000001 | jq .

# Invalid category → 400
curl -i "http://localhost:8080/api/pets?category=DRAGON"

# Not found → 404
curl -i http://localhost:8080/api/pets/00000000-0000-0000-0000-000000000000
```

---

## 5. Running Tests

```bash
# Backend unit + integration tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test -- --watchAll=false
```

All tests must pass before the feature is considered done (Constitution Principle III).

---

## 6. Swagger UI

With the backend running, full API documentation is available at:

```
http://localhost:8080/swagger-ui.html
```

Endpoints documented:
- `GET /api/pets` — List pets with optional category filter
- `GET /api/pets/{id}` — Get pet detail
