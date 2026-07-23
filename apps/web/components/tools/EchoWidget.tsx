"use client";

import { jobs, ApiError } from "@/lib/api";
import type { Job } from "@/types/api";
import { useCallback, useRef, useState } from "react";

interface Props {
  toolType: string;
}

type WidgetState =
  | { phase: "idle" }
  | { phase: "uploading" }
  | { phase: "polling"; jobId: string }
  | { phase: "done"; job: Job }
  | { phase: "error"; message: string };

const POLL_INTERVAL_MS = 1500;
const POLL_MAX_ATTEMPTS = 80; // 2 minutes max

/**
 * Phase 0 echo widget — proves upload → queue → worker → storage → download.
 * Phase 1 replaces this with per-tool widgets.
 */
export function EchoWidget({ toolType }: Props) {
  const [state, setState] = useState<WidgetState>({ phase: "idle" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
    attemptsRef.current = 0;
  }, []);

  const startPolling = useCallback(
    (jobId: string) => {
      attemptsRef.current = 0;

      const poll = async () => {
        attemptsRef.current += 1;

        if (attemptsRef.current > POLL_MAX_ATTEMPTS) {
          stopPolling();
          setState({ phase: "error", message: "Processing timed out. Please try again." });
          return;
        }

        try {
          const res = await jobs.status(jobId);
          const job = res.job;

          if (job.status === "completed") {
            stopPolling();
            setState({ phase: "done", job });
          } else if (job.status === "failed") {
            stopPolling();
            setState({
              phase: "error",
              message: job.error_message ?? "Processing failed.",
            });
          } else {
            // Still pending/processing — schedule next poll.
            pollRef.current = setTimeout(poll, POLL_INTERVAL_MS);
          }
        } catch {
          // Transient network error — keep polling.
          pollRef.current = setTimeout(poll, POLL_INTERVAL_MS * 2);
        }
      };

      poll();
    },
    [stopPolling],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setSelectedFile(file);
      setState({ phase: "idle" });
      stopPolling();
    },
    [stopPolling],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedFile) return;

      setState({ phase: "uploading" });

      try {
        const res = await jobs.create(selectedFile, toolType);
        setState({ phase: "polling", jobId: res.job.id });
        startPolling(res.job.id);
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.message
            : "Upload failed. Please try again.";
        setState({ phase: "error", message: msg });
      }
    },
    [selectedFile, toolType, startPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setSelectedFile(null);
    setState({ phase: "idle" });
  }, [stopPolling]);

  const handleDownload = useCallback(async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  }, []);

  const isProcessing =
    state.phase === "uploading" || state.phase === "polling";

  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8">
      {state.phase === "done" ? (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-medium">✓ Processing complete!</p>
          {state.job.download_url && (
            <button
              onClick={() => handleDownload(state.job.download_url!)}
              className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 cursor-pointer"
            >
              Download result
            </button>
          )}
          <div>
            <button
              onClick={reset}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Process another file
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block cursor-pointer">
            <div className="flex flex-col items-center gap-3 py-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 16v-8m0 0-3 3m3-3 3 3M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-gray-500">
                {selectedFile
                  ? selectedFile.name
                  : "Click to select a file, or drag and drop"}
              </span>
            </div>
            <input
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </label>

          {state.phase === "error" && (
            <p className="text-sm text-red-600 text-center">{state.message}</p>
          )}

          {(state.phase === "polling") && (
            <p className="text-sm text-gray-500 text-center animate-pulse">
              Processing… this may take a few seconds.
            </p>
          )}

          <button
            type="submit"
            disabled={!selectedFile || isProcessing}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.phase === "uploading"
              ? "Uploading…"
              : state.phase === "polling"
              ? "Processing…"
              : "Upload & Process"}
          </button>
        </form>
      )}
    </div>
  );
}
