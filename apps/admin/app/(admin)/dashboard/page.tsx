"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { DashboardMetrics, QueueStatus } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Users,
  FileCheck2,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  ReferenceLine,
} from "recharts";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [queue, setQueue] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Recharts' ResponsiveContainer measures via ResizeObserver on mount, which can
  // race the CSS grid's layout pass and catch a 0/near-0 width. Deferring the
  // chart's first render by a tick guarantees grid layout has already settled.
  const [chartReady, setChartReady] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [metricsRes, queueRes] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getQueueStatus(),
      ]);
      setMetrics(metricsRes.metrics);
      setQueue(queueRes.queue);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setChartReady(true), 50);
    return () => clearTimeout(id);
  }, []);

  const todayKey = new Date().toISOString().split("T")[0];
  const signupsToday = metrics?.signups_last_30_days[todayKey] ?? 0;

  const signupSeries = metrics
    ? Object.entries(metrics.signups_last_30_days)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({
          date: new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          signups: count,
        }))
    : [];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live overview of users, jobs, and queue health"
        actions={
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-2 hover:text-brand transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Refresh metrics"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      <main className="flex-1 px-6 pb-6 space-y-6">
        {error && (
          <div role="alert" className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            <XCircle size={16} className="shrink-0" aria-hidden="true" /> {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <StatCard
            label="Total users"
            value={metrics?.total_users}
            icon={<Users size={20} className="text-white" />}
            gradient="from-sky-400 to-blue-600"
            loading={loading}
          />
          <StatCard
            label="Jobs today"
            value={metrics?.jobs_today}
            icon={<FileCheck2 size={20} className="text-white" />}
            gradient="from-emerald-400 to-emerald-600"
            loading={loading}
          />
          <StatCard
            label="Failed today"
            value={metrics?.failed_jobs_today}
            icon={<XCircle size={20} className="text-white" />}
            gradient="from-red-400 to-red-600"
            loading={loading}
          />
          <StatCard
            label="Completed today"
            value={metrics?.completed_jobs_today}
            icon={<FileCheck2 size={20} className="text-white" />}
            gradient="from-amber-400 to-orange-500"
            loading={loading}
          />
          <StatCard
            label="Signups today"
            value={signupsToday}
            icon={<TrendingUp size={20} className="text-white" />}
            gradient="from-violet-400 to-purple-600"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Signups chart — modern gradient bar chart with glassmorphism */}
          <Card className="lg:col-span-2 min-w-0">
            <CardBody className="pb-4">
              <div className="relative rounded-2xl overflow-hidden">
                {/* Background gradient — purple-blue, feels positive not alarming */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
                {/* Decorative mesh pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />
                {/* Content */}
                <div className="relative p-5 pb-3">
                  {loading || !chartReady ? (
                    <div className="h-44 bg-white/10 rounded-xl animate-pulse" />
                  ) : signupSeries.length === 0 ? (
                    <div className="h-44 flex items-center justify-center text-white/70 text-sm font-medium">No signups yet</div>
                  ) : (
                    <div className="h-44 min-w-0">
                      <ResponsiveContainer width="100%" height="100%" debounce={1}>
                        <BarChart data={signupSeries} margin={{ top: 20, right: 8, left: -20, bottom: 0 }} barCategoryGap="25%">
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                              <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                            </linearGradient>
                            <filter id="barShadow">
                              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.2)" />
                            </filter>
                          </defs>
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.75)", fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            dy={8}
                          />
                          <YAxis
                            hide
                            domain={[0, (max: number) => Math.max(max + 1, 2)]}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.12)", radius: 8 }}
                            contentStyle={{
                              background: 'rgba(255,255,255,0.98)',
                              border: 'none',
                              borderRadius: 12,
                              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                              padding: '10px 14px',
                              backdropFilter: 'blur(10px)'
                            }}
                            labelStyle={{ color: "#1a2035", fontWeight: 700, marginBottom: 4 }}
                            itemStyle={{ color: "#7c3aed", fontWeight: 600 }}
                            formatter={(value: number) => [`${value} user${value !== 1 ? 's' : ''}`, 'Signups']}
                          />
                          <Bar
                            dataKey="signups"
                            fill="url(#barGradient)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={36}
                            filter="url(#barShadow)"
                          >
                            <LabelList
                              dataKey="signups"
                              position="top"
                              style={{ fill: "rgba(255,255,255,0.95)", fontSize: 12, fontWeight: 700 }}
                              dy={-4}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 px-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <TrendingUp size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">New signups</p>
                      <p className="text-xs text-ink-2">Last 30 days</p>
                    </div>
                  </div>
                  {signupSeries.length > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-ink-2">Total</p>
                      <p className="text-lg font-bold text-ink tabular-nums">
                        {signupSeries.reduce((sum, d) => sum + d.signups, 0).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Queue status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 normal-case text-sm text-ink font-semibold tracking-normal">
                <Clock size={15} className="text-ink-2" />
                Live Queue Status
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 bg-slate-50 rounded-lg animate-pulse" />
                ))
              ) : (
                <>
                  <QueueStat label="Pending" value={queue?.pending ?? 0} color="amber" />
                  <QueueStat label="Processing" value={queue?.processing ?? 0} color="blue" />
                  <QueueStat label="Failed" value={queue?.failed ?? 0} color="red" />
                </>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Jobs by status */}
        {metrics && (
          <Card>
            <CardHeader>
              <CardTitle className="normal-case text-sm text-ink font-semibold tracking-normal">
                All-time Jobs by Status
              </CardTitle>
            </CardHeader>
            <CardBody className="flex gap-3 flex-wrap">
              {Object.entries(metrics.jobs_by_status).map(([status, count]) => (
                <StatusBadge key={status} status={status} count={count} />
              ))}
              {Object.keys(metrics.jobs_by_status).length === 0 && (
                <p className="text-sm text-ink-2">No jobs yet</p>
              )}
            </CardBody>
          </Card>
        )}
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  gradient,
  loading,
}: {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  gradient: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardBody className="p-5 flex items-center gap-4">
        <div className={`h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br ${gradient} shadow-soft flex items-center justify-center`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink-2 uppercase tracking-wide truncate">{label}</p>
          {loading ? (
            <div className="h-7 bg-slate-100 rounded animate-pulse w-14 mt-1" />
          ) : (
            <p className="text-2xl font-bold tabular-nums text-ink">
              {(value ?? 0).toLocaleString()}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function QueueStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "amber" | "blue" | "red";
}) {
  const colorMap = {
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded-xl p-3.5 flex items-center justify-between ${colorMap[color]}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-lg font-bold tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

function StatusBadge({ status, count }: { status: string; count: number }) {
  const colorMap: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    processing: "bg-sky-50 text-sky-700",
    completed: "bg-emerald-50 text-emerald-700",
    failed: "bg-red-50 text-red-700",
  };
  const cls = colorMap[status] ?? "bg-slate-100 text-ink-2";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${cls}`}>
      {status}
      <span className="font-bold tabular-nums">{count.toLocaleString()}</span>
    </span>
  );
}
