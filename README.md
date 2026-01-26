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

## How the Pieces Connect

- **Web -> API**: HTTP calls to `VITE_API_URL`.
- **Web -> Supabase**: Browser client uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **API -> Database**: API connects to Postgres via `DATABASE_URL`.

## Local Development

```
# frontend
npm run dev

# api
npm run api
```

Single command (frontend + backend):

```
npm run dev:all
```

## Local Postgres

```
cd infra/local

docker compose up -d
```

Default connection string:

```
postgresql://postgres:postgres@localhost:5432/psms?schema=public
```

## Supabase

- Hosted: create a Supabase project and copy connection strings and keys.
- Local (optional): use Supabase CLI and store config in `infra/supabase`.

See `infra/supabase/README.md`.

## AWS

High-level checklist in `infra/aws/README.md`.

## Environment Variables

Web:

```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

API:

```
DATABASE_URL=postgresql://...
JWT__ISSUER=psms
JWT__AUDIENCE=psms
JWT__SIGNINGKEY=CHANGE_ME
```
