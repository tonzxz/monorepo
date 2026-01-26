import { getToken } from "../auth/storage";

const API_URL = import.meta.env.VITE_API_URL ?? "";

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const { auth = true, headers, ...rest } = options;
  const url = `${API_URL}${path}`;

  const finalHeaders = new Headers({
    "Content-Type": "application/json",
    ...headers,
  });

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
