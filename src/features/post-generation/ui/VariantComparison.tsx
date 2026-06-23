'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Check, Loader2, X, FlaskConical } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useVariantGenerate } from '@/features/post-generation/hooks/useVariantGenerate'

export function VariantComparison() {
  const [prompt, setPrompt] = useState('')
  const { variants, isGenerating, generateVariants, clearVariants, toneLabel } =
    useVariantGenerate()
  const t = useTranslations('variants')

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return
    await generateVariants(prompt)
  }

  const hasVariants = variants.length > 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Input */}
      <div className="p-4 border-b border-[#1e1e2e] flex-shrink-0">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('inputPlaceholder')}
          rows={2}
          disabled={isGenerating}
          className="w-full bg-[#12121e] border border-[#2a2a3f] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50"
        />
        <div className="flex items-center gap-2 mt-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {t('generate')}
          </motion.button>
          {hasVariants && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearVariants}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-[#1a1a2e] transition-all"
            >
              <X className="w-4 h-4" />
              {t('clear')}
            </motion.button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {hasVariants ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {variants.map((variant, i) => (
                <VariantCard
                  key={variant.id}
                  index={i + 1}
                  content={variant.content}
                  tone={toneLabel(variant.tone)}
                  isStreaming={variant.isStreaming}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="flex flex-col items-center justify-center h-48 text-slate-600 text-sm"
            >
              <FlaskConical className="w-8 h-8 mb-3 opacity-30" />
              {t('emptyHint')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function VariantCard({
  index,
  content,
  tone,
  isStreaming,
}: {
  index: number
  content: string
  tone: string
  isStreaming: boolean
}) {
  const [copied, setCopied] = useState(false)
  const t = useTranslations('variants')

  const handleCopy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const colors = ['#a855f7', '#3b82f6', '#22c55e']
  const color = colors[(index - 1) % colors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index - 1) * 0.1 }}
      className="bg-[#12121e] border border-[#2a2a3f] rounded-xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a2a3f]"
        style={{ backgroundColor: `${color}10` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color }}>
            {t('variant', { index })}
          </span>
          <span className="text-[10px] text-slate-500 capitalize">{tone}</span>
        </div>
        {isStreaming && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 min-h-[120px]">
        {content ? (
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
            {content}
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-text-bottom" />
            )}
          </p>
        ) : (
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t('generating', { index })}
          </div>
        )}
      </div>

      {/* Footer */}
      {content && !isStreaming && (
        <div className="flex items-center justify-end px-4 py-2.5 border-t border-[#2a2a3f]">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                {t('copied')}
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                {t('copy')}
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  )
}
