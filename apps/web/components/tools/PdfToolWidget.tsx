"use client";

import { jobs, ApiError } from "@/lib/api";
import type { Job } from "@/types/api";
import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "password" | "select" | "number";
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export interface ToolConfig {
  toolType: string;
  label: string;       // e.g. "Merge PDF"
  actionLabel?: string; // button text, defaults to label
  accept: string;      // file input accept attr, e.g. ".pdf" or ".jpg,.png"
  multiple?: boolean;  // true = accept multiple files
  maxFiles?: number;
  fields?: FieldConfig[];
}

// ── State machine ─────────────────────────────────────────────────────────────

type Phase =
  | { name: "idle" }
  | { name: "uploading"; progress: number }
  | { name: "polling"; jobId: string }
  | { name: "done"; job: Job }
  | { name: "error"; message: string };

const POLL_MS     = 1500;
const MAX_POLLS   = 80; // 2 min

// ── Component ─────────────────────────────────────────────────────────────────

export function PdfToolWidget({ config }: { config: ToolConfig }) {
  const [phase, setPhase]       = useState<Phase>({ name: "idle" });
  const [files, setFiles]       = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [fieldVals, setFieldVals] = useState<Record<string, string>>(() =>
    Object.fromEntries((config.fields ?? []).map((f) => [f.name, f.defaultValue ?? ""])),
  );
  const pollRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollCount  = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) clearTimeout(pollRef.current);
    pollRef.current = null;
    pollCount.current = 0;
  }, []);

  const startPolling = useCallback(
    (jobId: string) => {
      pollCount.current = 0;

      const poll = async () => {
        pollCount.current++;

        if (pollCount.current > MAX_POLLS) {
          stopPolling();
          setPhase({ name: "error", message: "Processing timed out. Please try again." });
          return;
        }

        try {
          const { job } = await jobs.status(jobId);

          if (job.status === "completed") {
            stopPolling();
            setPhase({ name: "done", job });
          } else if (job.status === "failed") {
            stopPolling();
            setPhase({ name: "error", message: job.error_message ?? "Processing failed." });
          } else {
            pollRef.current = setTimeout(poll, POLL_MS);
          }
        } catch {
          pollRef.current = setTimeout(poll, POLL_MS * 2);
        }
      };

      poll();
    },
    [stopPolling],
  );

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const arr = Array.from(incoming).slice(0, config.maxFiles ?? 20);
      setFiles(arr);
      setPhase({ name: "idle" });
      stopPolling();
    },
    [config.maxFiles, stopPolling],
  );

  const removeFile = useCallback((name: string) => {
    setFiles((f) => f.filter((file) => file.name !== name));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (files.length === 0) return;

      // Validate required fields
      for (const field of config.fields ?? []) {
        if (field.required && !fieldVals[field.name]) {
          setPhase({ name: "error", message: `${field.label} is required.` });
          return;
        }
      }

      setPhase({ name: "uploading", progress: 0 });

      const options: Record<string, string> = {};
      for (const [k, v] of Object.entries(fieldVals)) {
        if (v !== "") options[k] = v;
      }

      try {
        const input = config.multiple ? files : files[0];
        const { job } = await jobs.createWithProgress(
          input,
          config.toolType,
          options,
          (pct) => setPhase((prev) => prev.name === "uploading" ? { ...prev, progress: pct } : prev),
        );
        setPhase({ name: "polling", jobId: job.id });
        startPolling(job.id);
      } catch (err) {
        setPhase({
          name: "error",
          message: err instanceof ApiError ? err.message : "Upload failed. Please try again.",
        });
      }
    },
    [files, config, fieldVals, startPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setFiles([]);
    setPhase({ name: "idle" });
    setFieldVals(
      Object.fromEntries((config.fields ?? []).map((f) => [f.name, f.defaultValue ?? ""])),
    );
  }, [config, stopPolling]);

  const busy = phase.name === "uploading" || phase.name === "polling";
  const actionLabel = config.actionLabel ?? config.label;

  // ── Done state ───────────────────────────────────────────────────────────────
  if (phase.name === "done") {
    return (
      <div className="rounded-2xl border border-border-soft bg-white p-10 text-center shadow-soft space-y-5">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mx-auto">
          <CheckCircle2 size={28} className="text-emerald-600" strokeWidth={2} />
        </div>
        <p className="font-semibold text-ink text-lg">Done! Your file is ready.</p>
        {phase.job.download_url && (
          <a
            href={phase.job.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-soft"
          >
            Download result
          </a>
        )}
        <div>
          <button onClick={reset} className="text-sm text-ink-2 hover:text-ink underline cursor-pointer">
            Process another file
          </button>
        </div>
      </div>
    );
  }

  // ── Upload / idle state ───────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Hidden file input — triggered programmatically to avoid z-index/overlay issues */}
      <input
        ref={fileInputRef}
        type="file"
        accept={config.accept}
        multiple={config.multiple}
        disabled={busy}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Drop zone */}
      <div
        onClick={() => !busy && fileInputRef.current?.click()}
        onKeyDown={(e) => { if (!busy && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); fileInputRef.current?.click(); } }}
        role="button"
        tabIndex={busy ? -1 : 0}
        aria-label={`Select ${config.multiple ? "files" : "a file"} to upload`}
        onDragOver={(e) => { e.preventDefault(); if (!busy) setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={[
          "rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200",
          busy ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          dragActive
            ? "border-brand bg-brand-light scale-[1.01]"
            : files.length > 0
            ? "border-brand/40 bg-brand-light/50"
            : "border-border-soft bg-slate-50/50 hover:border-brand/40 hover:bg-brand-light/30",
        ].join(" ")}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={[
            "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
            dragActive || files.length > 0 ? "bg-brand" : "bg-brand-light",
          ].join(" ")}>
            <UploadCloud size={24} className={dragActive || files.length > 0 ? "text-white" : "text-brand"} strokeWidth={1.75} />
          </div>
          {files.length === 0 ? (
            <>
              <p className="font-medium text-ink">
                Drop {config.multiple ? "files" : "a file"} here, or <span className="text-brand">browse</span>
              </p>
              <p className="text-sm text-ink-2">{config.accept.replace(/\./g, "").toUpperCase()}</p>
            </>
          ) : (
            <div className="text-sm space-y-1.5 text-left max-w-full w-full">
              {files.map((f) => (
                <div key={f.name} className="flex items-center gap-2 bg-white rounded-lg border border-border-soft px-3 py-2">
                  <FileText size={15} className="text-brand shrink-0" />
                  <p className="truncate font-medium text-ink flex-1">{f.name}</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(f.name); }}
                    aria-label={`Remove ${f.name}`}
                    className="text-ink-2 hover:text-brand transition-colors cursor-pointer shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <p className="text-xs text-ink-2 pt-1">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
            </div>
          )}
        </div>
      </div>

      {/* Extra fields */}
      {(config.fields ?? []).length > 0 && (
        <div className="space-y-3 rounded-xl border border-border-soft bg-white p-5">
          {config.fields!.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-medium text-ink-2 mb-1 uppercase tracking-wide">
                {field.label}
                {field.required && <span className="text-brand ml-0.5">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  value={fieldVals[field.name]}
                  onChange={(e) => setFieldVals((v) => ({ ...v, [field.name]: e.target.value }))}
                  disabled={busy}
                  className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
                >
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={fieldVals[field.name]}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  onChange={(e) => setFieldVals((v) => ({ ...v, [field.name]: e.target.value }))}
                  disabled={busy}
                  className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {phase.name === "error" && (
        <p className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-brand-dark">
          <AlertCircle size={15} className="shrink-0" />
          {phase.message}
        </p>
      )}

      {/* Upload progress */}
      {phase.name === "uploading" && (
        <div className="rounded-lg bg-sky-50 border border-sky-200 px-4 py-3 text-sm text-sky-700 space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="shrink-0 animate-spin" />
            <span>Uploading… {phase.progress}%</span>
          </div>
          <div className="w-full bg-sky-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${phase.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Processing (server-side) */}
      {phase.name === "polling" && (
        <div className="flex items-center gap-3 rounded-lg bg-sky-50 border border-sky-200 px-4 py-3 text-sm text-sky-700">
          <Loader2 size={16} className="shrink-0 animate-spin" />
          Processing your file… this may take a few seconds.
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={files.length === 0 || busy}
        className="w-full bg-brand text-white py-3 rounded-xl font-semibold text-base hover:bg-brand-dark active:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-soft"
      >
        {phase.name === "uploading" ? `Uploading… ${phase.progress}%` : phase.name === "polling" ? "Processing…" : actionLabel}
      </button>
    </form>
  );
}
