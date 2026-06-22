'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/shared/model/store'
import { PLATFORM_COLORS } from '@/entities/platform/constants'

function AnimatedCounter({ value, duration = 600 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const start = prevRef.current
    const diff = value - start
    if (diff === 0) return

    const startTime = performance.now()
    let rafId: number

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + diff * eased))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        prevRef.current = value
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [value, duration])

  return <>{display.toLocaleString()}</>
}

function StatCard({ label, value, gradient }: { label: string; value: number; gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#12121e] border border-[#2a2a3f] rounded-xl p-4"
    >
      <div className="text-slate-500 text-xs mb-1">{label}</div>
      <div className={`text-2xl font-bold bg-clip-text text-transparent ${gradient}`}>
        <AnimatedCounter value={value} />
      </div>
    </motion.div>
  )
}

function BarSection({
  title,
  data,
  colorMap,
  labelMap,
}: {
  title: string
  data: Record<string, number>
  colorMap?: Record<string, string>
  labelMap?: (key: string) => string
}) {
  const max = Math.max(...Object.values(data), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#12121e] border border-[#2a2a3f] rounded-xl p-4"
    >
      <div className="text-slate-500 text-xs mb-3">{title}</div>
      <div className="space-y-2">
        {Object.entries(data).map(([key, count]) => {
          const pct = (count / max) * 100
          const color = colorMap?.[key] ?? '#7c3aed'
          const label = labelMap ? labelMap(key) : key

          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 w-20 truncate capitalize">{label}</span>
              <div className="flex-1 h-5 bg-[#1e1e2e] rounded-md overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-md"
                  style={{ backgroundColor: `${color}40` }}
                />
                <span
                  className="absolute right-2 top-0 h-full flex items-center text-[10px] font-medium"
                  style={{ color }}
                >
                  {count}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

const MODEL_COLORS: Record<string, string> = {
  'claude-haiku-4-5': '#22c55e',
  'claude-sonnet-4-6': '#3b82f6',
  'claude-opus-4-8': '#a855f7',
}

const MODEL_LABELS: Record<string, string> = {
  'claude-haiku-4-5': 'Haiku',
  'claude-sonnet-4-6': 'Sonnet',
  'claude-opus-4-8': 'Opus',
}

export function AnalyticsDashboard() {
  const { totalGenerations, byPlatform, byTone, byModel, totalTokensEstimate, resetAnalytics } =
    useStore()
  const t = useTranslations('analytics')
  const tTones = useTranslations('tones')

  if (totalGenerations === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/20 flex items-center justify-center mb-4">
          <BarChart2 className="w-7 h-7 text-violet-400" />
        </div>
        <h2 className="text-white font-semibold mb-2">{t('title')}</h2>
        <p className="text-slate-500 text-sm max-w-xs">{t('noData')}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#2a2a3f] scrollbar-track-transparent">
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label={t('totalGenerations')}
          value={totalGenerations}
          gradient="bg-gradient-to-r from-violet-400 to-blue-400"
        />
        <StatCard
          label={t('tokensEstimate')}
          value={totalTokensEstimate}
          gradient="bg-gradient-to-r from-blue-400 to-cyan-400"
        />
      </div>

      <BarSection title={t('byPlatform')} data={byPlatform} colorMap={PLATFORM_COLORS} />

      <BarSection title={t('byTone')} data={byTone} labelMap={(key) => tTones(key)} />

      <BarSection
        title={t('byModel')}
        data={byModel}
        colorMap={MODEL_COLORS}
        labelMap={(key) => MODEL_LABELS[key] ?? key}
      />

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={resetAnalytics}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <Trash2 className="w-3 h-3" />
        {t('reset')}
      </motion.button>
    </div>
  )
}
