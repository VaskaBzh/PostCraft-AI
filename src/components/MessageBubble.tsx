'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Twitter, Instagram, Linkedin, Facebook, Send, RefreshCw } from 'lucide-react'
import type { Message } from '../types'

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  tiktok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.28a8.13 8.13 0 004.77 1.52V7.34a4.85 4.85 0 01-1-.65z"/>
    </svg>
  ),
  telegram: Send,
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#1DA1F2',
  instagram: '#E1306C',
  linkedin: '#0077B5',
  facebook: '#1877F2',
  tiktok: '#ff0050',
  telegram: '#2AABEE',
}

const CHAR_LIMITS: Record<string, number | null> = {
  twitter: 280,
  instagram: 2200,
  linkedin: 3000,
  facebook: null,
  tiktok: 2200,
  telegram: null,
}

interface Props {
  message: Message
  onRegenerate?: () => void
}

export function MessageBubble({ message, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (message.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[70%] bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg shadow-violet-500/10">
          <p className="text-white text-sm leading-relaxed">{message.content}</p>
        </div>
      </motion.div>
    )
  }

  const PlatformIcon = PLATFORM_ICONS[message.platform] || Send
  const color = PLATFORM_COLORS[message.platform] || '#7c3aed'
  const charLimit = CHAR_LIMITS[message.platform]
  const charCount = message.content.length
  const isOverLimit = charLimit && charCount > charLimit

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] w-full">
        <div className="bg-[#12121e] border border-[#2a2a3f] rounded-2xl rounded-tl-sm overflow-hidden shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1e1e2e]">
            <div className="flex items-center gap-1.5" style={{ color }}>
              <PlatformIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium capitalize">{message.platform}</span>
            </div>
            <span className="text-slate-600 text-xs">·</span>
            <span className="text-slate-600 text-xs capitalize">{message.tone}</span>
            {message.isStreaming && (
              <span className="ml-auto flex items-center gap-1 text-violet-400 text-xs">
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '100ms' }} />
                  <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '200ms' }} />
                </span>
                Генерация...
              </span>
            )}
          </div>

          {/* Content */}
          <div className="px-4 py-4">
            <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
              {message.isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-text-bottom" />
              )}
            </p>
          </div>

          {/* Footer */}
          {!message.isStreaming && message.content && (
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1e1e2e]">
              <div className="flex items-center gap-1">
                <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-slate-600'}`}>
                  {charCount}
                  {charLimit && (
                    <span className="text-slate-700">/{charLimit}</span>
                  )}
                  &nbsp;символов
                </span>
                {isOverLimit && (
                  <span className="text-red-400 text-xs">· Превышен лимит</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {onRegenerate && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRegenerate}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#1e1e2e] transition-all text-xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Ещё раз
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                  style={
                    copied
                      ? { backgroundColor: `${color}20`, color }
                      : { color: '#64748b' }
                  }
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Скопировано!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Копировать
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
