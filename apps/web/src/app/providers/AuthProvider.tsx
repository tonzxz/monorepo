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

function createUserFromToken(token: string): User | null {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    
    return {
      id: payload.sub || payload.id || "",
      email: payload.email || payload.user_email || "",
      role: (payload.role || "User") as Role,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [roles, setRoles] = useState<string[]>(() => {
    const payload = token ? decodeJwtPayload(token) : null;
    return extractRoles(payload);
  });
  const [user, setUser] = useState<User | null>(() => {
    return token ? createUserFromToken(token) : null;
  });

  const login = (nextToken: string) => {
    setToken(nextToken);
    setTokenState(nextToken);
    setRoles(extractRoles(decodeJwtPayload(nextToken)));
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
