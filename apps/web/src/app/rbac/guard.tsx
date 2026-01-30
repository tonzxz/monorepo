import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { createAbility } from "./ability";
import type { Role } from "./roles";
import type { Permission } from "./permissions";

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

interface RequireRoleProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireRole({ roles, children, fallback }: RequireRoleProps) {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const ability = createAbility(user);
  
  if (!ability.hasAnyRole(roles)) {
    return fallback || <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

interface RequirePermissionProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // true = require all permissions, false = require any permission
}

export function RequirePermission({ 
  permissions, 
  children, 
  fallback, 
  requireAll = true 
}: RequirePermissionProps) {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const ability = createAbility(user);
  
  const hasAccess = requireAll 
    ? ability.canAccess(permissions)
    : ability.canAccessAny(permissions);
    
  if (!hasAccess) {
    return fallback || <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

// Higher-order component for class components or more complex scenarios
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    return (
      <RequireAuth>
        <Component {...props} />
      </RequireAuth>
    );
  };
}

export function withRole<T extends object>(
  Component: React.ComponentType<T>,
  roles: Role[]
) {
  return function RoleProtectedComponent(props: T) {
    return (
      <RequireRole roles={roles}>
        <Component {...props} />
      </RequireRole>
    );
  };
}

export function withPermission<T extends object>(
  Component: React.ComponentType<T>,
  permissions: Permission[],
  requireAll = true
) {
  return function PermissionProtectedComponent(props: T) {
    return (
      <RequirePermission permissions={permissions} requireAll={requireAll}>
        <Component {...props} />
      </RequirePermission>
    );
  };
}
