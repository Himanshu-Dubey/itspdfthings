/**
 * Typed API client for the Laravel backend.
 * All requests use credentials: 'include' for Sanctum SPA cookie auth.
 */

// Direct API URL for file uploads (bypasses Vercel's 4.5MB body size limit).
// NEXT_PUBLIC_API_URL should be set in Vercel to https://api.itspdfthings.com
const DIRECT_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
  }
}

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export async function fetchCsrfCookie(): Promise<void> {
  // Always fetch CSRF from the direct API (cookie must come from the API domain).
  await fetch(`${DIRECT_API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
  const isFormData = body instanceof FormData;

  if (isWrite) await fetchCsrfCookie();

  const headers: Record<string, string> = { Accept: "application/json" };

  if (body && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (isWrite) {
    const token = getCsrfToken();
    if (token) headers["X-XSRF-TOKEN"] = token;
  }

  // File uploads (FormData) go directly to the API to bypass Vercel's 4.5MB
  // serverless body size limit.  All other requests use the rewrite proxy.
  const baseUrl = isFormData ? DIRECT_API_URL : "";
  const res = await fetch(`${baseUrl}/api${path}`, {
    method,
    credentials: "include",
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data?.message ?? res.statusText, data);
  }

  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

import type { AuthUserResponse, LoginResponse, RegisterResponse } from "@/types/api";

export const auth = {
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    return request<RegisterResponse>("POST", "/auth/register", {
      name, email, password, password_confirmation: password,
    });
  },

  async login(email: string, password: string, remember = false): Promise<LoginResponse> {
    return request<LoginResponse>("POST", "/auth/login", { email, password, remember });
  },

  async logout(): Promise<void> {
    await request("POST", "/auth/logout");
  },

  async user(): Promise<AuthUserResponse> {
    return request<AuthUserResponse>("GET", "/auth/user");
  },

  async updateProfile(data: {
    name?: string;
    current_password?: string;
    password?: string;
    password_confirmation?: string;
  }): Promise<AuthUserResponse> {
    return request<AuthUserResponse>("PATCH", "/auth/profile", data);
  },
};

// ── Jobs ─────────────────────────────────────────────────────────────────────

import type { CreateJobResponse, JobHistoryResponse, JobStatusResponse } from "@/types/api";

export const jobs = {
  /**
   * Create a PDF job with upload progress tracking.
   * Uses XMLHttpRequest instead of fetch so we can report upload percentage.
   */
  createWithProgress(
    files: File | File[],
    toolType: string,
    options: Record<string, string> = {},
    onProgress?: (percent: number) => void,
  ): Promise<CreateJobResponse> {
    return new Promise<CreateJobResponse>((resolve, reject) => {
      const form = new FormData();
      form.append("tool_type", toolType);

      const fileArray = Array.isArray(files) ? files : [files];
      if (fileArray.length > 1) {
        fileArray.forEach((f) => form.append("files[]", f));
      } else {
        form.append("file", fileArray[0]);
      }
      if (Object.keys(options).length > 0) {
        form.append("options", JSON.stringify(options));
      }

      // Ensure CSRF cookie is set before the XHR request.
      fetchCsrfCookie().then(() => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${DIRECT_API_URL}/api/jobs`);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Accept", "application/json");

        const token = getCsrfToken();
        if (token) xhr.setRequestHeader("X-XSRF-TOKEN", token);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data as CreateJobResponse);
            } else {
              reject(new ApiError(xhr.status, data?.message ?? xhr.statusText, data));
            }
          } catch {
            reject(new ApiError(xhr.status, xhr.statusText));
          }
        };

        xhr.onerror = () => reject(new ApiError(0, "Network error"));
        xhr.send(form);
      }).catch(reject);
    });
  },

  /**
   * Create a PDF job (simple version, no progress).
   */
  async create(
    files: File | File[],
    toolType: string,
    options: Record<string, string> = {},
  ): Promise<CreateJobResponse> {
    const form = new FormData();
    form.append("tool_type", toolType);

    const fileArray = Array.isArray(files) ? files : [files];

    if (fileArray.length > 1) {
      fileArray.forEach((f) => form.append("files[]", f));
    } else {
      form.append("file", fileArray[0]);
    }

    if (Object.keys(options).length > 0) {
      form.append("options", JSON.stringify(options));
    }

    return request<CreateJobResponse>("POST", "/jobs", form);
  },

  async status(id: string): Promise<JobStatusResponse> {
    return request<JobStatusResponse>("GET", `/jobs/${id}`);
  },

  /** Paginated job history for the logged-in user. */
  async history(page = 1): Promise<JobHistoryResponse> {
    return request<JobHistoryResponse>("GET", `/jobs?page=${page}`);
  },
};

// ── Plans ─────────────────────────────────────────────────────────────────────

import type { PlansResponse } from "@/types/api";

export const plans = {
  async list(): Promise<PlansResponse> {
    return request<PlansResponse>("GET", "/plans");
  },
};

// ── Billing ──────────────────────────────────────────────────────────────────

import type { GeoResponse } from "@/types/api";

export const geo = {
  async detect(): Promise<GeoResponse> {
    return request<GeoResponse>("GET", "/geo");
  },
};

export const billing = {
  /** Start a Stripe Checkout session for a plan (or default Premium if no planId). */
  async checkout(planId?: number, country?: string): Promise<{ checkout_url: string }> {
    const body: Record<string, unknown> = {};
    if (planId) body.plan_id = planId;
    if (country) body.country = country;
    return request<{ checkout_url: string }>("POST", "/billing/checkout", Object.keys(body).length ? body : undefined);
  },

  /** Get a Stripe Billing Portal URL for managing/cancelling a subscription. */
  async portal(): Promise<{ portal_url: string }> {
    return request<{ portal_url: string }>("GET", "/billing/portal");
  },

  /**
   * Pull the user's current subscription status directly from Stripe and
   * update the local plan column.  Call this on the post-checkout success
   * redirect so the plan flips immediately even when webhooks are delayed
   * (e.g. local dev without Stripe CLI).
   */
  async sync(): Promise<AuthUserResponse> {
    return request<AuthUserResponse>("POST", "/billing/sync");
  },
};
