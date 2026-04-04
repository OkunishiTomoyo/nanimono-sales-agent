'use client'

import { useState } from 'react'
import { FileAudio, Upload, Mic, FileText, Clock, CheckCircle2, Trash2, Play, BookOpen } from 'lucide-react'

interface DataItem { id: string; name: string; type: '録音' | '議事録' | '日報'; date: string; duration?: string; status: 'processing' | 'done' }

const MOCK_ITEMS: DataItem[] = [
  { id: '1', name: 'A社初回商談_田中.mp3', type: '録音', date: '2026-04-03', duration: '32:15', status: 'done' },
  { id: '2', name: 'B社クロージング_佐藤.wav', type: '録音', date: '2026-04-02', duration: '45:30', status: 'done' },
  { id: '3', name: 'C社ヒアリング議事録.docx', type: '議事録', date: '2026-04-02', status: 'done' },
  { id: '4', name: 'D社提案商談_山田.m4a', type: '録音', date: '2026-04-01', duration: '28:45', status: 'processing' },
  { id: '5', name: '2026年3月度 日報一括.csv', type: '日報', date: '2026-04-01', status: 'done' },
]

const TYPE_STYLES = {
  '録音': { color: 'text-purple-400', bg: 'bg-purple-400/10' },
  '議事録': { color: 'text-blue-400', bg: 'bg-blue-400/10' },
  '日報': { color: 'text-gold-500', bg: 'bg-gold-500/10' },
}

export default function InputFieldDataPage() {
  const [uploading, setUploading] = useState(false)

  return (
    <div className="min-h-0 h-[calc(100vh-64px)] overflow-y-auto bg-background p-4 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <FileAudio className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">現場生データ</h1>
            <p className="text-sm text-muted">商談録音・議事録・日報履歴をAIに学習させる</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center hover:border-purple-400/50 transition-colors cursor-pointer"
          onClick={() => { setUploading(true); setTimeout(() => setUploading(false), 2000) }}>
          <Mic className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">商談録音</p>
          <p className="text-xs text-muted mt-1">MP3, WAV, M4A</p>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center hover:border-blue-400/50 transition-colors cursor-pointer">
          <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">商談議事録</p>
          <p className="text-xs text-muted mt-1">DOCX, TXT, PDF</p>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center hover:border-gold-500/50 transition-colors cursor-pointer">
          <BookOpen className="w-8 h-8 text-gold-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">日報履歴</p>
          <p className="text-xs text-muted mt-1">CSV, XLSX</p>
        </div>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 rounded-lg bg-gold-500/10 border border-gold-500/30 px-4 py-3 mb-4 text-sm text-gold-500">
          <Clock className="w-4 h-4 animate-spin" /> アップロード＆文字起こし処理中...
        </div>
      )}

      {/* Data List */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <FileAudio className="w-5 h-5 text-gold-500" />
          <h2 className="text-base font-semibold text-foreground">登録済みデータ</h2>
          <span className="ml-auto text-xs text-graphite-400">{MOCK_ITEMS.length}件</span>
        </div>
        <div className="divide-y divide-border">
          {MOCK_ITEMS.map((item) => {
            const style = TYPE_STYLES[item.type]
            return (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-graphite-800/50 transition-colors">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-graphite-800 shrink-0`}>
                  {item.type === '録音' ? <Mic className={`w-5 h-5 ${style.color}`} /> : <FileText className={`w-5 h-5 ${style.color}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>{item.type}</span>
                    <span className="text-xs text-graphite-400">{item.date}</span>
                    {item.duration && <span className="text-xs text-graphite-500">{item.duration}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'done' ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> 学習済み</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-400"><Clock className="w-3.5 h-3.5 animate-spin" /> 処理中</span>
                  )}
                  {item.type === '録音' && <button className="p-1.5 rounded-md text-graphite-500 hover:text-gold-500 hover:bg-graphite-800 transition-colors"><Play size={14} /></button>}
                  <button className="p-1.5 rounded-md text-graphite-500 hover:text-red-400 hover:bg-graphite-800 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
