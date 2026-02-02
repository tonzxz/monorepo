# PSMS Monorepo

Full-stack monorepo with React (Vite) on the frontend and ASP.NET Core on the backend.

## Repo Layout (and purpose)

```
/
  apps/
    web/                     # React + Vite frontend app
  services/
    api/                     # ASP.NET Core API (layered)
  packages/
    shared/                  # Shared TS types/DTOs (optional)
  infra/
    local/                   # Local Postgres (Docker)
    supabase/                # Supabase config/migrations/seed
    aws/                     # AWS setup notes
  tools/                     # Scripts, generators, local tooling
  docs/                      # Architecture notes, ADRs
```

Frontend feature structure:

```
apps/web/src/features/
  enduser/
    app/                     # End-user app pages (dashboard, etc.)
    ppmp/                    # End-user PPMP pages (inventory, etc.)
  shared/
    ppmp/                    # Shared PPMP pages (Enduser + Inspection)
  superadmin/
    user-management/         # Super admin pages
    department-management/
    approval-sequence/
  auth/
  not-found/
```

RBAC access rules live in `apps/web/src/app/rbac/permissions.ts`. Use roles + permissions
directly in routes and sidebar items.

## How the Pieces Connect

- **Web -> API**: HTTP calls to `VITE_API_URL`.
- **Web -> Supabase**: Browser client uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **API -> Database**: API connects to Postgres via `DATABASE_URL`.

## Getting Started

### 1) Install dependencies

```
npm install
```

### 1b) Install .NET SDK (API)

Install the .NET SDK (10.x) from Microsoft, then restore the API:

```
cd services/api/src/Api
dotnet restore
```

### 2) Configure environment variables

Web (`apps/web/.env`):

```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

API (`services/api/.env`):

```
DATABASE_URL=postgresql://...
JWT__ISSUER=psms
JWT__AUDIENCE=psms
JWT__SIGNINGKEY=CHANGE_ME
```

### 3) Run local Postgres (optional)

```
cd infra/local
docker compose up -d
```

Default connection string:

```
postgresql://postgres:postgres@localhost:5432/psms?schema=public
```

### 4) Run the apps

Frontend:

```
npm run dev
```

API:

```
npm run api
```

Single command (frontend + API):

```
npm run dev:all
```

## Supabase

- Hosted: create a Supabase project and copy connection strings and keys.
- Local (optional): use Supabase CLI and store config in `infra/supabase`.

See `infra/supabase/README.md`.

## AWS

High-level checklist in `infra/aws/README.md`.

## Database & Migrations

See `services/api/DATABASE_COMMANDS.md` for migrations, updates, and seeding.
