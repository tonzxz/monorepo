# RBAC System & App Architecture Documentation

## 📁 App Folder Structure Overview

```
src/app/
├── layouts/           # Layout components (AppLayout.tsx)
├── providers/         # Context providers (Auth, Theme, etc.)
├── rbac/             # Role-Based Access Control system
├── routes/           # Route definitions (currently empty)
└── router.tsx        # Main application router
```

---

## 🏗️ Folder Functions Explained

### 1. **`layouts/`** - Application Layouts
**Purpose**: Contains layout components that wrap pages with common UI elements.

**Files**:
- `AppLayout.tsx` - Main application layout wrapper

**Usage Example**:
```tsx
// AppLayout.tsx - wraps authenticated pages
export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  )
}
```

### 2. **`providers/`** - React Context Providers
**Purpose**: Manages global application state and context providers.

**Files**:
- `AuthProvider.tsx` - Authentication state management
- `AppProviders.tsx` - Combines all providers

**Key Functions**:
```tsx
// AuthProvider provides:
const { user, login, logout, isAuthenticated } = useAuth()

// User object structure:
interface User {
  id: string
  email: string
  role: 'SuperAdmin' | 'Supply' | 'Supplier' | 'Inspection' | 'Enduser'
  permissions?: Permission[]
}
```

### 3. **`rbac/`** - Role-Based Access Control
**Purpose**: Complete permission and role management system.

**Files Breakdown**:

#### `roles.ts` - Role Definitions
```tsx
export type Role = "SuperAdmin" | "Enduser" | "Supply" | "Supplier" | "Inspection"

// Role hierarchy (SuperAdmin > Supply/Supplier/Inspection > Enduser)
export const roleHierarchy: Record<Role, Role[]> = {
  SuperAdmin: ["SuperAdmin", "Supply", "Supplier", "Inspection", "Enduser"],
  Supply: ["Supply", "Enduser"],
  Supplier: ["Supplier", "Enduser"],
  Inspection: ["Inspection", "Enduser"],
  Enduser: ["Enduser"]
}
```

#### `permissions.ts` - Permission System
```tsx
// All available permissions
export type Permission = 
  | "dashboard:read"
  | "ppmp:read" | "ppmp:write" | "ppmp:delete"
  | "users:read" | "users:write" | "users:delete"
  // ... more permissions

// Role to permission mapping
export const rolePermissions: Record<Role, Permission[]> = {
  SuperAdmin: ["dashboard:read", "ppmp:write", "users:write", ...],
  Supply: ["dashboard:read", "ppmp:read", "approval-sequence:read", ...],
  Enduser: ["dashboard:read", "ppmp:read"]
}
```

#### `ability.ts` - Permission Checking Logic
```tsx
export class Ability {
  constructor(private user: User | null) {}

  // Check if user has specific permission
  can(permission: Permission): boolean
  
  // Check if user has specific role
  hasRole(role: Role): boolean
  
  // Check multiple permissions
  canAccess(requiredPermissions: Permission[]): boolean
}

// Usage:
const ability = createAbility(user)
if (ability.can('ppmp:write')) {
  // Show edit button
}
```

#### `guard.tsx` - Route & Component Protection
```tsx
// Protect entire routes
<RequireAuth>
  <DashboardPage />
</RequireAuth>

// Require specific roles
<RequireRole roles={['SuperAdmin', 'Supply']}>
  <AdminPanel />
</RequireRole>

// Require specific permissions
<RequirePermission permissions={['users:write']}>
  <AddUserButton />
</RequirePermission>
```

### 4. **`routes/`** - Route Definitions
**Purpose**: Currently empty, could contain route configuration files.

### 5. **`router.tsx`** - Main Application Router
**Purpose**: Defines all application routes with RBAC protection.

---

## 🔗 How to Connect RBAC to Pages

### Method 1: Route-Level Protection
```tsx
// In router.tsx
{
  path: "/app/users",
  element: (
    <RequireAuth>
      <RequirePermission permissions={[PERMISSIONS.USERS.READ]}>
        <UserManagementPage />
      </RequirePermission>
    </RequireAuth>
  ),
}
```

### Method 2: Component-Level Protection
```tsx
// In any component
import { useAuth } from "@/hooks/useAuth"
import { createAbility } from "@/app/rbac/ability"
import { PERMISSIONS } from "@/app/rbac/permissions"

function UserManagementPage() {
  const { user } = useAuth()
  const ability = createAbility(user)
  
  return (
    <div>
      <h1>Users</h1>
      
      {/* Conditionally show based on permissions */}
      {ability.can(PERMISSIONS.USERS.WRITE) && (
        <Button>Add User</Button>
      )}
      
      {ability.can(PERMISSIONS.USERS.DELETE) && (
        <Button variant="destructive">Delete User</Button>
      )}
    </div>
  )
}
```

