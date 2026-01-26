import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { Role } from "./roles";
import type { Permission } from "./permissions";
import { hasPermission, hasRole } from "./ability";
import { useAuth } from "../../hooks/useAuth";

type GuardProps = {
  children: ReactNode;
};

type RoleGuardProps = GuardProps & {
  roles: Role[];
};

type PermissionGuardProps = GuardProps & {
  permission: Permission;
};

export function RequireAuth({ children }: GuardProps) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export function RequireRole({ roles, children }: RoleGuardProps) {
  const { roles: userRoles, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!hasRole(userRoles, roles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}

export function RequirePermission({ permission, children }: PermissionGuardProps) {
  const { roles: userRoles, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!hasPermission(userRoles, permission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}
