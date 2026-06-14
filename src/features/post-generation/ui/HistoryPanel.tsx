'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Search, Trash2, X } from 'lucide-react'
import { useStore } from '@/shared/model/store'
import type { Message } from '@/entities/platform/types'

function groupByDate(messages: Message[]): { label: string; items: Message[] }[] {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const fmt = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()

  const map = new Map<string, Message[]>()

  for (const msg of messages) {
    const d = new Date(msg.timestamp)
    const label = isSameDay(d, today) ? 'Сегодня' : isSameDay(d, yesterday) ? 'Вчера' : fmt(d)
    if (!map.has(label)) map.set(label, [])
    map.get(label)!.push(msg)
  }

  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}

export function HistoryPanel() {
  const { messages, clearMessages } = useStore()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return messages
    const q = query.toLowerCase()
    return messages.filter((m) => m.content.toLowerCase().includes(q))
  }, [messages, query])

  const groups = useMemo(() => groupByDate(filtered), [filtered])

  return (
    <section>
      <div className="flex items-center justify-between px-1 mb-2">
        <label className="text-slate-500 text-[10px] uppercase tracking-widest flex items-center gap-1.5">
          <History className="w-3 h-3" />
          История
        </label>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-[10px] text-slate-600 hover:text-red-400 transition-colors"
          >
            очистить
          </button>
        )}
      </div>

      {messages.length > 0 && (
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск..."
            className="w-full bg-[#12121e] border border-[#2a2a3f] text-slate-300 placeholder-slate-600 text-[11px] rounded-lg pl-7 pr-7 py-1.5 focus:outline-none focus:border-violet-500/40 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {messages.length === 0 ? (
        <p className="text-slate-600 text-[11px] px-3 py-2">История пуста</p>
      ) : groups.length === 0 ? (
        <p className="text-slate-600 text-[11px] px-3 py-2">Ничего не найдено</p>
      ) : (
        <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a2a3f] scrollbar-track-transparent pr-1">
          <AnimatePresence initial={false}>
            {groups.map(({ label, items }) => (
              <div key={label}>
                <div className="text-[9px] text-slate-600 uppercase tracking-widest px-1 mb-1">
                  {label}
                </div>
                {items.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    className="group flex items-start gap-1.5 px-2 py-1 rounded-lg hover:bg-[#1a1a2e] transition-all"
                  >
                    <span
                      className={`text-[9px] mt-0.5 flex-shrink-0 ${msg.role === 'user' ? 'text-violet-500' : 'text-slate-600'}`}
                    >
                      {msg.role === 'user' ? 'ты' : 'ai'}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-2 flex-1 leading-relaxed">
                      {msg.content}
                    </span>
                    <button
                      onClick={() => {
                        useStore.setState((s) => ({
                          messages: s.messages.filter((m) => m.id !== msg.id),
                        }))
                      }}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-600 hover:text-red-400"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
