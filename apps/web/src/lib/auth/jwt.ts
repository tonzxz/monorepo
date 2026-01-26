export type JwtPayload = Record<string, unknown>;

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return atob(padded);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = base64UrlDecode(payload);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractRoles(payload: JwtPayload | null): string[] {
  if (!payload) return [];

  const candidates = [
    payload.role,
    payload.roles,
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  ];

  const roles: string[] = [];
  for (const value of candidates) {
    if (!value) continue;
    if (Array.isArray(value)) {
      roles.push(...value.map(String));
    } else {
      roles.push(String(value));
    }
  }

  return Array.from(new Set(roles));
}
