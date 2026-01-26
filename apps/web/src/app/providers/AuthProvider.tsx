import { createContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { clearToken, getToken, setToken } from "../../lib/auth/storage";
import { decodeJwtPayload, extractRoles } from "../../lib/auth/jwt";

type AuthContextValue = {
  token: string | null;
  roles: string[];
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [roles, setRoles] = useState<string[]>(() => {
    const payload = token ? decodeJwtPayload(token) : null;
    return extractRoles(payload);
  });

  const login = (nextToken: string) => {
    setToken(nextToken);
    setTokenState(nextToken);
    setRoles(extractRoles(decodeJwtPayload(nextToken)));
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setRoles([]);
  };

  const value = useMemo(
    () => ({
      token,
      roles,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, roles],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
