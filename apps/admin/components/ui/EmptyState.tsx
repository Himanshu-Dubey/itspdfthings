export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center py-20 text-ink-2 text-sm">{children}</div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20 text-ink-2 text-sm gap-2">
      <svg className="animate-spin h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Loading…
    </div>
  );
}
