/**
 * API types kept in sync with openapi.yaml at the monorepo root.
 * When the OpenAPI spec changes, update this file to match.
 */

// ── Shared ────────────────────────────────────────────────────────────────────

export type UserPlan = "free" | "premium";

export interface User {
  id: number;
  name: string;
  email: string;
  plan: UserPlan;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface Job {
  id: string; // UUID
  status: JobStatus;
  tool_type: string;
  created_at: string;
  download_url: string | null;
  error_message: string | null;
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

export interface AuthUserResponse {
  user: User;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterResponse {
  user: User;
}

// ── Job endpoints ─────────────────────────────────────────────────────────────

export interface CreateJobResponse {
  job: Pick<Job, "id" | "status" | "tool_type" | "created_at">;
}

export interface JobStatusResponse {
  job: Job;
}

export interface JobHistoryEntry {
  id: string;
  tool_type: string;
  status: JobStatus;
  processing_time_ms: number | null;
  created_at: string;
}

export interface JobHistoryResponse {
  data: JobHistoryEntry[];
  current_page: number;
  last_page: number;
  total: number;
}

// ── Plans ─────────────────────────────────────────────────────────────────────

export type PlanInterval = "month" | "year";

export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  interval: PlanInterval;
  stripe_price_id: string | null;
  features: string[] | null;
  is_active: boolean;
  sort_order: number;
}

export interface PlansResponse {
  plans: Plan[];
}

// ── Error shape ───────────────────────────────────────────────────────────────

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// ── Geo ───────────────────────────────────────────────────────────────────────

export interface GeoResponse {
  country: string;
  is_india: boolean;
  billing_provider: "razorpay" | "stripe";
}
