import type { Role } from "./roles";

export type Permission =
  | "users:read"
  | "users:write"
  | "departments:read"
  | "departments:write"
  | "approvals:read"
  | "approvals:write";

export const rolePermissions: Record<Role, Permission[]> = {
  Admin: [
    "users:read",
    "users:write",
    "departments:read",
    "departments:write",
    "approvals:read",
    "approvals:write",
  ],
  User: ["users:read", "departments:read", "approvals:read"],
};
