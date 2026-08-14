import { useNavigate } from 'react-router'
import { mockClaims, mockItems, mockUsers } from '../data/mockData'
import useAuthStore from '../store/authStore'

function DashboardPage() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Quick overview of users, items, and claim processing status.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Users</p>
          <p className="mt-2 text-2xl font-bold">{mockUsers.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Items</p>
          <p className="mt-2 text-2xl font-bold">{mockItems.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Claims</p>
          <p className="mt-2 text-2xl font-bold">{mockClaims.length}</p>
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
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          View Users
        </button>
        <button
          type="button"
          onClick={() => navigate('/claims')}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          Open Claims Queue
        </button>
      </div>
    </section>
  )
}

export default DashboardPage