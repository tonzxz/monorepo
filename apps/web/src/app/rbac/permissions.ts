import type { Role } from "./roles";

export type Permission =
  | "dashboard:read"
  | "inventory:read"
  | "inventory:write"
  | "inventory:delete"
  | "users:read"
  | "users:write"
  | "users:delete"
  | "departments:read"
  | "departments:write"
  | "departments:delete"
  | "approval-sequence:read"
  | "approval-sequence:write"
  | "approval-sequence:delete";

export const rolePermissions: Record<Role, Permission[]> = {
  SuperAdmin: [
    "dashboard:read",
    "inventory:read",
    "inventory:write",
    "inventory:delete",
    "users:read",
    "users:write",
    "users:delete",
    "departments:read",
    "departments:write",
    "departments:delete",
    "approval-sequence:read",
    "approval-sequence:write",
    "approval-sequence:delete"
  ],
  Supply: [
    "dashboard:read",
    "inventory:read",
    "inventory:write",
    "approval-sequence:read"
  ],
  Supplier: [
    "dashboard:read",
    "inventory:read",
    "approval-sequence:read"
  ],
  Inspection: [
    "dashboard:read",
    "inventory:read",
    "approval-sequence:read"
  ],
  Enduser: [
    "dashboard:read",
    "inventory:read"
  ]
};

export const PERMISSIONS = {
  DASHBOARD: {
    READ: "dashboard:read" as const
  },
  INVENTORY: {
    READ: "inventory:read" as const,
    WRITE: "inventory:write" as const,
    DELETE: "inventory:delete" as const
  },
  USERS: {
    READ: "users:read" as const,
    WRITE: "users:write" as const,
    DELETE: "users:delete" as const
  },
  DEPARTMENTS: {
    READ: "departments:read" as const,
    WRITE: "departments:write" as const,
    DELETE: "departments:delete" as const
  },
  APPROVAL_SEQUENCE: {
    READ: "approval-sequence:read" as const,
    WRITE: "approval-sequence:write" as const,
    DELETE: "approval-sequence:delete" as const
  }
} as const;
