import { createContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { clearToken, getToken, setToken } from "../../lib/auth/storage";
import { decodeJwtPayload, extractRoles } from "../../lib/auth/jwt";
import type { User } from "../rbac/ability";
import type { Role } from "../rbac/roles";

type AuthContextValue = {
  token: string | null;
  roles: string[];
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function readString(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readStringFromKeys(
  payload: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = readString(payload, key);
    if (value) return value;
  }
  return null;
}

function normalizeRole(value: string): Role | null {
  const key = value.trim().toLowerCase().replace(/[^a-z]/g, "");
  switch (key) {
    case "admin":
      return "SuperAdmin";
    case "superadmin":
      return "SuperAdmin";
    case "user":
      return "Enduser";
    case "enduser":
      return "Enduser";
    case "supply":
      return "Supply";
    case "supplier":
      return "Supplier";
    case "inspection":
      return "Inspection";
    default:
      return null;
  }
}

function normalizeRoles(values: string[]): Role[] {
  const normalized = values
    .map((value) => normalizeRole(value))
    .filter((value): value is Role => Boolean(value));
  return Array.from(new Set(normalized));
}

function createUserFromToken(token: string): User | null {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    const roles = normalizeRoles(extractRoles(payload));
    const primaryRole =
      roles.find((role) => role === "SuperAdmin") ??
      roles.find((role) => role === "Supply") ??
      roles.find((role) => role === "Supplier") ??
      roles.find((role) => role === "Inspection") ??
      roles.find((role) => role === "Enduser") ??
      "Enduser";
    const payloadRole =
      typeof payload.role === "string" ? normalizeRole(payload.role) : null;
    
    return {
      id: readString(payload, "sub") ?? readString(payload, "id") ?? "",
      email: readString(payload, "email") ?? readString(payload, "user_email") ?? "",
      role: roles.length ? primaryRole : payloadRole ?? "Enduser",
      firstName:
        readStringFromKeys(payload, ["firstName", "first_name", "given_name", "givenName"]) ??
        undefined,
      lastName:
        readStringFromKeys(payload, ["lastName", "last_name", "family_name", "familyName"]) ??
        undefined,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [roles, setRoles] = useState<string[]>(() => {
    const payload = token ? decodeJwtPayload(token) : null;
    return normalizeRoles(extractRoles(payload));
  });
  const [user, setUser] = useState<User | null>(() => {
    return token ? createUserFromToken(token) : null;
  });

  const login = (nextToken: string) => {
    setToken(nextToken);
    setTokenState(nextToken);
    setRoles(normalizeRoles(extractRoles(decodeJwtPayload(nextToken))));
    setUser(createUserFromToken(nextToken));
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setRoles([]);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      roles,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, roles, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
