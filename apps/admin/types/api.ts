export type AdminRole = "superadmin" | "support";
export type UserPlan  = "free" | "premium";
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  last_login_at: string | null;
  created_at: string;
}

// ── Users ──────────────────────────────────────────────────────────────────────

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  plan: UserPlan;
  is_banned: boolean;
  banned_reason: string | null;
  country: string | null;
  last_active_at: string | null;
  email_verified_at: string | null;
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface UsersResponse {
  users: ManagedUser[];
  meta: PaginationMeta;
}

export interface UserDetailResponse {
  user: ManagedUser;
  recent_jobs: PdfJobRow[];
  job_counts: Record<string, number>;
}

// ── PDF Jobs ──────────────────────────────────────────────────────────────────

export interface PdfJobRow {
  id: string;
  tool_type: string;
  status: JobStatus;
  processing_time_ms: number | null;
  created_at: string;
  user?: { id: number; name: string; email: string } | null;
}

export interface JobsResponse {
  jobs: PdfJobRow[];
  meta: PaginationMeta;
}

export interface JobStatsResponse {
  by_tool: Record<string, Record<string, { n: number; avg_ms: number | null }>>;
  today: Record<string, number>;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export interface SettingsResponse {
  settings: Record<string, string | null>;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  total_users: number;
  jobs_today: number;
  failed_jobs_today: number;
  completed_jobs_today: number;
  jobs_by_status: Record<string, number>;
  signups_last_30_days: Record<string, number>;
}

export interface QueueStatus {
  pending: number;
  processing: number;
  failed: number;
}

export interface SystemHealth {
  worker_alive: boolean;
  worker_last_beat: string | null;
  last_job_at: string | null;
  storage_inputs_mb: number;
  purge_last_run: string | null;
  php_version: string;
  laravel_version: string;
}

// ── Failed queue jobs ─────────────────────────────────────────────────────────

export interface FailedQueueJob {
  id: number;
  uuid: string;
  connection: string;
  queue: string;
  payload: string;
  exception: string;
  failed_at: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ── Stripe config ──────────────────────────────────────────────────────────────

export interface StripeKeyStatus {
  set: boolean;
  preview: string | null;
}

export interface StripeConfigResponse {
  config: Record<string, StripeKeyStatus>;
  webhook_url: string;
  provider: string;
}

// ── Subscriptions ─────────────────────────────────────────────────────────────

export interface SubscriptionRow {
  id: number;
  stripe_id: string;
  stripe_status: string;
  stripe_price: string;
  ends_at: string | null;
  created_at: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_plan: string;
}

export interface SubscriptionMetrics {
  active: number;
  cancelled: number;
  past_due: number;
  premium_users: number;
  stripe_configured: boolean;
}

export interface SubscriptionsResponse {
  subscriptions: SubscriptionRow[];
  meta: PaginationMeta | null;
  stripe_configured: boolean;
}

// ── Abuse & moderation ──────────────────────────────────────────────────────────

export interface AbuseLogEntry {
  id: number;
  ip_address: string;
  reason: string;
  endpoint: string | null;
  action_taken: string | null;
  user_id: number | null;
  metadata: Record<string, unknown> | null;
  triggered_at: string;
}

export interface AbuseLogsResponse {
  logs: AbuseLogEntry[];
  meta: PaginationMeta;
}

export interface IpBlocklistEntry {
  id: number;
  ip_address: string;
  reason: string;
  blocked_by: number | null;
  blockedBy?: { id: number; name: string } | null;
  expires_at: string | null;
  created_at: string;
}

export interface BlocklistResponse {
  blocklist: IpBlocklistEntry[];
}

// ── Plans ──────────────────────────────────────────────────────────────────────

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
  created_at: string;
  updated_at: string;
}

export interface PlansResponse {
  plans: Plan[];
}

export interface PlanPayload {
  name: string;
  description?: string | null;
  price: number;
  interval: PlanInterval;
  stripe_price_id?: string | null;
  features?: string[];
  is_active?: boolean;
  sort_order?: number;
}

// ── Audit log ─────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: number;
  admin_user_id: number;
  admin?: { id: number; name: string } | null;
  action: string;
  subject_type: string;
  subject_id: number;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip_address: string;
  created_at: string;
}

export interface AuditLogResponse {
  logs: AuditLogEntry[];
  meta: PaginationMeta;
}

// ── SEO ──────────────────────────────────────────────────────────────────────

export interface SeoFaqItem {
  q: string;
  a: string;
}

export interface SeoPageData {
  title: string;
  description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  keywords: string[];
  faq: SeoFaqItem[];
}

export interface SeoGlobalData {
  site_name: string;
  site_description: string;
  default_og_image: string;
  twitter_handle: string;
  facebook_app_id: string;
}

export interface SeoResponse {
  global: SeoGlobalData;
  pages: Record<string, SeoPageData | null>;
}

// ── Pages (static content) ──────────────────────────────────────────────────────

export interface PageEntry {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
  menu_order: number;
  created_at: string;
  updated_at: string;
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export interface LeadEntry {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source: string;
  status: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}
