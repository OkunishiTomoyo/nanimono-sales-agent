'use client'

import { useState } from 'react'
import { Database, Upload, FileText, BookOpen, Target, Trash2, CheckCircle2, Clock, File } from 'lucide-react'

interface UploadedItem { id: string; name: string; type: string; date: string; size: string }

const MOCK_ITEMS: UploadedItem[] = [
  { id: '1', name: 'UMIDAS 製品カタログ v3.2.pdf', type: '営業資料', date: '2026-04-01', size: '4.2 MB' },
  { id: '2', name: 'CloudSync 商材マニュアル.pdf', type: '商材マニュアル', date: '2026-03-28', size: '8.1 MB' },
  { id: '3', name: 'テレアポ基本スクリプト 2026Q2.docx', type: 'スクリプト', date: '2026-03-25', size: '320 KB' },
  { id: '4', name: 'DataBridge 導入ガイド.pdf', type: '商材マニュアル', date: '2026-03-20', size: '5.6 MB' },
  { id: '5', name: '飛び込み営業 反論処理集.docx', type: 'スクリプト', date: '2026-03-15', size: '180 KB' },
]

const CATEGORIES = ['営業資料', '商材マニュアル', 'スクリプト']

export default function InputKnowledgePage() {
  const [uploading, setUploading] = useState(false)

  const handleUpload = () => {
    setUploading(true)
    setTimeout(() => setUploading(false), 2000)
  }

  return (
    <div className="min-h-0 h-[calc(100vh-64px)] overflow-y-auto bg-background p-4 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <Database className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">社内知財インプット</h1>
            <p className="text-sm text-muted">営業資料・商材マニュアル・スクリプトをAIに学習させる</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="rounded-2xl border-2 border-dashed border-border bg-card p-8 mb-6 text-center hover:border-gold-500/50 transition-colors cursor-pointer" onClick={handleUpload}>
        <Upload className="w-10 h-10 text-graphite-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-foreground mb-1">ファイルをドラッグ＆ドロップ</p>
        <p className="text-xs text-muted mb-4">または クリックしてアップロード（PDF, DOCX, PPTX, TXT）</p>
        <div className="flex justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <span key={cat} className="text-xs px-3 py-1 rounded-full bg-graphite-800 text-graphite-300 border border-border">{cat}</span>
          ))}
        </div>
        {uploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gold-500">
            <Clock className="w-4 h-4 animate-spin" /> アップロード中...
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gold-500" />
          <h2 className="text-base font-semibold text-foreground">登録済みファイル</h2>
          <span className="ml-auto text-xs text-graphite-400">{MOCK_ITEMS.length}件</span>
        </div>
        <div className="divide-y divide-border">
          {MOCK_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-graphite-800/50 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-graphite-800 shrink-0">
                <File className="w-5 h-5 text-gold-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500">{item.type}</span>
                  <span className="text-xs text-graphite-400">{item.date}</span>
                  <span className="text-xs text-graphite-500">{item.size}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400">学習済み</span>
              </div>
              <button className="p-1.5 rounded-md text-graphite-500 hover:text-red-400 hover:bg-graphite-800 transition-colors shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
