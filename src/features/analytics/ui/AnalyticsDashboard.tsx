'use client'

import { motion } from 'framer-motion'
import { BarChart2, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/shared/model/store'
import { PLATFORMS, TONES } from '@/entities/platform/constants'

const MODEL_LABELS: Record<string, string> = {
  'claude-haiku-4-5': 'Haiku 4.5',
  'claude-sonnet-4-6': 'Sonnet 4.6',
  'claude-opus-4-8': 'Opus 4.8',
}

const MODEL_COLORS: Record<string, string> = {
  'claude-haiku-4-5': '#22d3ee',
  'claude-sonnet-4-6': '#a78bfa',
  'claude-opus-4-8': '#f59e0b',
}

export function AnalyticsDashboard() {
  const analytics = useStore((s) => s.analytics)
  const clearAnalytics = useStore((s) => s.clearAnalytics)
  const t = useTranslations('analytics')

  const isEmpty = analytics.totalGenerations === 0

  const platformItems = PLATFORMS.map(({ id, name, color }) => ({
    key: id,
    label: name,
    value: analytics.byPlatform[id] ?? 0,
    color,
  })).filter((d) => d.value > 0)

  const toneItems = TONES.map(({ id, emoji, name }) => ({
    key: id,
    label: `${emoji} ${name}`,
    value: analytics.byTone[id] ?? 0,
    color: '#7c3aed',
  })).filter((d) => d.value > 0)

  const modelItems = Object.entries(analytics.byModel)
    .filter(([, v]) => (v ?? 0) > 0)
    .map(([key, value]) => ({
      key,
      label: MODEL_LABELS[key] ?? key,
      value: value ?? 0,
      color: MODEL_COLORS[key] ?? '#64748b',
    }))

  const maxPlatform = Math.max(...platformItems.map((d) => d.value), 1)
  const maxTone = Math.max(...toneItems.map((d) => d.value), 1)
  const maxModel = Math.max(...modelItems.map((d) => d.value), 1)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e] flex-shrink-0">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-violet-400" />
          <h1 className="text-white font-semibold text-sm">{t('title')}</h1>
        </div>
        {!isEmpty && (
          <button
            onClick={clearAnalytics}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <Trash2 className="w-3 h-3" />
            {t('reset')}
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/20 flex items-center justify-center mb-4">
            <BarChart2 className="w-7 h-7 text-violet-400" />
          </div>
          <p className="text-slate-500 text-sm">{t('empty')}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gradient-to-br from-violet-600/10 to-blue-600/10 border border-violet-500/20 rounded-2xl p-5 text-center">
            <div className="text-5xl font-bold text-white mb-1">{analytics.totalGenerations}</div>
            <div className="text-slate-400 text-sm">{t('total')}</div>
            {analytics.lastGeneratedAt && (
              <div className="text-slate-600 text-[10px] mt-2">
                {t('lastGenerated')}: {new Date(analytics.lastGeneratedAt).toLocaleString()}
              </div>
            )}
          </div>

          {platformItems.length > 0 && (
            <Section title={t('byPlatform')}>
              <BarChart items={platformItems} max={maxPlatform} />
            </Section>
          )}

          {toneItems.length > 0 && (
            <Section title={t('byTone')}>
              <BarChart items={toneItems} max={maxTone} />
            </Section>
          )}

          {modelItems.length > 0 && (
            <Section title={t('byModel')}>
              <BarChart items={modelItems} max={maxModel} />
            </Section>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-slate-500 text-[10px] uppercase tracking-widest mb-3">{title}</h2>
      {children}
    </div>
  )
}

function BarChart({
  items,
  max,
}: {
  items: Array<{ key: string; label: string; value: number; color: string }>
  max: number
}) {
  return (
    <div className="space-y-2">
      {items.map(({ key, label, value, color }) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-28 flex-shrink-0 truncate">{label}</span>
          <div className="flex-1 bg-[#12121e] rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${(value / max) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-slate-500 w-5 text-right flex-shrink-0">{value}</span>
        </div>
      ))}
    </div>
  )
}
