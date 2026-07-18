---
name: ui-ux-pro-max
description: "UI/UX design intelligence for LoveUPDF — a SaaS PDF tools web app. Covers 50+ design rules across accessibility, layout, typography, animation, forms, navigation, and charts. Stacks: Next.js App Router, Tailwind CSS, shadcn/ui. Apps: apps/web (user-facing) and apps/admin (superadmin dashboard). Actions: plan, build, create, design, implement, review, fix, improve, optimize, enhance, refactor, check."
---

# UI/UX Pro Max — LoveUPDF Design Intelligence

Comprehensive design guide for the LoveUPDF SaaS PDF tools web app. Applies to `apps/web` (user-facing Next.js app) and `apps/admin` (superadmin Next.js dashboard). Stack: Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui.

## When to Apply

Use this skill when the task involves **UI structure, visual design decisions, interaction patterns, or UX quality**.

### Must Use
- Designing or building new pages or components in `apps/web` or `apps/admin`
- Choosing colors, typography, spacing, or layout patterns
- Reviewing UI code for accessibility or visual consistency
- Implementing responsive behavior, navigation, or loading/error states
- Any form, table, modal, chart, or data visualization

### Skip
- Pure backend/API/Laravel work
- Queue jobs, migrations, console commands
- Infrastructure, Docker, CI/CD

---

## LoveUPDF Brand & Design Tokens

These are the project-specific values. Always use these — never introduce new colors or font choices without updating here first.

### Colors

```
Primary:          #DC2626  (red-600)    — CTAs, links, active states
Primary hover:    #B91C1C  (red-700)
Primary light:    #FEF2F2  (red-50)     — backgrounds behind red elements
Primary border:   #FECACA  (red-200)

Text primary:     #111827  (gray-900)
Text secondary:   #4B5563  (gray-600)
Text muted:       #9CA3AF  (gray-400)
Text placeholder: #D1D5DB  (gray-300)

Border default:   #E5E7EB  (gray-200)
Border focus:     #DC2626  (red-600)

Surface white:    #FFFFFF
Surface gray:     #F9FAFB  (gray-50)
Surface elevated: #FFFFFF  + shadow-sm

Success bg:       #F0FDF4  (green-50)
Success text:     #16A34A  (green-700)
Success border:   #BBF7D0  (green-200)

Warning bg:       #FFFBEB  (amber-50)
Warning text:     #B45309  (amber-700)
Warning border:   #FDE68A  (amber-200)

Error bg:         #FEF2F2  (red-50)
Error text:       #B91C1C  (red-700)
Error border:     #FECACA  (red-200)

Info bg:          #EFF6FF  (blue-50)
Info text:        #1D4ED8  (blue-700)
Info border:      #BFDBFE  (blue-200)
```

**Admin-specific (apps/admin sidebar):**
```
Sidebar bg:       #0F172A  (slate-900)
Sidebar text:     #94A3B8  (slate-400)
Sidebar hover:    #1E293B  (slate-800)
Sidebar active text: #FFFFFF
Sidebar active indicator: #DC2626 (red-600) — 2px left border
Top bar bg:       #FFFFFF  with border-b border-gray-200
```

### Typography

```
Font family:  Geist Sans (loaded via next/font/google in layout.tsx)
Mono font:    Geist Mono (for code, job IDs, file paths)
```

| Role | Class |
|------|-------|
| Page title | `text-2xl font-bold tracking-tight text-gray-900` |
| Section heading | `text-lg font-semibold text-gray-900` |
| Card title | `text-sm font-semibold text-gray-900` |
| Body | `text-sm text-gray-600 leading-relaxed` |
| Label | `text-xs font-medium text-gray-500 uppercase tracking-wide` |
| Caption | `text-xs text-gray-400` |
| Code / ID | `font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700` |

### Spacing & Layout

```
Page padding (web):    px-4 sm:px-6 lg:px-8 py-8 md:py-12
Page padding (admin):  px-4 sm:px-6 lg:px-8 py-6
Max width (web):       max-w-6xl mx-auto
Max width (admin):     max-w-7xl mx-auto
Card padding:          p-6
Section gap:           space-y-6
Form gap:              space-y-4
Inline gap:            gap-3
Tool card grid:        grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4
Admin stat grid:       grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
```

---

## Component Library

### Buttons

```tsx
// Primary
<button className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">

// Secondary
<button className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">

// Destructive
<button className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">

// Ghost
<button className="inline-flex items-center gap-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-lg transition-colors">

// Loading state (apply to any button)
<button disabled className="... opacity-75 cursor-not-allowed">
  <svg className="animate-spin h-4 w-4" .../>
  Processing…
</button>
```

### Cards

```tsx
// Standard card
<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

// Interactive tool card (home page)
<div className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-red-400 hover:shadow-md transition-all duration-200 cursor-pointer">

// Admin stat card
<div className="bg-white rounded-xl border border-gray-200 p-6">
  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Metric Label</p>
  <p className="mt-2 text-3xl font-bold tabular-nums text-gray-900">1,234</p>
  <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
    <span>↑ 12%</span><span className="text-gray-400">vs last month</span>
  </p>
</div>
```

