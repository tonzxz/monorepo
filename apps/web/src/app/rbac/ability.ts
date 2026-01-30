import type { Role } from "./roles";
import type { Permission } from "./permissions";
import { roleHierarchy } from "./roles";
import { rolePermissions } from "./permissions";

export interface User {
  id: string;
  email: string;
  role: Role;
  permissions?: Permission[];
}

export class Ability {
  private user: User | null;
  
  constructor(user: User | null) {
    this.user = user;
  }

  can(permission: Permission): boolean {
    if (!this.user) return false;
    
    // Check explicit permissions first
    if (this.user.permissions?.includes(permission)) {
      return true;
    }
    
    // Check role-based permissions
    const userPermissions = rolePermissions[this.user.role] || [];
    return userPermissions.includes(permission);
  }

  hasRole(role: Role): boolean {
    if (!this.user) return false;
    
    // Check if user has the exact role or a higher role
    const userRoleHierarchy = roleHierarchy[this.user.role] || [];
    return userRoleHierarchy.includes(role);
  }

  hasAnyRole(roles: Role[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  canAccess(requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(permission => this.can(permission));
  }

  canAccessAny(permissions: Permission[]): boolean {
    return permissions.some(permission => this.can(permission));
  }

  get role(): Role | null {
    return this.user?.role || null;
  }

  get isAuthenticated(): boolean {
    return !!this.user;
  }
}

// Create ability instance
export function createAbility(user: User | null): Ability {
  return new Ability(user);
}

// Legacy helper functions for backward compatibility
export function hasRole(userRoles: string[], required: Role[]) {
  return required.some((role) => userRoles.includes(role));
}

export function hasPermission(userRoles: string[], permission: Permission) {
  return userRoles.some((role) =>
    rolePermissions[role as Role]?.includes(permission),
  );
}
