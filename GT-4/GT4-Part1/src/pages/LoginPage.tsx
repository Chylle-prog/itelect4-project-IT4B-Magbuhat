import { useState } from 'react'
import { useNavigate } from 'react-router'
import useAuthStore from '../store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
        <Button
          type="button"
          onClick={() => navigate('/claims')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Go to Claims Queue
        </Button>
      </section>
    )
  }

  return (
    <section className="max-w-sm space-y-3">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Enter a name to create a demo session token.
      </p>
      <Label htmlFor="login-name">Name</Label>
      <Input
        id="login-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <Button
        type="button"
        onClick={handleLogin}
        disabled={name.trim().length === 0}
      >
        Log In
      </Button>
    </section>
  )
}

export default LoginPage