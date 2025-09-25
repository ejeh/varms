export type DecodedToken = {
  role?: string;
  [key: string]: unknown;
};

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function decodeJwt(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as DecodedToken;
  } catch {
    return null;
  }
}

export function getRoleFromToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("varms_access_token");
  if (token) {
    const decoded = decodeJwt(token);
    if (decoded?.role && typeof decoded.role === "string") {
      return decoded.role;
    }
  }
  const user = safeParse<{ role?: string }>(localStorage.getItem("user"));
  if (user?.role && typeof user.role === "string") return user.role;
  return null;
}
