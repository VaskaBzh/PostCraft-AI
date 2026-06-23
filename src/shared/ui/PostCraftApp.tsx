'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MessageSquare, Layers, BarChart2, FlaskConical } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ChatInterface } from '@/features/post-generation/ui/ChatInterface'
import { NetworkStatus } from './NetworkStatus'

const Sidebar = dynamic(() => import('./Sidebar').then((m) => ({ default: m.Sidebar })), {
  loading: () => (
    <div className="w-64 flex-shrink-0 bg-[#0e0e1a] border-r border-[#1e1e2e] animate-pulse" />
  ),
})

const BulkGenerationView = dynamic(
  () =>
    import('@/features/post-generation/ui/BulkGenerationView').then((m) => ({
      default: m.BulkGenerationView,
    })),
  {
    loading: () => (
      <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
        Loading...
      </div>
    ),
  }
)

const VariantComparison = dynamic(
  () =>
    import('@/features/post-generation/ui/VariantComparison').then((m) => ({
      default: m.VariantComparison,
    })),
  {
    loading: () => (
      <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
        Loading...
      </div>
    ),
  }
)

const AnalyticsDashboard = dynamic(
  () =>
    import('@/features/analytics/ui/AnalyticsDashboard').then((m) => ({
      default: m.AnalyticsDashboard,
    })),
  {
    loading: () => (
      <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
        Loading...
      </div>
    ),
  }
)

type Mode = 'chat' | 'bulk' | 'variants' | 'analytics'

export function PostCraftApp() {
  const [mode, setMode] = useState<Mode>('chat')
  const t = useTranslations('modes')

  const modes = [
    { id: 'chat' as Mode, label: t('chat'), icon: MessageSquare },
    { id: 'bulk' as Mode, label: t('bulk'), icon: Layers },
    { id: 'variants' as Mode, label: t('variants'), icon: FlaskConical },
    { id: 'analytics' as Mode, label: t('analytics'), icon: BarChart2 },
  ]

  return (
    <div className="h-screen bg-[#080810] flex overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <NetworkStatus />
        {/* Mode switcher */}
        <div className="flex-shrink-0 flex items-center gap-1 px-4 pt-3 pb-0">
          {modes.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              data-testid={`mode-${id}`}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                mode === id
                  ? 'bg-violet-600/20 text-violet-300 font-medium'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1a2e]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </motion.button>
          ))}
        </div>

        {mode === 'chat' && <ChatInterface />}
        {mode === 'bulk' && <BulkGenerationView />}
        {mode === 'variants' && <VariantComparison />}
        {mode === 'analytics' && <AnalyticsDashboard />}
      </main>
    </div>
  )
}
