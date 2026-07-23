"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { adminApi } from "@/lib/api";
import {
  Trash2,
  RefreshCw,
  Server,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  Loader2,
} from "lucide-react";

interface CacheStatus {
  cache_driver: string;
  queue_driver: string;
  disk_free_mb: number;
  disk_total_mb: number;
  php_version: string;
  laravel_version: string;
  memory_limit: string;
  upload_max_filesize: string;
}

export default function CachePage() {
  const [status, setStatus] = useState<CacheStatus | null>(null);
  const [clearing, setClearing] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getCacheStatus()
      .then((d) => setStatus(d as unknown as CacheStatus))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const clearAll = async () => {
    if (!confirm("Clear all caches? This will temporarily slow down the next few requests.")) return;
    setClearing(true);
    setResult(null);
    try {
      const res = await adminApi.clearCache();
      setResult({ type: "success", message: res.message });
    } catch (e: any) {
      setResult({ type: "error", message: e.message ?? "Failed to clear cache" });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cache & System"
        description="Clear server caches and view system information."
        actions={
          <button
            onClick={clearAll}
            disabled={clearing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-red-500 to-brand-dark text-white text-sm font-bold shadow-brand hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {clearing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            {clearing ? "Clearing…" : "Clear All Caches"}
          </button>
        }
      />

      {result && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
            result.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {result.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {result.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-ink-2 text-sm">Loading system info…</div>
      ) : status ? (
        <>
          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard
              icon={<Database size={18} className="text-blue-600" />}
              label="Cache Driver"
              value={status.cache_driver}
            />
            <InfoCard
              icon={<Server size={18} className="text-emerald-600" />}
              label="Queue Driver"
              value={status.queue_driver}
            />
            <InfoCard
              icon={<HardDrive size={18} className="text-purple-600" />}
              label="Disk Free"
              value={`${status.disk_free_mb} MB / ${status.disk_total_mb} MB`}
            />
            <InfoCard
              icon={<Cpu size={18} className="text-orange-600" />}
              label="PHP Version"
              value={status.php_version}
            />
          </div>

          {/* System details */}
          <Card>
            <CardBody className="p-6">
              <h3 className="text-sm font-bold text-ink mb-4">System Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Row label="Laravel Version" value={status.laravel_version} />
                <Row label="PHP Version" value={status.php_version} />
                <Row label="Cache Driver" value={status.cache_driver} />
                <Row label="Queue Driver" value={status.queue_driver} />
                <Row label="Memory Limit" value={status.memory_limit} />
                <Row label="Upload Max Filesize" value={status.upload_max_filesize} />
                <Row label="Disk Free" value={`${status.disk_free_mb} MB`} />
                <Row label="Disk Total" value={`${status.disk_total_mb} MB`} />
              </div>
            </CardBody>
          </Card>

          {/* What gets cleared */}
          <Card>
            <CardBody className="p-6">
              <h3 className="text-sm font-bold text-ink mb-3">What gets cleared</h3>
              <ul className="space-y-2 text-sm text-ink-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  Application cache (tags, queries, sessions)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  Configuration cache
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  Route cache
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  Compiled views
                </li>
                <li className="flex items-center gap-2">
                  <RefreshCw size={14} className="text-blue-500 shrink-0" />
                  Config and route caches are rebuilt after clearing
                </li>
              </ul>
            </CardBody>
          </Card>
        </>
      ) : (
        <div className="text-center py-12 text-ink-2 text-sm">Could not load system info.</div>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardBody className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-[11px] text-ink-2 font-medium">{label}</p>
          <p className="text-sm font-bold text-ink capitalize">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border-soft last:border-0">
      <span className="text-ink-2">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
