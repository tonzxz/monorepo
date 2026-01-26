# Web App (React + Vite)

Frontend for the PSMS monorepo. This app will use TanStack Query, shadcn/ui,
and Supabase client when wired in.

## Structure (and purpose)

```
apps/web/
  public/                 # Static assets copied as-is
  src/
    app/                  # App wiring: routes, layouts, providers
    components/
      ui/                 # shadcn/ui components (generated)
      common/             # App-specific shared components
    features/             # Feature modules (inventory, auth, etc.)
    hooks/                # Cross-feature hooks
    lib/
      api/                # API client + fetch helpers
      supabase/           # Supabase client config
      query/              # TanStack Query setup
      utils.ts            # Shared helpers
    styles/               # Global CSS + tokens
    types/                # TS types not in packages/shared
    main.tsx              # App entry
    App.tsx               # Root component
  index.html              # Vite HTML shell
  vite.config.ts          # Vite config
  tsconfig*.json          # TS configs
```

## How It Connects

- Calls the backend via `VITE_API_URL`.
- Uses Supabase client with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Can import shared DTOs from `packages/shared`.

## Run Locally

```
npm run dev
```

## Build

```
npm run build
```

## Environment Variables

```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
