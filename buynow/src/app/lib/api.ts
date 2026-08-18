export type AppContext = {
  workspaceId: string;
  userId: string;
  workspaceSlug?: string;
  userEmail?: string;
};

const STORAGE_KEY = "buynow.context";
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export function loadStoredContext(): AppContext | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AppContext;
  } catch {
    return null;
  }
}

export function saveStoredContext(context: AppContext) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
}

export async function bootstrapContext() {
  const response = await fetch(`${API_BASE}/auth/bootstrap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workspaceName: "Buy Now Workspace",
      workspaceSlug: "buy-now-workspace",
      name: "Jake Smith",
      ownerName: "Jake Smith",
      email: "jake@business.com",
      ownerEmail: "jake@business.com",
    }),
  });

  if (!response.ok) {
    throw new Error(`Bootstrap failed: ${response.status}`);
  }

  return response.json() as Promise<{
    workspace: unknown;
    user: unknown;
    context: AppContext;
  }>;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  context?: AppContext | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (context) {
    headers.set("x-workspace-id", context.workspaceId);
    headers.set("x-user-id", context.userId);
    if (context.workspaceSlug) {
      headers.set("x-workspace-slug", context.workspaceSlug);
    }
    if (context.userEmail) {
      headers.set("x-user-email", context.userEmail);
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
