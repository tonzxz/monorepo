# Routes Folder

## 📁 Purpose
This folder is intended to contain route configuration files and route-related utilities. Currently empty but designed for future route organization and management.

## 🎯 Intended Usage
When the application grows, this folder would contain:

### 1. Route Definitions
```tsx
// routes/appRoutes.ts
export const appRoutes = [
  {
    path: '/app',
    element: <DashboardPage />,
    permissions: ['dashboard:read']
  },
  {
    path: '/app/inventory',
    element: <InventoryPage />,
    permissions: ['inventory:read']
  }
  // ... more routes
]
```

### 2. Route Groups
```tsx
// routes/adminRoutes.ts
export const adminRoutes = [
  {
    path: '/admin/users',
    element: <UserManagement />,
    permissions: ['users:write']
  },
  {
    path: '/admin/settings',
    element: <SystemSettings />,
    permissions: ['system:admin']
  }
]
```

### 3. Route Configuration
```tsx
// routes/routeConfig.ts
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  permissions?: Permission[];
  roles?: Role[];
  layout?: React.ComponentType;
  meta?: {
    title: string;
    description?: string;
    breadcrumb?: string;
  };
}
```

### 4. Route Utilities
```tsx
// routes/routeUtils.ts
export function createProtectedRoute(config: RouteConfig) {
  const { element: Component, permissions, roles } = config;
  
  let protectedElement = <Component />;
  
  if (permissions) {
    protectedElement = (
      <RequirePermission permissions={permissions}>
        {protectedElement}
      </RequirePermission>
    );
  }
  
  if (roles) {
    protectedElement = (
      <RequireRole roles={roles}>
        {protectedElement}
      </RequireRole>
    );
  }
  
  return protectedElement;
}
```

### 5. Dynamic Route Generation
```tsx
// routes/generateRoutes.ts
export function generateRoutes(routeConfigs: RouteConfig[]) {
  return routeConfigs.map(config => ({
    path: config.path,
    element: createProtectedRoute(config),
    loader: config.loader,
    errorElement: config.errorElement
  }));
}
```

## 🚀 Future Implementation Ideas

### Route-Based Code Splitting
```tsx
// routes/lazyRoutes.ts
const InventoryPage = lazy(() => import('@/features/inventory/pages/InventoryPage'));
const UserManagementPage = lazy(() => import('@/features/user-management/pages/UserManagementPage'));

export const lazyRoutes = [
  {
    path: '/app/inventory',
    element: <Suspense fallback={<Loading />}><InventoryPage /></Suspense>,
    permissions: ['inventory:read']
  }
];
```

### Route Middleware
```tsx
// routes/middleware.ts
export function withAnalytics(component: React.ComponentType) {
  return function AnalyticsWrapper(props: any) {
    useEffect(() => {
      analytics.track('page_view', { path: location.pathname });
    }, []);
    
    return <Component {...props} />;
  };
}
```

### Breadcrumb Generation
```tsx
// routes/breadcrumbs.ts
export function generateBreadcrumbs(pathname: string, routes: RouteConfig[]) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  
  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const route = routes.find(r => r.path === currentPath);
    if (route?.meta?.breadcrumb) {
      breadcrumbs.push({
        title: route.meta.breadcrumb,
        path: currentPath
      });
    }
  }
  
  return breadcrumbs;
}
```

## 📁 Suggested File Structure
When implementing, consider this structure:
```
routes/
├── index.ts              # Main route exports
├── appRoutes.ts          # Application routes
├── authRoutes.ts         # Authentication routes  
├── adminRoutes.ts        # Admin-only routes
├── publicRoutes.ts       # Public routes
├── routeConfig.ts        # Route configuration types
├── routeUtils.ts         # Route utilities
├── middleware.ts         # Route middleware
└── guards.ts             # Route-specific guards
```

## 🔧 Integration with Current Setup

Currently, routes are defined directly in `../router.tsx`. When this folder is implemented, the router would become:

```tsx
// router.tsx (future implementation)
import { createBrowserRouter } from 'react-router-dom';
import { appRoutes } from './routes/appRoutes';
import { authRoutes } from './routes/authRoutes';
import { generateRoutes } from './routes/generateRoutes';

export const router = createBrowserRouter([
  ...generateRoutes(authRoutes),
  ...generateRoutes(appRoutes),
  // ... other route groups
]);
```

## 💡 Benefits of Route Organization

1. **Scalability**: Easy to manage large numbers of routes
2. **Maintainability**: Routes grouped by feature/purpose
3. **Reusability**: Common route patterns can be abstracted
4. **Type Safety**: Centralized route configuration with TypeScript
5. **Testing**: Easier to test route configurations in isolation
6. **Code Splitting**: Natural place to implement lazy loading
7. **Metadata**: Centralized place for route metadata (titles, breadcrumbs)

## 🚀 Getting Started

To implement route organization:

1. **Create route configuration types**:
```tsx
// routes/types.ts
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  permissions?: Permission[];
  roles?: Role[];
  meta?: RouteMetadata;
}
```

2. **Move existing routes to configuration files**:
```tsx
// routes/appRoutes.ts
import { PERMISSIONS } from '../rbac/permissions';

export const appRoutes: RouteConfig[] = [
  {
    path: '/app',
    element: DashboardPage,
    permissions: [PERMISSIONS.DASHBOARD.READ],
    meta: { title: 'Dashboard', breadcrumb: 'Dashboard' }
  },
  // ... more routes
];
```

3. **Update router to use route configurations**:
```tsx
// router.tsx
import { generateRoutes } from './routes/routeUtils';
import { appRoutes } from './routes/appRoutes';

export const router = createBrowserRouter(
  generateRoutes(appRoutes)
);
```

## 🔗 Related Files
- `../router.tsx` - Current router implementation
- `../rbac/` - Permission system used in route protection
- `../providers/AuthProvider.tsx` - Authentication state for route guards
- `../../features/` - Page components referenced in routes

---

*This folder is currently empty but ready for future route organization as the application scales.*