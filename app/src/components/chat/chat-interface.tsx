'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ChatInterfaceProps = {
  messages: ChatMessage[]
  onSend: (message: string) => void
  placeholder?: string
  disclaimer?: string
  isTyping?: boolean
}

export default function ChatInterface({
  messages,
  onSend,
  placeholder = 'メッセージを入力...',
  disclaimer,
  isTyping = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#7a7a7a] text-sm">
              メッセージを送信して会話を始めましょう
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#2d2d2d] text-[#f2f2f2] rounded-br-md'
                  : 'bg-[#f2f2f2] text-[#1a1a1a] rounded-bl-md border border-[#e0e0e0]'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'assistant' && disclaimer && (
                <p className="mt-3 pt-2 border-t border-[#e0e0e0] text-[10px] text-[#9a9a9a] leading-snug">
                  {disclaimer}
                </p>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#f2f2f2] border border-[#e0e0e0] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#9a9a9a] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#9a9a9a] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#9a9a9a] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-[#e0e0e0] bg-white p-4">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 rounded-xl border border-[#e0e0e0] bg-[#f2f2f2] px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-[#9a9a9a] outline-none transition-colors focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#c8a96e] text-white transition-all hover:bg-[#a8894e] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            aria-label="送信"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
