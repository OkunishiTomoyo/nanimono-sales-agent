'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, user, isLoading } = useAuth()

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      window.location.href =
        (process.env.__NEXT_ROUTER_BASEPATH || '') + '/'
    }
  }, [user, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('IDとパスワードを入力してください')
      return
    }

    const success = login(username, password)
    if (success) {
      // Use window.location for reliable navigation in static export
      window.location.href =
        (process.env.__NEXT_ROUTER_BASEPATH || '') + '/'
    } else {
      setError('IDまたはパスワードが正しくありません')
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-graphite-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-widest text-gold-500 mb-2">
            NANIMONO
          </h1>
          <p className="text-sm text-graphite-400">
            AGI Sales Intelligence Platform
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            ログイン
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                ログインID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="IDを入力"
                className="w-full rounded-lg border border-border bg-graphite-800 px-4 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="パスワードを入力"
                  className="w-full rounded-lg border border-border bg-graphite-800 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-graphite-950 hover:bg-gold-400 active:bg-gold-600 transition-colors"
            >
              <LogIn size={18} />
              ログイン
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-graphite-500 mb-3">
              デモアカウント:
            </p>
            <div className="space-y-1.5 text-xs text-graphite-400">
              <p>
                <span className="text-graphite-300">営業:</span> tanaka / pass123
              </p>
              <p>
                <span className="text-graphite-300">営業:</span> sato / pass123
              </p>
              <p>
                <span className="text-graphite-300">管理者:</span> admin / admin123
              </p>
              <p>
                <span className="text-graphite-300">管理者:</span> manager / pass123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
