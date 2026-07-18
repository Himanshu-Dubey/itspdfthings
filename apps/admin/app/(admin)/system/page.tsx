"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { SystemHealth } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/EmptyState";
import { RefreshCw, Server, Clock, HardDrive, Cpu } from "lucide-react";

export default function SystemPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    adminApi
      .getSystemHealth()
      .then((r) => setHealth(r.health))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <>
      <PageHeader
        title="System Health"
        description="Queue worker, scheduler, storage, and runtime diagnostics"
        actions={
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-2 hover:text-brand transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      <main className="flex-1 px-6 pb-6 space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading && !health ? (
          <LoadingState />
        ) : health ? (
          <>
            {/* Worker health */}
            <Card>
              <CardHeader>
                <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
                  <Server size={14} className="text-ink-2" /> Queue Worker
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-3 text-sm">
                <Row
                  label="Status"
                  value={
                    <Badge variant={health.worker_alive ? "success" : "danger"}>
                      {health.worker_alive ? "Alive" : "Not responding"}
                    </Badge>
                  }
                />
                <Row
                  label="Last heartbeat"
                  value={health.worker_last_beat ? formatDate(health.worker_last_beat) : "Never"}
                />
                <Row
                  label="Last job processed"
                  value={health.last_job_at ? formatDate(String(health.last_job_at)) : "None"}
                />
                {!health.worker_alive && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                    The queue worker hasn't sent a heartbeat in over 90 seconds. Run{" "}
                    <code className="font-mono bg-amber-100 px-1 rounded">php artisan queue:work</code>{" "}
                    in the <code className="font-mono bg-amber-100 px-1 rounded">apps/api</code> directory.
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Scheduler health */}
            <Card>
              <CardHeader>
                <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
                  <Clock size={14} className="text-ink-2" /> Scheduler
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-3 text-sm">
                <Row
                  label="File purge (runs hourly)"
                  value={
                    health.purge_last_run ? (
                      <span className="text-ink">{formatDate(health.purge_last_run)}</span>
                    ) : (
                      <Badge variant="warning">Never run</Badge>
                    )
                  }
                />
                <p className="text-xs text-ink-2">
                  The scheduler runs via{" "}
                  <code className="font-mono bg-slate-100 px-1 rounded">php artisan schedule:run</code>{" "}
                  (triggered every minute by the system cron or docker-compose).
                </p>
              </CardBody>
            </Card>

            {/* Storage */}
            <Card>
              <CardHeader>
                <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
                  <HardDrive size={14} className="text-ink-2" /> Storage
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-3 text-sm">
                <Row label="Input files (not yet purged)" value={`${health.storage_inputs_mb} MB`} />
              </CardBody>
            </Card>

            {/* Runtime */}
            <Card>
              <CardHeader>
                <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
                  <Cpu size={14} className="text-ink-2" /> Runtime
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-3 text-sm">
                <Row label="PHP version" value={health.php_version} />
                <Row label="Laravel version" value={health.laravel_version} />
              </CardBody>
            </Card>
          </>
        ) : null}
      </main>
    </>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-ink-2 shrink-0">{label}</span>
      <span className="text-ink font-medium text-right">{value}</span>
    </div>
  );
}
