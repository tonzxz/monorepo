# Supabase Setup

Folder for Supabase-related configuration, migrations, and seed data.

## Structure (and purpose)

```
infra/supabase/
  migrations/   # Supabase SQL migrations (if using Supabase CLI)
  seed/         # Seed scripts/data
  config.toml   # Supabase CLI config
```

## Hosted Supabase

- Create a project in Supabase.
- Copy the Postgres connection string for `DATABASE_URL` (Prisma + API).
- Use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the web app.
- Keep `SUPABASE_SERVICE_ROLE_KEY` for server-only usage.
