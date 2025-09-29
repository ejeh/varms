"use client";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const TOKEN_KEY = "varms_access_token";

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

function getAccessToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(TOKEN_KEY) || undefined;
}

export function getCurrentUserRole(): string | undefined {
  try {
    const token = getAccessToken();
    if (!token) return undefined;
    const parts = token.split(".");
    if (parts.length < 2) return undefined;
    const payload = JSON.parse(atob(parts[1]));
    return payload?.role;
  } catch {
    return undefined;
  }
}

export function getCurrentUserId(): string | undefined {
  try {
    const token = getAccessToken();
    if (!token) return undefined;
    const parts = token.split(".");
    if (parts.length < 2) return undefined;
    const payload = JSON.parse(atob(parts[1]));
    return payload?.sub;
  } catch {
    return undefined;
  }
}

async function request(path: string, init: RequestInit = {}) {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error((await res.text()) || "Request failed");
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const candidatesApi = {
  list: () => request("/candidates", { method: "GET" }),
  get: (id: string) => request(`/candidates/${id}`, { method: "GET" }),
  create: (body: { name: string; dept: string; documents?: string[] }) =>
    request("/candidates", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) =>
    request(`/candidates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

export const supervisorsApi = {
  list: () => request("/supervisors", { method: "GET" }),
};

// Repository API
export const repoApi = {
  list: (q?: string) =>
    request(`/repository${q ? `?q=${encodeURIComponent(q)}` : ""}`, {
      method: "GET",
    }),
  get: (id: string) => request(`/repository/${id}`, { method: "GET" }),
  downloadUrl: (id: string, version?: number) =>
    `${API_BASE}/repository/${id}/download${
      version ? `?version=${version}` : ""
    }`,
  upload: async (payload: {
    file: File;
    title: string;
    description?: string;
    tags?: string;
    candidateId?: string;
  }) => {
    const form = new FormData();
    form.append("file", payload.file);
    form.append("title", payload.title);
    if (payload.description) form.append("description", payload.description);
    if (payload.tags) form.append("tags", payload.tags);
    if (payload.candidateId) form.append("candidateId", payload.candidateId);
    const res = await fetch(`${API_BASE}/repository/upload`, {
      method: "POST",
      body: form as any,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  addVersion: async (id: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_BASE}/repository/${id}/upload`, {
      method: "POST",
      body: form as any,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

// Plagiarism API
export const plagApi = {
  submit: (repoFileId: string) =>
    request(`/plagiarism/submit/${repoFileId}`, { method: "POST" }),
  get: (reportId: string) =>
    request(`/plagiarism/report/${reportId}`, { method: "GET" }),
  latest: (repoFileId: string) =>
    request(`/plagiarism/latest/${repoFileId}`, { method: "GET" }),
};

// Auth helpers
export const authApi = {
  login: async (email: string, password: string) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data?.access_token) setAccessToken(data.access_token);
    return data;
  },
  register: (payload: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: async () => {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      clearAccessToken();
    }
  },
  forgotPassword: (email: string) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, newPassword: string) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
  activate: (token: string) =>
    request("/auth/activate", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  mfa: {
    requestOtp: (email: string) =>
      request("/auth/mfa/request-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    verifyOtp: (email: string, code: string) =>
      request("/auth/mfa/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      }),
    totpSetup: () => request("/auth/mfa/totp/setup", { method: "POST" }),
    totpVerify: (token: string) =>
      request("/auth/mfa/totp/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      }),
  },
};

// Defence API
export const defenceApi = {
  list: () => request("/defence", { method: "GET" }),
  get: (id: string) => request(`/defence/${id}`, { method: "GET" }),
  attendance: (
    id: string,
    body: { userId: string; role: string; joined?: boolean }
  ) =>
    request(`/defence/${id}/attendance`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  addQuestion: (id: string, body: { authorId: string; question: string }) =>
    request(`/defence/${id}/qa`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  answer: (id: string, index: number, answer: string) =>
    request(`/defence/${id}/qa/${index}`, {
      method: "PATCH",
      body: JSON.stringify({ answer }),
    }),
};

// Payments API
export const paymentsApi = {
  checkout: (body: {
    userId: string;
    amount: number;
    currency?: string;
    provider?: string;
  }) =>
    request("/payments/checkout", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  byReference: (reference: string) =>
    request(`/payments/reference/${reference}`, { method: "GET" }),
  byUser: (userId: string) =>
    request(`/payments/user/${userId}`, { method: "GET" }),
};

// Certificates API
export const certificatesApi = {
  issue: (body: { userId: string; name: string; pdfUrl?: string }) =>
    request("/certificates/issue", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verify: (hash: string) =>
    request(`/certificates/verify/${hash}`, { method: "GET" }),
  listByUser: (userId: string) =>
    request(`/certificates/user/${userId}`, { method: "GET" }),
};

// Analytics API
export const analyticsApi = {
  summary: () => request("/analytics/summary", { method: "GET" }),
  compliance: () => request("/analytics/compliance", { method: "GET" }),
};

// Notifications API
export const notificationsApi = {
  list: (userId: string) =>
    request(`/notifications/${userId}`, { method: "GET" }),
  markRead: (id: string) =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),
};

// Grading API
export const gradingApi = {
  rubrics: {
    list: () => request("/grading/rubrics", { method: "GET" }),
    create: (body: {
      title: string;
      criteria: { name: string; weight: number; maxScore: number }[];
    }) =>
      request("/grading/rubrics", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (
      id: string,
      body: Partial<{
        title: string;
        criteria: { name: string; weight: number; maxScore: number }[];
      }>
    ) =>
      request(`/grading/rubrics/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request(`/grading/rubrics/${id}`, { method: "DELETE" }),
  },
  feedback: {
    submit: (body: {
      candidateId: string;
      repoFileId?: string;
      examinerId: string;
      rubricId: string;
      scores: { criterionName: string; score: number; comment?: string }[];
      overallComment?: string;
    }) =>
      request("/grading/feedback", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    listByCandidate: (candidateId: string) =>
      request(`/grading/feedback/candidate/${candidateId}`, { method: "GET" }),
    get: (id: string) => request(`/grading/feedback/${id}`, { method: "GET" }),
    publish: (id: string, published: boolean) =>
      request(`/grading/feedback/${id}/publish`, {
        method: "PATCH",
        body: JSON.stringify({ published }),
      }),
  },
  aggregate: (candidateId: string) =>
    request(`/grading/aggregate/${candidateId}`, { method: "GET" }),
};
