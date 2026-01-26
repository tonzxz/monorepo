import { apiFetch } from "./client";

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  expiresAtUtc: string;
};

export function login(request: LoginRequest) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
    auth: false,
  });
}
