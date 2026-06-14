'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Loader2, AlertCircle } from 'lucide-react'
import {
  PLATFORM_COLORS,
  PLATFORM_ICONS,
  CHAR_LIMITS,
  PLATFORMS,
} from '@/entities/platform/constants'
import type { Platform } from '@/entities/platform/types'
import type { PlatformResult } from '@/features/post-generation/hooks/useBulkGenerate'

interface Props {
  platform: Platform
  result: PlatformResult
}

export function BulkResultCard({ platform, result }: Props) {
  const [copied, setCopied] = useState(false)

  const color = PLATFORM_COLORS[platform] ?? '#6366f1'
  const Icon = PLATFORM_ICONS[platform]
  const charLimit = CHAR_LIMITS[platform]
  const name = PLATFORMS.find((p) => p.id === platform)?.name ?? platform
  const overLimit = charLimit !== null && result.text.length > charLimit

  const handleCopy = async () => {
    if (!result.text) return
    await navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#12121e] border border-[#2a2a3f] rounded-xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-[#2a2a3f]"
        style={{ backgroundColor: `${color}18` }}
      >
        {Icon && <Icon style={{ color }} />}
        <span className="text-sm font-medium text-white flex-1">{name}</span>
        {result.status === 'streaming' && (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
        )}
        {result.status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
      </div>

      {/* Body */}
      <div className="flex-1 p-3 min-h-[80px]">
        {result.status === 'error' ? (
          <p className="text-red-400 text-xs">❌ {result.error}</p>
        ) : result.text ? (
          <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
            {result.text}
          </p>
        ) : (
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <Loader2 className="w-3 h-3 animate-spin" />
            Генерация...
          </div>
        )}
      </div>

      {/* Footer */}
      {result.text && result.status !== 'error' && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-[#2a2a3f]">
          <span className={`text-[10px] ${overLimit ? 'text-red-400' : 'text-slate-600'}`}>
            {result.text.length}
            {charLimit === null ? '' : ` / ${charLimit}`} симв.
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Скопировано' : 'Копировать'}
          </button>
        </div>
      )}
    </motion.div>
  )
}
