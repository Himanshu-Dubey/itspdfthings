# Project brief: PDF tools SaaS (MVP) — for Claude Code
### v2 — decoupled architecture: Next.js frontend + Laravel API backend

Paste the section below ("Prompt to paste into Claude Code") as your first message, after saving this whole file as `PROJECT_BRIEF.md` in your empty project folder. Claude Code will read it for full context.

---

## Prompt to paste into Claude Code

I'm building a production-ready PDF tools web app (think a leaner iLovePDF) as a solo bootstrapped SaaS. I've saved the full spec in `PROJECT_BRIEF.md` in this directory — read it fully before writing any code.

This is a **decoupled architecture**: Laravel is a pure API (no Blade views for the product itself), Next.js is a fully separate frontend. Treat these as two applications living in one monorepo, not one Laravel app with a frontend bolted on.

Work in phases, in the order defined in the brief. After each phase: stop, summarize what you built, list any assumptions you made, and wait for my go-ahead before starting the next phase. Don't try to build all phases in one pass.

Start by reading `PROJECT_BRIEF.md`, then propose the monorepo structure and ask me anything you need clarified before scaffolding Phase 0.

---

## Project brief

### What this is
A freemium PDF tools web app. Users upload a PDF (or image/Office file), the server runs a transformation, and the user downloads the result. No desktop/mobile app, no AI features, no e-signature — those are explicitly out of scope for this build.

### Repository structure
Monorepo, three apps:
```
/apps/api        → Laravel (backend, API-only — serves both web and admin)
/apps/web        → Next.js (public-facing frontend — tool pages, user dashboard, billing)
/apps/admin      → Next.js (superadmin dashboard — separate app, separate subdomain, separate auth)
/docker-compose.yml   → orchestrates api, queue-worker, redis, mysql for local dev
```
`web` deploys to Vercel (`app.yourdomain.com`). `admin` deploys to Vercel (`admin.yourdomain.com`). `api` deploys to a VPS via Docker Compose (`api.yourdomain.com`). These are independently deployable — don't introduce build-time coupling between them beyond the OpenAPI/type contract described below.

The admin app is a completely separate Next.js application from the user-facing frontend — different subdomain, different auth flow (admin-role check), different Vercel project. Do not build the admin dashboard as a route inside the user-facing `apps/web` app.

### Non-negotiable tech stack

**Backend (`/apps/api`)**
- PHP 8.3 + Laravel (latest LTS-equivalent), API-only — no Blade views for product pages.
- **Laravel Sanctum, SPA mode** (cookie-based session auth, not token/JWT) — this requires `api.yourdomain.com` and `app.yourdomain.com` (or `www.yourdomain.com`) to share the same root domain so cookies and CORS work cleanly. Do not implement JWT/bearer-token auth instead — Sanctum SPA mode is simpler and is what Laravel's own docs recommend for exactly this split.
- Redis + Laravel Queue (Horizon for monitoring) for async job processing.
- MySQL 8.
- File processing engines, invoked as CLI subprocesses (never embedded as libraries): `qpdf` (merge, split, reorder/delete pages, encrypt/decrypt), Ghostscript (compress, PDF/A), ImageMagick (image ⇄ PDF). Defer LibreOffice/Tesseract to Phase 2.
- Object storage: S3-compatible API, built against `Storage::disk('s3')` so it can point at AWS S3, Cloudflare R2, or Backblaze B2 via env vars only — never hardcode a provider SDK call.
- Stripe Checkout + Laravel Cashier for billing — never build a custom card form.
- Docker Compose services: `app` (PHP-FPM + Nginx, or `php artisan serve` for simplicity at this scale), `queue-worker`, `redis`, `mysql`.

**Frontend (`/apps/web`)**
- Next.js, App Router, TypeScript.
- Static generation (SSG) or ISR for every marketing/tool-landing page (`/merge-pdf`, `/compress-pdf`, etc.) — these must be fully indexable with zero required client-side JS for the page's core content. This is the entire reason Next.js was chosen over a plain React SPA — don't accidentally make these pages client-rendered.
- Client components only for the actual interactive upload/process/download widget embedded on each tool page, and for authenticated areas (dashboard, billing, job history).
- Tailwind CSS for styling.
- Deployed on Vercel.
- API calls to Laravel use `credentials: 'include'` (cookie-based session, matching Sanctum SPA mode) — do not implement a separate token-storage scheme.

