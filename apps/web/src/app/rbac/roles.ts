export type Role = "SuperAdmin" | "Enduser" | "Supply" | "Supplier" | "Inspection";

export const ROLES: Record<Role, string> = {
  SuperAdmin: "SuperAdmin",
  Enduser: "Enduser",
  Supply: "Supply",
  Supplier: "Supplier",
  Inspection: "Inspection"
};

export const roleHierarchy: Record<Role, Role[]> = {
  SuperAdmin: ["SuperAdmin", "Supply", "Supplier", "Inspection", "Enduser"],
  Supply: ["Supply", "Enduser"],
  Supplier: ["Supplier", "Enduser"],
  Inspection: ["Inspection", "Enduser"],
  Enduser: ["Enduser"]
};
