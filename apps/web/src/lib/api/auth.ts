import { apiFetch } from "./client";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  address?: string;
  role?: string;
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

export function register(request: RegisterRequest) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(request),
    auth: false,
  });
}

export function loginWithGoogle() {
  const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:5001";
  const returnUrl = encodeURIComponent(window.location.origin + "/auth/callback");
  window.location.href = `${apiUrl}/api/auth/external-login/google?returnUrl=${returnUrl}`;
}

export type UpdateProfileRequest = {
  address?: string;
  phoneNumber?: string;
  password?: string;
};

export function updateProfile(request: UpdateProfileRequest) {
  return apiFetch<void>("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify(request),
    auth: true,
  });
}
