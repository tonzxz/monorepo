# RBAC (Role-Based Access Control) Folder

## 📁 Purpose
Complete role-based access control system that manages user permissions, roles, and access control throughout the application.

## 📋 Files
- `roles.ts` - Role definitions and hierarchy
- `permissions.ts` - Permission types and role mappings
- `ability.ts` - Permission checking logic and User interface
- `guard.tsx` - Route and component protection components

## 👑 roles.ts
Defines user roles and their hierarchy relationships.

### Role Types
```tsx
export type Role = "Admin" | "Manager" | "User"
```

### Role Hierarchy
```tsx
export const roleHierarchy: Record<Role, Role[]> = {
  Admin: ["Admin", "Manager", "User"],    // Admin has all permissions
  Manager: ["Manager", "User"],           // Manager has Manager + User permissions  
  User: ["User"]                          // User has only User permissions
}
```

### Usage
```tsx
import { Role, roleHierarchy } from "./roles"

// Check if user role includes target role
const userRoles = roleHierarchy[user.role] // ['Manager', 'User'] for Manager
const canAccessUserFeatures = userRoles.includes('User') // true
```

## 🔑 permissions.ts
Defines granular permissions and maps them to roles.

### Permission Types
```tsx
export type Permission = 
  | "dashboard:read"
  | "inventory:read" | "inventory:write" | "inventory:delete"
  | "users:read" | "users:write" | "users:delete"
  | "departments:read" | "departments:write" | "departments:delete"
  | "approval-sequence:read" | "approval-sequence:write" | "approval-sequence:delete"
```

### Role Permission Mapping
```tsx
export const rolePermissions: Record<Role, Permission[]> = {
  Admin: [
    "dashboard:read", "inventory:write", "users:write", 
    "departments:write", "approval-sequence:write", ...
  ],
  Manager: [
    "dashboard:read", "inventory:read", "users:read",
    "departments:write", "approval-sequence:write", ...
  ],
  User: [
    "dashboard:read", "inventory:read"
  ]
}
```

### Permission Constants
```tsx
export const PERMISSIONS = {
  DASHBOARD: { READ: "dashboard:read" as const },
  INVENTORY: {
    READ: "inventory:read" as const,
    WRITE: "inventory:write" as const,
    DELETE: "inventory:delete" as const
  },
  // ... more organized permissions
} as const
```

### Usage
```tsx
import { PERMISSIONS } from "./permissions"

// Use in route protection
<RequirePermission permissions={[PERMISSIONS.INVENTORY.WRITE]}>
  <AddInventoryForm />
</RequirePermission>
```

## 🧠 ability.ts
Core permission checking logic and user interface.

### User Interface
```tsx
export interface User {
  id: string;
  email: string;
  role: Role;
  permissions?: Permission[]; // Optional explicit permissions
}
```

### Ability Class
```tsx
export class Ability {
  constructor(private user: User | null) {}

  // Check single permission
  can(permission: Permission): boolean

  // Check role (including hierarchy)
  hasRole(role: Role): boolean

  // Check any of multiple roles
  hasAnyRole(roles: Role[]): boolean

  // Check all required permissions
  canAccess(requiredPermissions: Permission[]): boolean

  // Check any of multiple permissions
  canAccessAny(permissions: Permission[]): boolean
}
```

### Usage Examples
```tsx
import { createAbility } from "./ability"

const ability = createAbility(user)

// Check permissions
if (ability.can('inventory:write')) {
  // Show edit button
}

// Check roles
if (ability.hasRole('Admin')) {
  // Show admin features
}

// Check multiple permissions
if (ability.canAccess(['users:read', 'users:write'])) {
  // Show user management
}
```

## 🛡️ guard.tsx
React components for protecting routes and UI elements.

### Route Guards

#### RequireAuth
Protects routes that require any authenticated user.
```tsx
<RequireAuth>
  <ProtectedPage />
</RequireAuth>
```

#### RequireRole
Protects routes that require specific roles.
```tsx
<RequireRole roles={['Admin', 'Manager']}>
  <AdminDashboard />
</RequireRole>
```

