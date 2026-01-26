# Web App (React + Vite)

Frontend for the PSMS monorepo. This app will use TanStack Query, shadcn/ui,
and Supabase client when wired in. The structure below includes RBAC support
for a dashboard-style app.

## Structure (and purpose)

```
apps/web/
  public/                 # Static assets copied as-is
  src/
    app/                  # App wiring: routes, layouts, providers
      rbac/               # RBAC helpers (roles, permissions, guards)
        roles.ts          # Role definitions
        permissions.ts    # Permission map
        guard.tsx         # Route/feature guard
        ability.ts        # Helpers to check access
    components/
      ui/                 # shadcn/ui components (generated)
      common/             # App-specific shared components
      guards/             # UI guards (RoleGate, PermissionGate)
    features/             # Feature modules (inventory, auth, etc.)
      auth/               # Auth flows (login, register, profile)
      dashboard/          # Dashboard pages/widgets
      inventory/          # Inventory CRUD UI
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

## RBAC (Role-Based Access Control)

Recommended approach:

- Roles (e.g. `Admin`, `User`) live in `src/app/rbac/roles.ts`.
- Permissions (e.g. `inventory:read`, `inventory:write`) live in `src/app/rbac/permissions.ts`.
- Guards for routes and UI live in `src/app/rbac/guard.tsx` and `src/components/guards/*`.

Example shape:

```
// roles.ts
export type Role = "Admin" | "User";

// permissions.ts
export type Permission =
  | "inventory:read"
  | "inventory:write";

export const rolePermissions: Record<Role, Permission[]> = {
  Admin: ["inventory:read", "inventory:write"],
  User: ["inventory:read"]
};
```

Route guard idea:

```
<RequireRole roles={["Admin"]}>
  <AdminPage />
</RequireRole>
```

Where to enforce:
- **Frontend**: hide/disable UI based on role/permission.
- **Backend**: always enforce with JWT claims/roles (authoritative).

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
