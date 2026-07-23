import type {
  AbuseLogsResponse,
  AdminUser,
  AuditLogResponse,
  BlocklistResponse,
  DashboardMetrics,
  FailedQueueJob,
  IpBlocklistEntry,
  JobsResponse,
  JobStatsResponse,
  LeadEntry,
  ManagedUser,
  PageEntry,
  Plan,
  PlanPayload,
  PlansResponse,
  QueueStatus,
  SettingsResponse,
  StripeConfigResponse,
  SeoResponse,
  SubscriptionMetrics,
  SubscriptionsResponse,
  SystemHealth,
  UserDetailResponse,
  UsersResponse,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.itspdfthings.com";

async function fetchCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
}

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  signal?: AbortSignal,
): Promise<T> {
  const method     = (options.method ?? "GET").toUpperCase();
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (isMutation) await fetchCsrfCookie();

  const res = await fetch(`${API_URL}/api/admin${path}`, {
    ...options,
    credentials: "include",
    signal: signal ?? options.signal,
    headers: {
      ...(isMutation ? { "Content-Type": "application/json" } : {}),
      Accept: "application/json",
      ...(isMutation ? { "X-XSRF-TOKEN": getCsrfToken() } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Request failed" }));
    throw Object.assign(new Error(body.message ?? "Request failed"), { status: res.status, body });
  }

  return res.json() as Promise<T>;
}

export const adminApi = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: (email: string, password: string) =>
    request<{ admin: AdminUser }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),

  // Current authenticated admin — accepts AbortSignal for cleanup on unmount.
  getMe: (signal?: AbortSignal) =>
    request<{ admin: AdminUser }>("/auth/user", {}, signal),

  // ── Dashboard ─────────────────────────────────────────────────────────────
  getMetrics:      () => request<{ metrics: DashboardMetrics }>("/dashboard/metrics"),
  getQueueStatus:  () => request<{ queue: QueueStatus }>("/dashboard/queue-status"),
  getSystemHealth: () => request<{ health: SystemHealth }>("/dashboard/system-health"),

  // ── Users ─────────────────────────────────────────────────────────────────
  getUsers: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    return request<UsersResponse>(`/users${qs ? "?" + qs : ""}`);
  },

  getUserDetail: (id: number) => request<UserDetailResponse>(`/users/${id}`),

  updateUser: (
    id: number,
    data: {
      plan?: string;
      is_banned?: boolean;
      banned_reason?: string | null;
      name?: string;
    },
  ) => request<{ user: ManagedUser }>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteUser: (id: number) =>
    request<{ message: string }>(`/users/${id}`, { method: "DELETE" }),

  // ── Settings ──────────────────────────────────────────────────────────────
  getSettings: () => request<SettingsResponse>("/settings"),

  updateSettings: (settings: Record<string, string | null>) =>
    request<SettingsResponse>("/settings", {
      method: "PATCH",
      body: JSON.stringify({ settings }),
    }),

  // ── Jobs admin ────────────────────────────────────────────────────────────
  getJobs: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    return request<JobsResponse>(`/jobs${qs ? "?" + qs : ""}`);
  },

  getJobStats:    ()        => request<JobStatsResponse>("/jobs/stats"),
  triggerCleanup: ()        => request<{ deleted: number }>("/jobs/cleanup", { method: "POST" }),
  getFailedQueue: ()        => request<{ failed_jobs: FailedQueueJob[] }>("/jobs/failed-queue"),

  retryFailedJob:  (id: number) =>
    request<{ message: string }>(`/jobs/failed-queue/${id}/retry`, { method: "POST" }),

  deleteFailedJob: (id: number) =>
    request<{ message: string }>(`/jobs/failed-queue/${id}`, { method: "DELETE" }),

  // ── Abuse & moderation ────────────────────────────────────────────────────
  getAbuseLogs: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    return request<AbuseLogsResponse>(`/abuse/logs${qs ? "?" + qs : ""}`);
  },

  getBlocklist: () => request<BlocklistResponse>("/abuse/blocklist"),

  blockIp: (data: { ip_address: string; reason: string; expires_at?: string | null }) =>
    request<{ entry: IpBlocklistEntry }>("/abuse/blocklist", { method: "POST", body: JSON.stringify(data) }),

  unblockIp: (id: number) =>
    request<{ message: string }>(`/abuse/blocklist/${id}`, { method: "DELETE" }),

  // ── Audit log ─────────────────────────────────────────────────────────────
  getAuditLog: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    return request<AuditLogResponse>(`/audit-log${qs ? "?" + qs : ""}`);
  },

  // ── Subscriptions ─────────────────────────────────────────────────────────
  getSubscriptions: (page = 1) =>
    request<SubscriptionsResponse>(`/subscriptions?page=${page}`),

  getSubscriptionMetrics: () =>
    request<SubscriptionMetrics>("/subscriptions/metrics"),

  // ── Plans management ──────────────────────────────────────────────────────────
  getPlans: () =>
    request<PlansResponse>("/plans"),

  createPlan: (data: PlanPayload) =>
    request<{ plan: Plan }>("/plans", { method: "POST", body: JSON.stringify(data) }),

  updatePlan: (id: number, data: Partial<PlanPayload>) =>
    request<{ plan: Plan }>(`/plans/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deletePlan: (id: number) =>
    request<{ message: string }>(`/plans/${id}`, { method: "DELETE" }),

  // ── Stripe configuration ───────────────────────────────────────────────────
  getStripeConfig: () =>
    request<StripeConfigResponse>("/stripe/config"),

  updateStripeConfig: (data: Record<string, string>) =>
    request<StripeConfigResponse>("/stripe/config", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  testStripeConnection: () =>
    request<{ ok: boolean; message: string }>("/stripe/test", { method: "POST" }),

  // ── Razorpay configuration ────────────────────────────────────────────────
  getRazorpayConfig: () =>
    request<StripeConfigResponse>("/razorpay/config"),

  updateRazorpayConfig: (data: Record<string, string>) =>
    request<StripeConfigResponse>("/razorpay/config", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  testRazorpayConnection: () =>
    request<{ ok: boolean; message: string }>("/razorpay/test", { method: "POST" }),

  // ── Pages (static content) ───────────────────────────────────────────────
  getPages: () =>
    request<{ pages: PageEntry[] }>("/pages"),

  getPage: (id: number) =>
    request<{ page: PageEntry }>(`/pages/${id}`),

  createPage: (data: Partial<PageEntry>) =>
    request<{ page: PageEntry }>("/pages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updatePage: (id: number, data: Partial<PageEntry>) =>
    request<{ page: PageEntry }>(`/pages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deletePage: (id: number) =>
    request<{ message: string }>(`/pages/${id}`, { method: "DELETE" }),

  // ── Leads ───────────────────────────────────────────────────────────────
  getLeads: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    return request<{ leads: LeadEntry[]; total: number; currentPage: number; lastPage: number }>(
      `/leads${qs ? "?" + qs : ""}`,
    );
  },

  getLeadStats: () =>
    request<{ total: number; new: number; read: number; replied: number }>("/leads/stats"),

  getLead: (id: number) =>
    request<{ lead: LeadEntry }>(`/leads/${id}`),

  updateLead: (id: number, data: { status: string }) =>
    request<{ lead: LeadEntry }>(`/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteLead: (id: number) =>
    request<{ message: string }>(`/leads/${id}`, { method: "DELETE" }),

  // ── SEO ──────────────────────────────────────────────────────────────────
  getSeo: () => request<SeoResponse>("/seo"),

  updateSeo: (settings: Record<string, string>) =>
    request<{ message: string }>("/seo", {
      method: "PATCH",
      body: JSON.stringify({ settings }),
    }),

  uploadOgImage: async (file: File) => {
    await fetchCsrfCookie();
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/admin/seo/upload-og`, {
      method: "POST",
      credentials: "include",
      headers: { "X-XSRF-TOKEN": getCsrfToken() },
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json() as Promise<{ url: string }>;
  },
};
