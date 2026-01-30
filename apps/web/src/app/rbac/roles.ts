export type Role = "Admin" | "User" | "Manager";

export const ROLES: Record<Role, string> = {
  Admin: "Admin",
  User: "User",
  Manager: "Manager"
};

export const roleHierarchy: Record<Role, Role[]> = {
  Admin: ["Admin", "Manager", "User"],
  Manager: ["Manager", "User"],  
  User: ["User"]
};
