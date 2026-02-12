# BlockerPilot MVP

Next.js + Prisma + SQLite app for scrum blocker intake, LLM classification, Jira sync, and weekly report exports.

## Quick start

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure env
   ```bash
   cp .env.example .env
   ```
3. Create database schema
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```
4. Run
   ```bash
   npm run dev
   ```

## API endpoints

- `POST /api/blockers`: create blocker + classify + optional Jira issue create
- `GET /api/blockers`: list blockers with `status`, `category`, `sprint` filters
- `PATCH /api/blockers/:id`: update status/follow-up + optional Jira comment
- `GET /api/reports/weekly?format=json|csv|pdf`: weekly aggregates and exports

## Jira support

If `JIRA_*` env vars are set, blocker creation will create Jira tasks and comments can sync to Jira.

## LLM support

If `OPENAI_API_KEY` is unset, the app uses a deterministic fallback classifier.
