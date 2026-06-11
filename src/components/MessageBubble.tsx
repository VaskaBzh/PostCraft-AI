'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Send, RefreshCw } from 'lucide-react'
import type { Message } from '../types'

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  twitter: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  instagram: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  linkedin: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  facebook: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  tiktok: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.28a8.13 8.13 0 004.77 1.52V7.34a4.85 4.85 0 01-1-.65z"/></svg>,
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
