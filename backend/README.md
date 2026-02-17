# BMS Backend

Node.js + Express + TypeScript backend for Blocker Management System (BMS).

## Tech
- Express API
- Prisma ORM
- SQLite database
- JWT auth

## Run locally
1. `cd backend && npm i`
2. `npx prisma migrate dev --name init`
3. `npm run dev`

Backend runs on `http://localhost:4000` by default.

## Environment
Use `backend/.env`:
- `PORT=4000`
- `DATABASE_URL="file:./dev.db"`
- `JWT_SECRET="super-secret-change-me"`
- `CORS_ORIGIN="http://localhost:5173"`

## API overview
Public:
- `POST /api/auth/register`
- `POST /api/auth/login`

Protected (Bearer token):
- Projects CRUD: `/api/projects`
- Sprints CRUD: `/api/sprints`
- Tasks CRUD: `/api/tasks`
- Blockers CRUD: `/api/blockers`
- Reports:
  - `GET /api/reports/summary?type=daily|weekly`
  - `GET /api/reports/sprint-health`
  - `GET /api/reports/export.csv?type=daily|weekly`

## Project health computation
Used in project listing and health endpoint:
- `progress = done / total`
- `timeElapsed = (now - sprintStart) / (sprintEnd - sprintStart)` (clamped 0..1)
- Health rules:
  - `OFF_TRACK` if blocked ratio >= 40%
  - Otherwise compare progress vs time elapsed:
    - `ON_TRACK` if `progress + 0.1 >= timeElapsed`
    - `AT_RISK` if `progress + 0.25 >= timeElapsed`
    - else `OFF_TRACK`
