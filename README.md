# Military Asset Management System

## Project Overview

This system manages military equipment movement across bases with role-aware access control, JWT authentication, and API audit logging. It includes a React dashboard for operational visibility and an Express/Prisma backend backed by PostgreSQL.

## Tech Stack Justification

- React with Vite gives a fast UI build pipeline and a lightweight SPA runtime.
- Tailwind CSS keeps the interface consistent and efficient to maintain.
- Node.js with Express provides a simple REST API layer for business rules and middleware.
- PostgreSQL is a strong relational fit for base, user, equipment, and transaction data.
- Prisma ORM provides typed data access and schema-driven migrations.
- JWT authentication works well for stateless API access.
- Middleware-based RBAC keeps access checks centralized and predictable.
- Middleware logging creates a tamper-resistant transaction trail for every authenticated API action.

## Data Models

- Users: stores identity, email, password hash, role, and optional base assignment.
- Bases: stores base name and location.
- Equipment: stores equipment name and type.
- Purchases: records equipment procurement by base and timestamp.
- Transfers: records equipment movement between bases.
- Assignments: records equipment issued to personnel at a base.
- Expenditures: records consumed or written-off assets.
- Logs: stores authenticated user action, endpoint, and timestamp.

Relationships are enforced through Prisma foreign keys so the asset history remains consistent across modules.

## RBAC

- Admin: full access to all modules, bases, equipment, and logs.
- Base Commander: access is scoped to their assigned base; they can manage assignments and expenditures for that base.
- Logistics Officer: limited to purchases and transfers.

Role enforcement is applied in backend middleware rather than in the client so access rules are protected even if the UI is bypassed.

## API Logging

Every authenticated request is captured by middleware after the response finishes. Each log entry stores the user id, action, endpoint, and timestamp. This provides a system-wide activity trail for audits and incident review.

## Setup Steps

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 14+

### 2. Backend setup

```bash
cd backend
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

If Docker is available, `docker compose up -d` will start a PostgreSQL container. In this environment, the project uses a local PostgreSQL 15 instance on port 5433.

### 3. Frontend setup

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

### 4. Database

Set `DATABASE_URL` in `backend/.env` to point at your PostgreSQL database. The Prisma schema is located at `backend/prisma/schema.prisma`.

## Sample Login Credentials

- Admin: `admin@mil.com` / `password123`
- Commander: `commander@mil.com` / `password123`
- Logistics: `logistics@mil.com` / `password123`

## API Endpoints

### Authentication

- `POST /api/auth/login`
- `GET /api/auth/me`

### Dashboard

- `GET /api/dashboard`

### Bases

- `GET /api/bases`
- `POST /api/bases`

### Equipment

- `GET /api/equipment`
- `POST /api/equipment`

### Purchases

- `GET /api/purchases`
- `POST /api/purchases`

### Transfers

- `GET /api/transfers`
- `POST /api/transfers`

### Assignments

- `GET /api/assignments`
- `POST /api/assignments`

### Expenditures

- `GET /api/expenditures`
- `POST /api/expenditures`

### Logs

- `GET /api/logs`

## Notes

- JWT is stored in `localStorage` on the frontend.
- The dashboard net movement modal breaks the total into purchases, transfers in, and transfers out.
- Base commanders are restricted to their own base by backend checks.
- Logistics officers can create and view purchases and transfers, but not assignments or expenditure entries.