### Form Elements

```tsx
// Label
<label className="block text-sm font-medium text-gray-700 mb-1">
  Field Name <span className="text-red-500">*</span>
</label>

// Input
<input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors" />

// Input error state
<input className="w-full border border-red-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50" />

// Error message
<p className="mt-1 text-xs text-red-600 flex items-center gap-1">
  <span aria-hidden="true">⚠</span> Error message here
</p>

// Helper text
<p className="mt-1 text-xs text-gray-500">Helper text here</p>

// Select
<select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white">
```

### Badges / Status Pills

```tsx
// Job status
const statusClass = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  completed:  "bg-green-50 text-green-700 border-green-200",
  failed:     "bg-red-50 text-red-700 border-red-200",
}
<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusClass[status]}`}>
  {status}
</span>

// Plan
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">Premium</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Free</span>

// Banned
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Banned</span>
```

### Upload Drop Zone

```tsx
<div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50/30 transition-colors cursor-pointer p-10 sm:p-16 text-center group">
  <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-red-500 transition-colors mb-4">
    {/* Upload icon SVG */}
  </div>
  <p className="text-sm font-medium text-gray-700">Drop files here or <span className="text-red-600">browse</span></p>
  <p className="mt-1 text-xs text-gray-400">PDF up to 20 MB (free) · 500 MB (premium)</p>
</div>
```

### Progress / Loading States

```tsx
// Skeleton loader
<div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
<div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mt-2" />

// Inline spinner
<svg className="animate-spin h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
</svg>

// Progress bar
<div className="w-full bg-gray-100 rounded-full h-1.5">
  <div className="bg-red-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
</div>
```

### Admin Table

```tsx
<div className="overflow-x-auto">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 first:rounded-tl-lg last:rounded-tr-lg">Column</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-gray-900">Value</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Admin Sidebar

```tsx
// Layout shell
<div className="flex h-screen bg-gray-50">
  {/* Sidebar */}
  <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
    {/* Logo */}
    <div className="h-14 flex items-center px-4 border-b border-slate-800">
      <span className="text-white font-bold text-lg">LoveUPDF</span>
      <span className="ml-2 text-red-500 text-xs font-medium bg-red-500/10 px-1.5 py-0.5 rounded">Admin</span>
    </div>
    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {/* Active item */}
      <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium border-l-2 border-red-500">
        {/* icon */} Dashboard
      </a>
      {/* Inactive item */}
      <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white text-sm font-medium transition-colors">
        {/* icon */} Users
      </a>
    </nav>
    {/* Admin user at bottom */}
    <div className="p-3 border-t border-slate-800">
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="h-7 w-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">A</div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-white truncate">Admin Name</p>
          <p className="text-xs text-slate-500 truncate">superadmin</p>
        </div>
      </div>
    </div>
  </aside>
  {/* Main */}
  <div className="flex-1 flex flex-col min-w-0">
    {/* Top bar */}
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0">
      <h1 className="text-sm font-semibold text-gray-900">Page Title</h1>
    </header>
    <main className="flex-1 overflow-auto p-6 bg-gray-50">
      {/* content */}
    </main>
  </div>
</div>
```

### Empty States

```tsx
<div className="text-center py-16">
  <div className="mx-auto h-12 w-12 text-gray-300 mb-4">{/* icon */}</div>
  <h3 className="text-sm font-semibold text-gray-900 mb-1">No items yet</h3>
  <p className="text-sm text-gray-500 mb-4">Description of what will appear here.</p>
  <button className="...primary button...">Take action</button>
</div>
```

### Toast / Alert Banner

```tsx
// Success
<div role="alert" className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
  <span className="shrink-0 mt-0.5">✓</span> Message here
</div>
// Error
<div role="alert" className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
  <span className="shrink-0 mt-0.5">✕</span> Message here
</div>
```

---

## Admin Dashboard Layout (Section Map)

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR (w-60, slate-900)    │ MAIN (flex-1, gray-50)       │
│ ─────────────────────────    │ ───────────────────────────── │
│ Logo + "Admin" badge         │ Top bar (white, h-14)         │
│                              │  • Page title + breadcrumb    │
│ ─ Main ─                     │  • Action buttons right       │
│  Dashboard         ←active   │                               │
│  Users                       │ Content area (p-6)            │
│  Subscriptions               │  ┌─────┐ ┌─────┐ ┌─────┐    │
│  Pricing                     │  │Stat │ │Stat │ │Stat │    │
│  Jobs                        │  └─────┘ └─────┘ └─────┘    │
│  Abuse                       │                               │
│ ─ System ─                   │  ┌───────────────────────┐   │
│  Settings                    │  │  Chart / Table         │   │
│  Audit Log                   │  └───────────────────────┘   │
│                              │                               │
│ [avatar] Admin               │                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Design Rules by Priority

*Follow priority 1→10; higher priority = fix first.*

