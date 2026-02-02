import type { Role } from "./roles";

export type Permission =
  | "dashboard:read"
  | "ppmp:read"
  | "ppmp:write"
  | "ppmp:delete"
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
    "ppmp:read",
    "ppmp:write",
    "ppmp:delete",
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
    "ppmp:read",
    "ppmp:write",
    "approval-sequence:read"
  ],
  Supplier: [
    "dashboard:read",
    "ppmp:read",
    "approval-sequence:read"
  ],
  Inspection: [
    "dashboard:read",
    "ppmp:read",
    "approval-sequence:read"
  ],
  Enduser: [
    "dashboard:read",
    "ppmp:read"
  ]
};

export const PERMISSIONS = {
  DASHBOARD: {
    READ: "dashboard:read" as const
  },
  PPMP: {
    READ: "ppmp:read" as const,
    WRITE: "ppmp:write" as const,
    DELETE: "ppmp:delete" as const
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
