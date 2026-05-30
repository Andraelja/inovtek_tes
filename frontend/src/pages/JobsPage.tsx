import { useEffect, useMemo, useState } from 'react'
import { createJobApi, listJobsApi, type Job } from '../api/jobs'
import { useAuth } from '../state/auth'

export default function JobsPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'open' | 'closed' | ''>('')

  const [openModal, setOpenModal] = useState(false)
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('Engineering')
  const [newStatus, setNewStatus] = useState<'open' | 'closed'>('open')
  const [creating, setCreating] = useState(false)

  async function load() {
    if (!token) return
    setLoading(true)
    setErr(null)
    try {
      const res = await listJobsApi(token, { search, status })
      setJobs(res)
    } catch (e: any) {
      setErr(e?.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const canSearch = useMemo(() => search.trim().length > 0 || status !== '', [search, status])

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Management</h1>
          <p className="mt-1 text-sm text-slate-600">Kelola lowongan, cari, dan filter status.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-white font-semibold hover:bg-slate-800"
          >
            + Add New Job
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto]">
          <div>
            <label className="text-xs font-semibold text-slate-600">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or department"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Filter Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 bg-white"
            >
              <option value="">All</option>
              <option value="open">open</option>
              <option value="closed">closed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              disabled={!canSearch}
              onClick={load}
              className="w-full rounded-xl bg-slate-700 px-4 py-2.5 text-white font-semibold hover:bg-slate-600 disabled:opacity-60"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {err && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{err}</div>}

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold text-slate-600">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-500" colSpan={4}>Loading...</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-500" colSpan={4}>No jobs found.</td>
                </tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium">{j.title}</td>
                    <td className="px-4 py-3 text-slate-700">{j.department || '—'}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={j.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{formatDate(j.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-md p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-bold">Add New Job</div>
                <div className="mt-1 text-sm text-slate-600">Membuat job baru untuk dashboard demo.</div>
              </div>
              <button className="text-slate-500 hover:text-slate-700" onClick={() => setOpenModal(false)}>
                ✕
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
                  placeholder="e.g. Mobile Engineer"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Department</label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
                  placeholder="Engineering"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 bg-white"
                >
                  <option value="open">open</option>
                  <option value="closed">closed</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-end">
              <button
                className="rounded-xl px-4 py-2.5 border border-slate-200 hover:bg-slate-50"
                onClick={() => setOpenModal(false)}
                disabled={creating}
              >
                Cancel
              </button>
              <button
                disabled={creating || title.trim().length < 2}
                onClick={async () => {
                  if (!token) return
                  setCreating(true)
                  try {
                    await createJobApi(token, { title: title.trim(), department: department.trim() || undefined, status: newStatus })
                    setOpenModal(false)
                    setTitle('')
                    await load()
                  } catch (e: any) {
                    setErr(e?.message || 'Failed to create job')
                  } finally {
                    setCreating(false)
                  }
                }}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusPill({ status }: { status: 'open' | 'closed' }) {
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold'
  if (status === 'open') return <span className={base + ' bg-emerald-50 text-emerald-700 border border-emerald-200'}>open</span>
  return <span className={base + ' bg-slate-100 text-slate-700 border border-slate-200'}>closed</span>
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: '2-digit' })
  } catch {
    return iso
  }
}

