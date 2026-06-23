'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Square } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PLATFORMS } from '@/entities/platform/constants'
import { useBulkGenerate } from '@/features/post-generation/hooks/useBulkGenerate'
import { BulkResultCard } from '@/features/post-generation/ui/BulkResultCard'
import type { Platform } from '@/entities/platform/types'

const ALL_PLATFORMS = PLATFORMS.map((p) => p.id) as Platform[]

export function BulkGenerationView() {
  const [prompt, setPrompt] = useState('')
  const [selected, setSelected] = useState<Platform[]>(ALL_PLATFORMS)
  const { results, isRunning, generate, stop, reset } = useBulkGenerate()
  const t = useTranslations('bulk')

  const hasResults = Object.keys(results).length > 0

  const togglePlatform = (id: Platform) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || selected.length === 0) return
    reset()
    await generate(prompt, selected)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Input area */}
      <div className="p-4 border-b border-[#1e1e2e] flex-shrink-0">
        <textarea
          data-testid="bulk-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('placeholder')}
          rows={3}
          className="w-full bg-[#12121e] border border-[#2a2a3f] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-all"
        />

        {/* Platform checkboxes */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {PLATFORMS.map(({ id, name, icon: Icon, color }) => (
            <button
              key={id}
              data-testid={`bulk-platform-${id}`}
              onClick={() => togglePlatform(id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all border ${
                selected.includes(id)
                  ? 'text-white border-transparent'
                  : 'text-slate-500 border-[#2a2a3f] hover:border-slate-600'
              }`}
              style={
                selected.includes(id)
                  ? { backgroundColor: `${color}25`, borderColor: `${color}50`, color }
                  : {}
              }
            >
              <Icon className="w-3 h-3" />
              {name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            data-testid="bulk-generate-button"
            onClick={isRunning ? stop : handleGenerate}
            disabled={!isRunning && (!prompt.trim() || selected.length === 0)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              isRunning
                ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                : 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-blue-500'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4" /> {t('stop')}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> {t('generate', { count: selected.length })}
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Results grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {hasResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3"
            >
              {(
                Object.entries(results) as [Platform, NonNullable<(typeof results)[Platform]>][]
              ).map(([platform, result]) => (
                <BulkResultCard key={platform} platform={platform} result={result} />
              ))}
            </motion.div>
          )}
          {!hasResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="flex flex-col items-center justify-center h-48 text-slate-600 text-sm"
            >
              <Zap className="w-8 h-8 mb-3 opacity-30" />
              {t('emptyHint')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