| Priority | Category | Impact | Key Rules |
|----------|----------|--------|-----------|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, alt text, keyboard nav, aria-labels, focus rings |
| 2 | Interaction feedback | CRITICAL | Loading states, disabled states, error feedback, 150ms response |
| 3 | Layout & Responsive | HIGH | Mobile-first, no horizontal scroll, safe breakpoints |
| 4 | Forms | HIGH | Visible labels, error below field, inline validation on blur |
| 5 | Typography & Color | HIGH | Use tokens above — never raw hex in components |
| 6 | Empty & Loading states | HIGH | Skeleton loaders (not blank screens), empty state with CTA |
| 7 | Animation | MEDIUM | 150–300ms, transform/opacity only, ease-out enter / ease-in exit |
| 8 | Navigation | MEDIUM | Active state visible, predictable back, admin sidebar always visible |
| 9 | Charts (admin) | MEDIUM | Legend, tooltip on hover, accessible colors, Recharts |
| 10 | Dark mode | LOW | Not required in MVP — skip until Phase 4 |

### 1. Accessibility (CRITICAL)
- Minimum 4.5:1 contrast for body text, 3:1 for large text
- Every interactive element reachable by keyboard
- Focus ring: `focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`
- Icon-only buttons must have `aria-label`
- Form inputs must have a visible `<label>` — never placeholder-only
- Error messages use `role="alert"` or `aria-live="polite"`
- Don't convey state by color alone — pair with icon or text

### 2. Interaction Feedback (CRITICAL)
- Every button shows loading state during async operations (spinner + disabled)
- Upload widget shows progress: idle → uploading → processing → done/error
- Polling jobs update UI without full-page reload
- Destructive actions (ban, delete) require a confirmation dialog
- Toast notifications auto-dismiss after 4s; error toasts persist until dismissed

### 3. Layout & Responsive (HIGH)
- Mobile-first: design for 375px, scale up
- Tool pages (web): single column on mobile, centered content max-w-3xl
- Admin: sidebar collapses to drawer on screens < 1024px (lg breakpoint)
- No horizontal scroll at any breakpoint
- Min touch target: 44×44px for all buttons and interactive elements

### 4. Forms (HIGH)
- Every input has a `<label>` with `htmlFor`
- Required fields marked with `*` in red
- Validate on blur, not on keystroke
- Error message appears below the relevant field, not just at top
- Submit button disabled while loading
- Password fields have show/hide toggle

### 5. Typography & Color (HIGH)
- Never use raw hex values in components — use Tailwind classes from the token table above
- Never introduce new colors without adding them to the brand token table first
- Don't use emojis as icons — use Lucide React (already available via shadcn/ui)
- Body text minimum `text-sm` (14px) — never smaller on key content
- Tabular numbers (`tabular-nums`) for all prices, counts, stats

### 6. Empty & Loading States (HIGH)
- Every list/table must handle: loading (skeleton), empty (message + CTA), error (message + retry)
- Never show a blank white screen — always communicate what's happening
- Skeletons match the shape of the content they represent

### 7. Animation (MEDIUM)
- Duration: 150ms for micro (hover/focus), 200–300ms for layout changes
- Properties: `transform` and `opacity` only — never animate `width`, `height`, `top`, `left`
- Easing: `ease-out` for elements entering, `ease-in` for leaving
- Respect `prefers-reduced-motion` — wrap animations in the media query check
- Never block user interaction during animation

### 8. Navigation (MEDIUM)
- `apps/web`: sticky top header, active page highlighted in nav
- `apps/admin`: sidebar always visible on desktop, active item has left red border
- Breadcrumbs for admin pages deeper than 1 level
- Back navigation always works predictably

### 9. Charts — Recharts (admin only)
- Always include legend and tooltips
- Use accessible color palette (not red/green only — add blue, purple, amber)
- Show skeleton while data loads
- Empty state when no data: "No data for this period"
- Responsive: use `<ResponsiveContainer width="100%" height={300}>`

---

## What to Do When Invoked

Given `$ARGUMENTS` (a file path or component name):

1. **Read** the target file(s)
2. **Identify** every violation of the rules above, ordered by priority
3. **Apply** the LoveUPDF design tokens and component patterns
4. **Ensure** loading, empty, and error states exist
5. **Check** accessibility: labels, focus rings, aria attributes, color contrast
6. **Check** responsiveness: does it work on 375px and 1440px?
7. **Rewrite** the component — don't just add classes on top of bad structure
8. Deliver the improved file — one short comment per non-obvious design decision only

---

## Pre-Delivery Checklist

- [ ] All colors from brand token table (no raw hex)
- [ ] Buttons: hover, active, disabled, loading states all present
- [ ] Forms: visible labels, error below field, validation on blur
- [ ] Lists/tables: loading skeleton, empty state, error state
- [ ] All interactive elements keyboard-reachable with visible focus ring
- [ ] Icon-only buttons have `aria-label`
- [ ] No emoji used as icons (use Lucide React)
- [ ] Tested mentally at 375px (mobile) and 1280px (desktop)
- [ ] Admin pages: sidebar active state correct, breadcrumb present if nested
- [ ] Numbers/stats use `tabular-nums`
- [ ] Touch targets ≥ 44×44px