#### RequirePermission
Protects routes that require specific permissions.
```tsx
<RequirePermission 
  permissions={['inventory:write']} 
  requireAll={true} // default: true
>
  <InventoryEditor />
</RequirePermission>
```

### Higher-Order Components
```tsx
// Wrap components with authentication
const ProtectedComponent = withAuth(MyComponent)

// Wrap components with role requirement
const AdminComponent = withRole(MyComponent, ['Admin'])

// Wrap components with permission requirement
const EditorComponent = withPermission(MyComponent, ['inventory:write'])
```

## 🎯 Real-World Usage Examples

### 1. Conditional UI Elements
```tsx
function InventoryPage() {
  const { user } = useAuth()
  const ability = createAbility(user)
  
  return (
    <div>
      <h1>Inventory</h1>
      
      {/* Show add button only if user can write */}
      {ability.can(PERMISSIONS.INVENTORY.WRITE) && (
        <Button>Add Item</Button>
      )}
      
      {/* Show delete only for admins */}
      {ability.hasRole('Admin') && (
        <Button variant="destructive">Delete All</Button>
      )}
    </div>
  )
}
```

### 2. Route Protection
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

### 3. Navigation Filtering
```tsx
// In sidebar component
const { user } = useAuth()
const ability = createAbility(user)

const filteredNavItems = navItems.filter(item => {
  if (item.permission) {
    return ability.can(item.permission)
  }
  return true
})
```

### 4. Form Field Control
```tsx
function UserForm() {
  const ability = createAbility(useAuth().user)
  
  return (
    <form>
      <Input name="email" />
      <Input name="name" />
      
      {/* Role selection only for users with write permission */}
      {ability.can(PERMISSIONS.USERS.WRITE) && (
        <Select name="role">
          <option value="User">User</option>
          {ability.hasRole('Admin') && (
            <option value="Admin">Admin</option>
          )}
        </Select>
      )}
    </form>
  )
}
```

## 🔧 Adding New Permissions

### Step 1: Add Permission Type
```tsx
// In permissions.ts
export type Permission = 
  | "existing:permissions"
  | "new-feature:read"     // Add new permission
  | "new-feature:write"
  | "new-feature:delete"
```

### Step 2: Add to Role Mappings
```tsx
export const rolePermissions: Record<Role, Permission[]> = {
  Admin: [...existing, "new-feature:write", "new-feature:delete"],
  Manager: [...existing, "new-feature:read", "new-feature:write"],
  User: [...existing, "new-feature:read"]
}
```

### Step 3: Add to Constants
```tsx
export const PERMISSIONS = {
  // ... existing
  NEW_FEATURE: {
    READ: "new-feature:read" as const,
    WRITE: "new-feature:write" as const,
    DELETE: "new-feature:delete" as const
  }
} as const
```

### Step 4: Use in Components
```tsx
{ability.can(PERMISSIONS.NEW_FEATURE.WRITE) && (
  <NewFeatureEditor />
)}
```

## 🚀 Best Practices

1. **Granular Permissions**: Use specific permissions rather than broad role checks
2. **Consistent Naming**: Follow `resource:action` pattern (e.g., `users:read`)
3. **Fail Secure**: Default to denying access when in doubt
4. **Multiple Layers**: Use both route-level and component-level protection
5. **Type Safety**: Always use TypeScript for permission strings

## 🐛 Common Issues

### Permission Not Working
- Check if user role includes the permission in `rolePermissions`
- Verify permission string matches exactly (typos)
- Ensure user object has correct role

### Route Still Accessible
- Make sure route is wrapped with appropriate guard component
- Check if guard is inside `RequireAuth` wrapper
- Verify permission requirements are correct

### UI Still Visible
- Check conditional rendering logic
- Ensure ability instance is created with current user
- Verify permission check is using correct permission string

## 🔗 Integration Points

- **AuthProvider**: Provides user object with role information
- **Router**: Uses guards to protect routes
- **Hooks**: `useAuth()` provides user for ability creation
- **Components**: Use ability checks for conditional rendering

## 📈 Performance Notes

- `createAbility()` is lightweight - safe to call in render
- Permission checks are O(1) operations using Set lookups
- Consider memoizing ability instance for expensive components
- Guards only re-render when user/role changes