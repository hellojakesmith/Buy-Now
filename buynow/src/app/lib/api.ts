export type AppContext = {
  workspaceId: string;
  userId: string;
  workspaceSlug?: string;
  userEmail?: string;
};

const STORAGE_KEY = "buynow.context";
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (API_BASE.startsWith("http://") || API_BASE.startsWith("https://")) {
    return new URL(normalizedPath, API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`).toString();
  }
  return `${window.location.origin}${API_BASE}${normalizedPath}`;
}

export function loadStoredContext(): AppContext | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppContext;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveStoredContext(context: AppContext) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
}

export function clearStoredContext() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export type AuthUser = { _id: string; name: string; email: string; role?: string };
export type AuthWorkspace = { _id: string; name: string; slug: string };
export type AuthResponse = { workspace: AuthWorkspace; user: AuthUser };

export function contextFromAuth(response: AuthResponse): AppContext {
  return {
    workspaceId: response.workspace._id,
    userId: response.user._id,
    workspaceSlug: response.workspace.slug,
    userEmail: response.user.email,
  };
}

export function errorMessageFromBody(body: string, fallback: string) {
  try {
    const parsed = JSON.parse(body) as { message?: string };
    if (parsed?.message) return parsed.message;
  } catch {
    /* use raw body */
  }
  return body || fallback;
}

export async function authRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_BASE}${path}`, { ...options, credentials: "include", headers });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(errorMessageFromBody(message, `Request failed: ${response.status}`));
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function getCurrentAuth(): Promise<AuthResponse | null> {
  const response = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
  if (response.status === 401) return null;
  if (!response.ok) {
    const message = await response.text();
    throw new Error(errorMessageFromBody(message, `Authentication check failed: ${response.status}`));
  }
  return response.json() as Promise<AuthResponse>;
}

export async function logout() {
  await authRequest<void>("/auth/logout", { method: "POST" });
  clearStoredContext();
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, _context?: AppContext | null): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_BASE}${path}`, { ...options, credentials: "include", headers });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(errorMessageFromBody(message, `Request failed: ${response.status}`));
  }
  if (response.status === 204) return undefined as T;

  const result = await response.json() as T;
  if (options.method?.toUpperCase() === "POST" && path === "/pages") {
    const page = (result as { page?: { _id?: string; type?: string } }).page;
    if (page?.type === "landing" && page._id) {
      window.dispatchEvent(new CustomEvent("buynow:landing-page-created", { detail: { page } }));
    }
  }
  return result;
}
