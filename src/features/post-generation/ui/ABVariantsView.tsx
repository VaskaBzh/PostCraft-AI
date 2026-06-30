'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Copy, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  useVariantsGenerate,
  VARIANT_STYLES,
  type VariantStyle,
  type VariantState,
} from '../hooks/useVariantsGenerate'

export function ABVariantsView() {
  const [prompt, setPrompt] = useState('')
  const { variants, isRunning, generate, reset } = useVariantsGenerate()
  const t = useTranslations('variants')

  const hasResults = VARIANT_STYLES.some((s) => variants[s].content || variants[s].isStreaming)

  const handleGenerate = () => {
    if (!prompt.trim() || isRunning) return
    reset()
    generate(prompt)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[#1e1e2e] flex-shrink-0">
        <h2 className="text-white font-semibold text-sm mb-0.5">{t('title')}</h2>
        <p className="text-slate-500 text-xs mb-3">{t('subtitle')}</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate()
          }}
          placeholder={t('placeholder')}
          rows={2}
          className="w-full bg-[#12121e] border border-[#2a2a3f] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-all"
        />
        <div className="mt-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-blue-500"
          >
            <Zap className="w-4 h-4" />
            {isRunning ? t('generating') : t('generate')}
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {hasResults ? (
          <div className="grid grid-cols-3 gap-3">
            {VARIANT_STYLES.map((style) => (
              <VariantCard key={style} style={style} state={variants[style]} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-600 text-sm opacity-40">
            <Zap className="w-8 h-8 mb-3 opacity-30" />
            {t('empty')}
          </div>
        )}
      </div>
    </div>
  )
}

const STYLE_CONFIG = {
  standard: { color: 'text-violet-400', bar: 'bg-violet-500/30' },
  concise: { color: 'text-blue-400', bar: 'bg-blue-500/30' },
  creative: { color: 'text-emerald-400', bar: 'bg-emerald-500/30' },
} as const

function VariantCard({ style, state }: { style: VariantStyle; state: VariantState }) {
  const [copied, setCopied] = useState(false)
  const t = useTranslations('variants')
  const { color } = STYLE_CONFIG[style]

  const handleCopy = async () => {
    if (!state.content) return
    await navigator.clipboard.writeText(state.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0e0e1a] border border-[#1e1e2e] rounded-xl flex flex-col min-h-[200px]"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e1e2e]">
        <span className={`text-xs font-medium ${color}`}>{t(style)}</span>
        {state.content && !state.isStreaming && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] text-slate-500 hover:text-slate-300 hover:bg-[#1a1a2e] transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? t('copied') : t('copy')}
          </button>
        )}
      </div>

      <div className="flex-1 p-3">
        {state.error ? (
          <p className="text-red-400 text-xs">{state.error}</p>
        ) : state.content ? (
          <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
            {state.content}
            {state.isStreaming && (
              <span className="inline-block w-0.5 h-3 bg-violet-400 ml-0.5 animate-pulse" />
            )}
          </p>
        ) : state.isStreaming ? (
          <div className="flex items-center gap-2 text-slate-600 text-xs mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            {t('generating')}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
