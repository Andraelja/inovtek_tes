import { useEffect, useState } from "react";
import { getDashboardStatsApi } from "../api/dashboard";
import { useAuth } from "../state/auth";

export default function DashboardPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_candidates: 0,
    total_applications: 0,
  });

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setErr(null);
    getDashboardStatsApi(token)
      .then(setStats)
      .catch((e) => setErr(e?.message || "Failed to load stats"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Ringkasan recruitment campaign Anda.
          </p>
        </div>
      </div>

      {err && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Jobs"
          value={stats.total_jobs}
          loading={loading}
        />
        <StatCard
          title="Total Candidates"
          value={stats.total_candidates}
          loading={loading}
        />
        <StatCard
          title="Total Applications"
          value={stats.total_applications}
          loading={loading}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-800">
              Pipeline Overview
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Lihat applied → interview → hired di menu Pipeline.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  loading,
}: {
  title: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-600">{title}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">
        {loading ? <span className="text-slate-400">—</span> : value}
      </div>
    </div>
  );
}