### Domain/CORS setup (get this right in Phase 0 — it's the #1 source of pain in this architecture)
**Use the real production domain from day one — do not prototype against `*.vercel.app` or bare `localhost` ports and migrate later.** Cookie/SameSite/CORS behavior is tied to actual domain structure; validating auth against throwaway domains just defers the real test to a later phase where more code already assumes auth works. Register the domain before starting Phase 0 if it isn't already registered — this is a five-minute, ~$10–15/year task and should not block or get bundled into engineering time.

- `app.yourdomain.com` (or `www.yourdomain.com`) → Next.js on Vercel (add as a custom domain in Vercel immediately — works even before the VPS side is ready).
- `api.yourdomain.com` → Laravel on the VPS (DNS can point here before the VPS is fully provisioned; it'll just fail to resolve to anything live until it is, which is harmless).
- Laravel `config/cors.php`: allow the frontend origin explicitly (never a wildcard), `supports_credentials = true`.
- Laravel `config/sanctum.php`: `stateful` domains must include the frontend's real domain.
- Local dev: use `/etc/hosts` entries mapping local subdomains of the *real* domain (e.g. `127.0.0.1 app.yourdomain.com` and a separate local override for `api.yourdomain.com`, or a tool like Laravel Herd/Valet) rather than `localhost:3000` / `localhost:8000` — this keeps local dev's cookie/SameSite behavior consistent with what you'll see in production, instead of discovering a mismatch only after deploying.
- Phase 0 is not complete until cross-origin cookie auth is verified against these real domains specifically — not against any throwaway substitute.

### Architecture (must match this shape)
1. **Next.js frontend** (Vercel) renders tool landing pages statically. The interactive widget on each page is a client component.
2. **Client uploads a file** → client component calls the Laravel API directly (cross-origin, cookie-authenticated via Sanctum).
3. **Laravel API** validates the upload (type via content inspection not extension, size, virus-scan hook — stub the scanner interface for now), stores it in object storage, creates a `Job` record in MySQL, pushes a job onto the Redis queue, and returns a job ID immediately. **Never block the HTTP request on processing.**
4. **Queue worker** (separate container/process) picks up the job, downloads the file from object storage to a scratch dir, shells out to the relevant CLI tool with strict resource limits (timeout, memory cap, no network access for the subprocess, dedicated scratch dir wiped after the job), uploads the result back to object storage, updates the `Job` record to `completed` or `failed`.
5. **Next.js client component** polls a status endpoint (or uses SSE) and then downloads the result via a short-lived signed URL — never a permanent public path.
6. **Storage lifecycle**: every uploaded/processed file gets a `delete_after` timestamp (default: now + 12 hours). A Laravel scheduled command purges expired files from both object storage and their DB rows on a recurring basis — this must actually run, not just exist as a TODO.

### API contract between the two apps
Define the API surface with an OpenAPI spec (or at minimum a single shared `types.ts` generated from Laravel's responses) early in Phase 0, before building UI against it. This is the seam most likely to drift out of sync in a two-repo-feeling monorepo — don't let the frontend guess at response shapes.

### Required data model (adjust as needed, but cover these entities)
- `users` (standard Laravel auth + a `plan` field: `free` | `premium`, `is_banned`, `banned_reason`, `country`, `last_active_at`)
- `admin_users` (separate table from `users` — never share the same auth table; fields: id, name, email, password, role: `superadmin` | `support`, last_login_at)
- `jobs` (id, user_id nullable [anonymous use allowed], tool_type, status, input_path, output_path, error_message, delete_after, processing_time_ms, created_at)
- `usage_counters` (per-user or per-IP-for-anonymous, per-tool, per-day — enforces free-tier quotas)
- `subscriptions` (via Laravel Cashier — don't hand-roll Stripe subscription state tracking)
- `settings` (key-value table for runtime-editable config: free-tier quotas per tool, file size caps, maintenance mode flags, announcement banners — anything that should change without a code deploy lives here, not in `.env`)
- `abuse_logs` (IP, reason, triggered_at, action_taken — populated by rate-limit breaches and file validation failures)
- `ip_blocklist` (IP or CIDR range, blocked_by admin_user_id, reason, created_at)

### MVP feature scope — build exactly these 8 tools, nothing more
1. Merge PDF (multiple PDFs → one)
2. Split PDF (one PDF → page ranges or individual pages)
3. Compress PDF (Ghostscript, with a quality/size tradeoff setting)
4. Rotate/reorder/delete pages (single "organize" UI covering all three — this is the tool most worth a richer React drag-and-drop component)
5. Image → PDF and PDF → Image (JPG/PNG)
6. Add watermark (text or image overlay)
7. Add page numbers
8. Protect (add password) / Unlock (remove password, user's own file only)

Do not start building Word/Excel/PPT conversion, OCR, e-signature, or AI features in this pass — they are explicitly Phase 2.

### Free-tier limits to enforce from day one
- Anonymous users: identify by IP + a signed cookie, allow a small number of tasks/day per tool (configurable via Laravel config, not magic numbers in controllers).
- File size caps per tool, enforced server-side before the file reaches the queue.
- Registered free users get slightly higher caps; `premium` users bypass caps (still enforce an absolute hard ceiling, e.g. 500MB, regardless of plan).

### Security requirements (treat as acceptance criteria, not nice-to-haves)
- Validate file type by content inspection, not just extension/client-supplied MIME type.
- Every subprocess call: hard timeout, memory limit, no network access, dedicated scratch directory wiped after the job regardless of outcome.
- Rate-limit the upload endpoint per-IP independent of per-tool task quotas (flood/DoS protection, separate concern from quota abuse).
- All file downloads via short-lived signed URLs only.
- Stub a virus-scan interface (`ScansFile` contract) now with a no-op implementation, so real ClamAV integration is a drop-in later.
- CORS configured to allow only the known frontend origin(s) — never a wildcard, even in development convenience configs that might leak into production.

### Superadmin dashboard (`/apps/admin`) — full specification

This is a first-class part of the product, not an afterthought. Build it as Phase 5 (after launch readiness), but design the API endpoints and data model for it from Phase 0 so nothing needs to be retrofitted.

**Auth & access**
- Completely separate login from the user-facing app (`admin.yourdomain.com/login`).
- Separate `admin_users` table — never reuse the public `users` table for admin login.
- Sanctum SPA auth, same pattern as the user-facing app but scoped to the admin subdomain.
- Role-based: `superadmin` (full access), `support` (read-only on users/jobs, can't touch pricing or system config).
- All admin API routes protected by a dedicated `auth:admin` middleware — not the same middleware guarding user-facing routes.
- Every admin action (user ban, plan change, settings edit, IP block) written to an `admin_audit_log` table (who did what, to which record, at what time) — non-negotiable for a product you'll operate solo for months without institutional memory.

**Section 1 — Dashboard home**
- Key metrics at a glance: total users, active subscriptions, MRR, jobs processed today, failed jobs today, storage used.
- Sparkline charts for the last 30 days: new signups, new paid subscriptions, churn, job volume.
- Live queue status: jobs pending / processing / failed right now.
- Any triggered maintenance mode or announcement banners currently active.

**Section 2 — User management**
- Paginated, searchable, filterable user list (filter by: plan, country, registration date range, banned status, last active).
- Per-user detail page:
  - Profile: email, name, plan, registration date, country, last active, total jobs run lifetime.
  - Job history: last N jobs with tool type, status, file size, processing time.
  - Billing history: invoices from Stripe via Cashier.
  - Actions: upgrade/downgrade plan manually, extend trial, ban/unban (with mandatory reason field), hard-delete (GDPR — purges user row, all their jobs, and any files not yet auto-deleted), impersonate (opens the user-facing app as this user in a new tab, with a clearly visible "you are impersonating X" banner — never silently).
- Export filtered user list as CSV.

**Section 3 — Subscriptions & revenue**
- Live subscription list: plan, user, status (active / cancelled / past-due / trialing), renewal date, Stripe subscription ID.
- Revenue overview: MRR, ARR, churn rate this month, new subscriptions this month, upgrades, downgrades — all calculated from Cashier data, not a separate analytics DB.
- Per-subscription actions: cancel (end of period), cancel immediately, apply one-time discount (Stripe coupon), extend trial period.
- Refund trigger: calls Stripe refund API for a specific invoice — never touches money directly, just calls the Stripe API.

**Section 4 — Pricing & plan configuration**
- Edit free-tier quotas per tool (daily task cap for anonymous users, daily task cap for registered free users, max file size per tool) — these read from and write to the `settings` table, take effect immediately, no deploy needed.
- Edit Premium plan price — updates both the `settings` table and syncs the new price to Stripe Products/Prices API (don't allow this to get out of sync).
- Toggle individual tools on/off globally — a disabled tool returns a clear "temporarily unavailable" error to users; its nav entry is hidden in the frontend (frontend reads tool status from a public `/api/tools/status` endpoint that the admin toggle updates).
- Site-wide maintenance mode toggle — when on, the public frontend shows a maintenance page; the admin dashboard remains accessible.
- Announcement banner: set a text message + optional link + expiry time that appears across the public frontend (e.g. "We're experiencing delays on Compress jobs — investigating").

**Section 5 — Jobs & processing**
- Live job queue: pending count, processing count, failed count, oldest pending job age — auto-refreshing every 30s.
- Failed jobs list: job ID, user (or anonymous IP), tool type, error message, failed at, retry count. Actions: retry individual job, delete job record.
- Per-tool stats for today / last 7 days / last 30 days: total jobs, success rate, avg processing time (ms), p95 processing time (ms), total data processed (MB).
- Storage overview: total object storage used (sum of files not yet past `delete_after`), broken down by uploaded vs processed files.
- Manual trigger for the file-deletion scheduled command (useful if it falls behind — runs it immediately on-demand, shows result).

**Section 6 — Abuse & moderation**
- Abuse log: paginated list of triggered events (rate-limit breaches, file-type validation failures, virus-scan hits) with IP, timestamp, endpoint, action taken.
- IP blocklist: current blocked IPs/CIDR ranges, who added each, when, why. Add/remove individual entries.
- One-click "block this IP" from anywhere in the abuse log — no need to navigate away and re-enter manually.

**Section 7 — System & config**
- Worker health: last job processed timestamp, current queue depth, whether the queue worker process is alive (ping via a heartbeat key in Redis that the worker updates every 60s).
- Scheduler health: last time each scheduled command ran successfully (file deletion cron, usage counter reset, etc.) — read from Laravel's scheduler output log.
- Email log: last 50 emails sent (recipient, subject, sent at, delivery status if available via your mail provider's webhook).
- Feature flags: a simple boolean on/off table for features not ready for all users — each flag has a name, description, and current state. The application reads these at runtime from the `settings` table.
- Admin audit log: full history of every action taken by any admin user (read-only view — no editing or deleting audit entries).

**Frontend stack for `/apps/admin`**
- Next.js App Router, TypeScript, Tailwind CSS — same as the user-facing app.
- Use shadcn/ui components (Table, Dialog, Badge, Card, etc.) for speed — the admin UI needs to be functional and clear, not custom-designed.
- Recharts for the dashboard sparklines and per-tool stats charts — lightweight, works with shadcn/ui.
- No SSG/ISR needed here — all pages are client-rendered (admin data must be fresh, never cached at build time). All routes behind auth check; redirect to `/login` if no admin session.

**API surface for admin (in `/apps/api`)**
- All admin endpoints under `/api/admin/` prefix, protected by `auth:admin` middleware.
- Separate controller namespace (`App\Http\Controllers\Admin\`) from user-facing controllers — never share a controller between user-facing and admin routes.
- Admin API endpoints never reuse user-facing policy/gate logic — admin access is its own explicit check, not an escalated version of user permissions.


### Build order (work through sequentially, pause between each)
1. **Phase 0 — Foundation (all three apps, auth seams, pipeline seam)**
   - Monorepo scaffolding for `/apps/api`, `/apps/web`, and `/apps/admin`.
   - Laravel: Sanctum SPA auth configured and working — prove login/logout/session-check works from a *cross-origin* request before building anything else. Set up both `users` and `admin_users` tables and their separate auth guards (`web` and `admin`) from day one — do not share auth guards between the two.
   - Next.js (web): basic layout, one static page, one client component that successfully calls a protected Laravel endpoint and reflects auth state.
   - Next.js (admin): basic layout, login page, one protected page that confirms admin session is working from `admin.yourdomain.com`.
   - Docker Compose: app/queue-worker/redis/mysql running locally.
   - A trivial "echo" job proving the full upload → queue → worker → storage → status-poll → download loop works end-to-end with a dummy no-op transformation, driven from the Next.js client.
   - **Don't proceed past this phase until cross-origin cookie auth is verified working for both `app.` and `admin.` subdomains** — this is the architectural risk unique to this stack.
2. **Phase 1 — Core tools v1**: Merge, Split, Compress, Organize, Image⇄PDF, wired through the real pipeline with real Next.js tool pages (SSG shell + client widget). Anonymous use works, no quota gating yet.
3. **Phase 2 — Accounts, quotas, billing**: Usage counters and free-tier caps, an authenticated dashboard (Next.js web) with job history, Stripe Checkout + Cashier, paywall enforcement on the API side.
4. **Phase 3 — Remaining tools + hardening**: Watermark, page numbers, protect/unlock; any deferred security requirements; load-test the worker under concurrent jobs.
5. **Phase 4 — Launch readiness**: File auto-deletion scheduled command, privacy policy/ToS pages (placeholder copy — flag that I need to review it myself), per-tool SEO landing pages (verify they're actually statically generated, inspect the rendered HTML, don't just trust the dev server), error monitoring (Sentry on all three apps), health-check endpoint, Vercel + VPS deploy pipelines documented.
6. **Phase 5 — Superadmin dashboard**: Build `/apps/admin` in full per the superadmin specification above. All 7 sections in order. Every admin action writes to `admin_audit_log`. Deploy to `admin.yourdomain.com` as a separate Vercel project. Do not consider this phase complete until: (a) all 7 sections render real data, not mock data, (b) at least one action per section has been manually tested end-to-end (e.g. ban a test user, retry a failed job, toggle a tool off and verify the public frontend reflects it, change a free-tier quota and verify it takes effect without a deploy).

### Testing expectations
- Laravel feature tests for the full upload → process → download happy path for every one of the 8 tools.
- Tests for quota enforcement (free tier hits its cap, gets a clear error).
- At least one test per tool feeding a malformed/corrupt file, asserting a graceful `failed` job status, not an unhandled exception or crashed worker.
- A cross-origin auth test specifically (login from the Next.js origin, confirm the session cookie is accepted on a subsequent API call) — this is the integration point most likely to silently break.
- For Next.js: confirm via build output (or `next build` + inspecting `.next/server/pages` or the App Router equivalent) that tool landing pages are actually statically generated, not accidentally opted into client-side rendering.

### Working agreement
- Ask me before any decision not already pinned down here (UI layout specifics, package choices beyond what's specified above).
- Keep commits small with clear messages — I'll read this history later to understand what was built.
- Maintain `.env.example` files for `/apps/api`, `/apps/web`, and `/apps/admin`, always in sync with what's actually read.
- Flag anything in this brief that turns out technically awkward once you're in the code — don't silently work around a bad assumption, surface it.
- If Sanctum SPA cross-origin auth turns out to be fighting you hard in Phase 0, stop and tell me rather than quietly switching to a token-based auth scheme — that's an architecture decision I want to make deliberately, not have made for me under time pressure. 