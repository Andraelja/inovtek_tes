export default function StatCard({
  title,
  value,
  loading
}: {
  title: string
  value: number
  loading: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-600">{title}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">
        {loading ? <span className="text-slate-400">—</span> : value}
      </div>
    </div>
  )
}

