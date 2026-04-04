'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'

export type UserRole = 'field' | 'admin' | 'office'

export interface Tenant {
  id: string
  name: string
  products: string[]
  channels: string[]
  sharedWith?: string[]
}

export interface User {
  id: string
  name: string
  role: UserRole
  tenantId: string
  salesDnaType?: string // Sales-DNA diagnosis result
}

interface AuthContextType {
  user: User | null
  tenant: Tenant | null
  tenants: Tenant[]
  isLoading: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  switchTenant: (tenantId: string) => void
  setSalesDnaType: (dnaType: string) => void
}

const MOCK_TENANTS: Tenant[] = [
  {
    id: 'agency-a',
    name: 'ABC代理店',
    products: ['UMIDAS', 'CloudSync', 'DataBridge'],
    channels: ['テレアポ', '飛び込み', 'Web反響', '紹介'],
    sharedWith: ['agency-b'],
  },
  {
    id: 'agency-b',
    name: 'XYZ販売',
    products: ['UMIDAS', 'SmartCRM'],
    channels: ['テレアポ', 'セミナー', '紹介'],
    sharedWith: ['agency-a'],
  },
  {
    id: 'agency-c',
    name: 'DEF営業所',
    products: ['EcoSolutions', 'GreenTech'],
    channels: ['飛び込み', '展示会', 'Web反響'],
  },
]

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  tanaka: {
    password: 'pass123',
    user: { id: 'u1', name: '田中太郎', role: 'field', tenantId: 'agency-a', salesDnaType: 'logical' },
  },
  sato: {
    password: 'pass123',
    user: { id: 'u2', name: '佐藤花子', role: 'field', tenantId: 'agency-b', salesDnaType: 'empathy' },
  },
  admin: {
    password: 'admin123',
    user: { id: 'u3', name: '管理者', role: 'admin', tenantId: 'agency-a' },
  },
  manager: {
    password: 'pass123',
    user: { id: 'u4', name: '高橋部長', role: 'admin', tenantId: 'agency-b' },
  },
  jimu: {
    password: 'pass123',
    user: { id: 'u5', name: '事務 鈴木', role: 'office', tenantId: 'agency-a' },
  },
}

const STORAGE_KEY = 'nanimono_auth'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.user && data.tenantId) {
          setUser(data.user)
          setCurrentTenantId(data.tenantId)
        }
      }
    } catch {
      // ignore
    }
    setIsLoading(false)
  }, [])

  const tenant = currentTenantId
    ? MOCK_TENANTS.find((t) => t.id === currentTenantId) ?? null
    : null

  const login = useCallback((username: string, password: string) => {
    const entry = MOCK_USERS[username]
    if (entry && entry.password === password) {
      setUser(entry.user)
      setCurrentTenantId(entry.user.tenantId)
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user: entry.user, tenantId: entry.user.tenantId })
        )
      } catch {
        // ignore
      }
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCurrentTenantId(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  const switchTenant = useCallback(
    (tenantId: string) => {
      if (user?.role === 'admin') {
        setCurrentTenantId(tenantId)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, tenantId }))
        } catch {
          // ignore
        }
      }
    },
    [user]
  )

  const setSalesDnaType = useCallback(
    (dnaType: string) => {
      if (user) {
        const updated = { ...user, salesDnaType: dnaType }
        setUser(updated)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updated, tenantId: currentTenantId }))
        } catch {
          // ignore
        }
      }
    },
    [user, currentTenantId]
  )

  return (
    <AuthContext.Provider
      value={{ user, tenant, tenants: MOCK_TENANTS, isLoading, login, logout, switchTenant, setSalesDnaType }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
