import { rolePermissions } from "./permissions";
import type { Permission } from "./permissions";
import type { Role } from "./roles";

export function hasRole(userRoles: string[], required: Role[]) {
  return required.some((role) => userRoles.includes(role));
}

export function hasPermission(userRoles: string[], permission: Permission) {
  return userRoles.some((role) =>
    rolePermissions[role as Role]?.includes(permission),
  );
}
