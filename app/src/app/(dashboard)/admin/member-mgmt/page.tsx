'use client'

import { useState } from 'react'
import {
  UserPlus,
  Users,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  Copy,
} from 'lucide-react'

interface Member {
  id: string
  name: string
  loginId: string
  role: 'field' | 'admin' | 'office'
  status: 'active' | 'inactive'
  createdAt: string
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  field: { label: '現場用', color: 'bg-gold-500/10 text-gold-500' },
  admin: { label: '管理者', color: 'bg-emerald-400/10 text-emerald-400' },
  office: { label: '事務用', color: 'bg-blue-400/10 text-blue-400' },
}

const MOCK_MEMBERS: Member[] = [
  { id: 'u1', name: '田中太郎', loginId: 'tanaka', role: 'field', status: 'active', createdAt: '2026-01-15' },
  { id: 'u2', name: '佐藤花子', loginId: 'sato', role: 'field', status: 'active', createdAt: '2026-01-20' },
  { id: 'u3', name: '管理者', loginId: 'admin', role: 'admin', status: 'active', createdAt: '2026-01-01' },
  { id: 'u5', name: '事務 鈴木', loginId: 'jimu', role: 'office', status: 'active', createdAt: '2026-02-01' },
  { id: 'u6', name: '山田健一', loginId: 'yamada', role: 'field', status: 'active', createdAt: '2026-02-10' },
  { id: 'u7', name: '鈴木美咲', loginId: 'suzuki_m', role: 'field', status: 'active', createdAt: '2026-02-15' },
  { id: 'u8', name: '高橋翔太', loginId: 'takahashi', role: 'field', status: 'inactive', createdAt: '2026-03-01' },
]

export default function MemberMgmtPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLoginId, setNewLoginId] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<'field' | 'admin' | 'office'>('field')
  const [showPassword, setShowPassword] = useState(false)
  const [addedMsg, setAddedMsg] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newLoginId || !newPassword) return
    setAddedMsg(`${newName}（${newLoginId}）を追加しました`)
    setNewName('')
    setNewLoginId('')
    setNewPassword('')
    setShowAddForm(false)
    setTimeout(() => setAddedMsg(''), 3000)
  }

  return (
    <div className="min-h-0 h-[calc(100vh-64px)] overflow-y-auto bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <UserPlus className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">メンバー管理</h1>
            <p className="text-sm text-muted">メンバーの追加・ID/パスワード管理・権限設定</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          メンバー追加
        </button>
      </div>

      {addedMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-400/10 border border-emerald-400/30 px-4 py-3 mb-4 text-sm text-emerald-400">
          <CheckCircle2 className="w-4 h-4" /> {addedMsg}
        </div>
      )}

      {/* Add Member Form */}
      {showAddForm && (
        <div className="rounded-2xl border border-gold-500/30 bg-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">新規メンバー追加</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-graphite-300 mb-1.5">名前</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="例: 山田太郎"
                  className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite-300 mb-1.5">ログインID</label>
                <input type="text" value={newLoginId} onChange={(e) => setNewLoginId(e.target.value)} placeholder="例: yamada"
                  className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite-300 mb-1.5">パスワード</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="パスワード"
                    className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400 hover:text-foreground">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite-300 mb-1.5">権限</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as 'field' | 'admin' | 'office')}
                  className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors">
                  <option value="field">現場用</option>
                  <option value="admin">管理者</option>
                  <option value="office">事務用</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors">
                <CheckCircle2 className="w-4 h-4" /> 追加
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="rounded-lg border border-border px-5 py-2.5 text-sm text-graphite-300 hover:bg-graphite-800 transition-colors">
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Users className="w-5 h-5 text-gold-500" />
          <h2 className="text-base font-semibold text-foreground">メンバー一覧</h2>
          <span className="ml-auto text-xs text-graphite-400">{MOCK_MEMBERS.length}名</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-graphite-900/50">
                <th className="text-left text-xs font-semibold text-graphite-400 px-6 py-3">名前</th>
                <th className="text-left text-xs font-semibold text-graphite-400 px-6 py-3">ログインID</th>
                <th className="text-left text-xs font-semibold text-graphite-400 px-6 py-3">権限</th>
                <th className="text-left text-xs font-semibold text-graphite-400 px-6 py-3">ステータス</th>
                <th className="text-left text-xs font-semibold text-graphite-400 px-6 py-3">作成日</th>
                <th className="text-right text-xs font-semibold text-graphite-400 px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MEMBERS.map((member) => {
                const roleStyle = ROLE_LABELS[member.role]
                return (
                  <tr key={member.id} className="border-b border-border last:border-0 hover:bg-graphite-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-graphite-700 flex items-center justify-center text-xs font-bold text-graphite-300">
                          {member.name[0]}
                        </div>
                        <span className="text-sm font-medium text-foreground">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-graphite-300 bg-graphite-800 px-2 py-0.5 rounded">{member.loginId}</code>
                        <button className="text-graphite-500 hover:text-gold-500 transition-colors"><Copy size={12} /></button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleStyle.color}`}>
                        {roleStyle.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 text-xs ${member.status === 'active' ? 'text-emerald-400' : 'text-graphite-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-400' : 'bg-graphite-600'}`} />
                        {member.status === 'active' ? '有効' : '無効'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-graphite-400">{member.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-md text-graphite-400 hover:text-gold-500 hover:bg-graphite-800 transition-colors"><Edit3 size={14} /></button>
                        <button className="p-1.5 rounded-md text-graphite-400 hover:text-gold-500 hover:bg-graphite-800 transition-colors"><Shield size={14} /></button>
                        <button className="p-1.5 rounded-md text-graphite-400 hover:text-red-400 hover:bg-graphite-800 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