### Method 3: Sidebar Navigation Filtering
```tsx
// In AppSidebar component
const { user } = useAuth()
const ability = createAbility(user)

// Filter navigation items based on permissions
const filteredNavMain = navItems.filter(item => {
  if (item.permission) {
    return ability.can(item.permission)
  }
  return true
})
```

---

## 🚀 Quick Setup Guide

### Step 1: Wrap Your App with Providers
```tsx
// In main.tsx or App.tsx
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

### Step 2: Protect Routes
```tsx
// Add to your route definitions
<RequirePermission permissions={['dashboard:read']}>
  <YourPage />
</RequirePermission>
```

### Step 3: Use in Components
```tsx
const { user } = useAuth()
const ability = createAbility(user)

// Check permissions
if (ability.can('ppmp:write')) {
  // Show edit functionality
}

// Check roles
if (ability.hasRole('SuperAdmin')) {
  // Show admin features
}
```

---

## 🎯 Real-World Examples

### Example 1: Conditional Button Rendering
```tsx
function PpmpPage() {
  const { user } = useAuth()
  const ability = createAbility(user)
  
  return (
    <div>
      <h1>PPMP</h1>
      <ItemsList />
      
      {/* Only show add button if user can write */}
      {ability.can(PERMISSIONS.PPMP.WRITE) && (
        <Button>Add Item</Button>
      )}
      
      {/* Only show delete for admins */}
      {ability.hasRole('SuperAdmin') && (
        <Button variant="destructive">Delete All</Button>
      )}
    </div>
  )
}
```

### Example 2: Form Field Protection
```tsx
function UserForm() {
  const ability = createAbility(useAuth().user)
  
  return (
    <form>
      <Input placeholder="Name" />
      <Input placeholder="Email" />
      
      {/* Only admins can assign roles */}
      {ability.can(PERMISSIONS.USERS.WRITE) && (
        <Select placeholder="Role">
          <option value="Enduser">Enduser</option>
          <option value="Supply">Supply</option>
          {ability.hasRole('SuperAdmin') && (
            <option value="SuperAdmin">SuperAdmin</option>
          )}
        </Select>
      )}
    </form>
  )
}
```

### Example 3: Page-Level Access Control
```tsx
function SuperAdminDashboard() {
  return (
    <RequireRole roles={['SuperAdmin']}>
      <div>
        <h1>SuperAdmin Dashboard</h1>
        <SystemSettings />
        <UserManagement />
        <SecurityLogs />
      </div>
    </RequireRole>
  )
}
```

---

## 📋 Available Permissions Reference

```tsx
PERMISSIONS = {
  DASHBOARD: { READ: "dashboard:read" },
  PPMP: {
    READ: "ppmp:read",
    WRITE: "ppmp:write", 
    DELETE: "ppmp:delete"
  },
  USERS: {
    READ: "users:read",
    WRITE: "users:write",
    DELETE: "users:delete"
  },
  DEPARTMENTS: {
    READ: "departments:read",
    WRITE: "departments:write",
    DELETE: "departments:delete"
  },
  APPROVAL_SEQUENCE: {
    READ: "approval-sequence:read",
    WRITE: "approval-sequence:write",
    DELETE: "approval-sequence:delete"
  }
}
```

---

## 🔧 Extending the System

### Adding New Permissions
1. Add to `permissions.ts`:
```tsx
export type Permission = 
  | "existing:permissions"
  | "new-feature:read"    // Add new permission
  | "new-feature:write"
```

2. Update role mappings:
```tsx
export const rolePermissions: Record<Role, Permission[]> = {
  Admin: [...existingPermissions, "new-feature:write"],
  User: [...existingPermissions, "new-feature:read"]
}
```

### Adding New Roles
1. Update `roles.ts`:
```tsx
export type Role = "Admin" | "Manager" | "User" | "NewRole"
```

2. Update hierarchy and permissions accordingly.

---

## 🐛 Common Troubleshooting

### Issue: "User not authenticated"
**Solution**: Ensure AuthProvider wraps your app and user token is valid.

### Issue: "Permission denied"
**Solution**: Check if user role has required permissions in `rolePermissions`.

### Issue: "Route not protected"
**Solution**: Wrap route with `RequireAuth` or `RequirePermission` components.

---

## 🎉 Benefits of This System

1. **Type Safety**: Full TypeScript support prevents permission typos
2. **Flexibility**: Mix and match roles and permissions as needed
3. **Maintainable**: Centralized permission logic
4. **Scalable**: Easy to add new roles and permissions
5. **Secure**: Multiple layers of protection (route + component level)

---

*This documentation covers the complete RBAC system implementation in your PSMS application. Use it as a reference for implementing secure, role-based features throughout your app.*
