'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Search, Trash2, X, Filter } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useStore } from '@/shared/model/store'
import type { Message, Platform, Tone } from '@/entities/platform/types'

function groupByDate(
  messages: Message[],
  todayLabel: string,
  yesterdayLabel: string,
  locale: string
): { label: string; items: Message[] }[] {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const fmt = (d: Date) =>
    d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()

  const map = new Map<string, Message[]>()

  for (const msg of messages) {
    const d = new Date(msg.timestamp)
    const label = isSameDay(d, today)
      ? todayLabel
      : isSameDay(d, yesterday)
        ? yesterdayLabel
        : fmt(d)
    if (!map.has(label)) map.set(label, [])
    map.get(label)!.push(msg)
  }

  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}

const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  telegram: 'Telegram',
}

export function HistoryPanel() {
  const { messages, clearMessages } = useStore()
  const [query, setQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null)
  const [toneFilter, setToneFilter] = useState<Tone | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const t = useTranslations('history')
  const tc = useTranslations('chat')
  const locale = useLocale()

  const hasActiveFilters = !!platformFilter || !!toneFilter

  const TONE_LABELS: Record<Tone, string> = {
    professional: tc('tonesShort.professional'),
    casual: tc('tonesShort.casual'),
    humorous: tc('tonesShort.humorous'),
    inspirational: tc('tonesShort.inspirational'),
    bold: tc('tonesShort.bold'),
  }

  const filtered = useMemo(() => {
    let result = messages
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((m) => m.content.toLowerCase().includes(q))
    }
    if (platformFilter) {
      result = result.filter((m) => m.platform === platformFilter)
    }
    if (toneFilter) {
      result = result.filter((m) => m.tone === toneFilter)
    }
    return result
  }, [messages, query, platformFilter, toneFilter])

  const groups = useMemo(
    () => groupByDate(filtered, t('today'), t('yesterday'), locale),
    [filtered, t, locale]
  )

  return (
    <section>
      <div className="flex items-center justify-between px-1 mb-2">
        <label className="text-slate-500 text-[10px] uppercase tracking-widest flex items-center gap-1.5">
          <History className="w-3 h-3" />
          {t('label')}
        </label>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-[10px] text-slate-600 hover:text-red-400 transition-colors"
          >
            {t('clear')}
          </button>
        )}
      </div>

      {messages.length > 0 && (
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search')}
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

      {messages.length > 0 && (
        <div className="flex items-center gap-1 mb-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${
              hasActiveFilters
                ? 'bg-violet-500/20 text-violet-400'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <Filter className="w-3 h-3" />
            {t('filters')}
          </button>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setPlatformFilter(null)
                setToneFilter(null)
              }}
              className="text-[10px] text-slate-600 hover:text-slate-400 px-1"
            >
              {t('reset')}
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {showFilters && messages.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-2"
          >
            <div className="space-y-1.5 p-2 bg-[#12121e] border border-[#2a2a3f] rounded-lg">
              <div className="flex flex-wrap gap-1">
                {(Object.entries(PLATFORM_LABELS) as [Platform, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setPlatformFilter(platformFilter === id ? null : id)}
                    className={`px-2 py-0.5 rounded-md text-[10px] transition-all ${
                      platformFilter === id
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'text-slate-600 hover:text-slate-400 bg-[#1e1e2e]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {(Object.entries(TONE_LABELS) as [Tone, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setToneFilter(toneFilter === id ? null : id)}
                    className={`px-2 py-0.5 rounded-md text-[10px] transition-all ${
                      toneFilter === id
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-slate-600 hover:text-slate-400 bg-[#1e1e2e]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.length === 0 ? (
        <p className="text-slate-600 text-[11px] px-3 py-2">{t('empty')}</p>
      ) : groups.length === 0 ? (
        <p className="text-slate-600 text-[11px] px-3 py-2">{t('notFound')}</p>
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
                      {msg.role === 'user' ? t('roleUser') : t('roleAi')}
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
