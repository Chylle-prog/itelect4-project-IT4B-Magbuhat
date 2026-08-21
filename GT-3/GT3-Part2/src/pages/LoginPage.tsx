import { useState } from 'react'
import { useNavigate } from 'react-router'
import useAuthStore from '../store/authStore'

function LoginPage() {
  const [name, setName] = useState<string>('')
  const token = useAuthStore((state) => state.token)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleLogin = (): void => {
    login(name)
    navigate('/claims')
  }

  if (token !== null) {
    return (
      <section className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
        <p>You are already logged in.</p>
        <button
          type="button"
          onClick={() => navigate('/claims')}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Go to Claims Queue
        </button>
      </section>
    )
  }

  return (
    <section className="max-w-sm space-y-3">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Enter a name to create a demo session token.
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
      />
      <button
        type="button"
        onClick={handleLogin}
        disabled={name.trim().length === 0}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        Log In
      </button>
    </section>
  )
}

export default LoginPage