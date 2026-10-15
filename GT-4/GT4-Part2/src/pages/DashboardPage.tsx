import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { fetchItems } from '../api/client'
import type { LostFoundItem } from '../types/index'
import useAuthStore from '../store/authStore'

function DashboardPage() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const itemsQuery = useQuery<LostFoundItem[]>({ queryKey: ['items'], queryFn: fetchItems })

  if (itemsQuery.isPending) {
    return <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">Loading dashboard...</div>
  }

  if (itemsQuery.isError) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">Could not load your items. Please log in again and retry.</p>
  }

  const items = itemsQuery.data

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Your lost-and-found items.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Items</p>
          <p className="mt-2 text-2xl font-bold">{items.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Session</p>
          <p className="mt-2 text-sm font-semibold">{token === null ? 'Logged out' : 'Logged in'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate('/items')}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Browse Items
        </button>
      </div>
    </section>
  )
}

export default DashboardPage