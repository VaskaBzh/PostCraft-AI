'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  Check,
  Send,
  RefreshCw,
  Eye,
  AlignLeft,
  Download,
  ChevronDown,
  FileText,
} from 'lucide-react'
import type { Message } from '@/entities/platform/types'
import { PLATFORM_ICONS, PLATFORM_COLORS, CHAR_LIMITS } from '@/entities/platform/constants'
import { formatAsMarkdown, copyToClipboard, downloadAsFile } from '@/shared/lib/export'
import { PostPreview } from './PostPreview'

interface Props {
  message: Message
  onRegenerate?: () => void
}

export function MessageBubble({ message, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState<'text' | 'preview'>('text')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false)
      }
    }
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportMenu])

  const showCopiedFeedback = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopy = async () => {
    const ok = await copyToClipboard(message.content)
    if (ok) showCopiedFeedback()
  }

  const handleCopyMarkdown = async () => {
    const md = formatAsMarkdown(message)
    const ok = await copyToClipboard(md)
    if (ok) showCopiedFeedback()
    setShowExportMenu(false)
  }

  const handleDownload = () => {
    const filename = `post-${message.platform}-${Date.now()}.txt`
    downloadAsFile(message.content, filename)
    setShowExportMenu(false)
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
                  <span
                    className="w-1 h-1 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-1 h-1 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: '100ms' }}
                  />
                  <span
                    className="w-1 h-1 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: '200ms' }}
                  />
                </span>
                Генерация...
              </span>
            )}
            {/* Text / Preview toggle */}
            {!message.isStreaming && message.content && (
              <div className="ml-auto flex items-center gap-0.5 bg-[#1e1e2e] rounded-lg p-0.5">
                <button
                  onClick={() => setView('text')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${
                    view === 'text'
                      ? 'bg-[#2a2a3f] text-slate-300'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <AlignLeft className="w-3 h-3" />
                  Текст
                </button>
                <button
                  onClick={() => setView('preview')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${
                    view === 'preview'
                      ? 'bg-[#2a2a3f] text-slate-300'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Превью
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-4 py-4">
            {view === 'preview' && !message.isStreaming && message.content ? (
              <PostPreview text={message.content} platform={message.platform} />
            ) : (
              <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
                {message.isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-text-bottom" />
                )}
              </p>
            )}
          </div>

          {/* Footer */}
          {!message.isStreaming && message.content && (
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1e1e2e]">
              <div className="flex items-center gap-1">
                <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-slate-600'}`}>
                  {charCount}
                  {charLimit && <span className="text-slate-700">/{charLimit}</span>}
                  &nbsp;символов
                </span>
                {isOverLimit && <span className="text-red-400 text-xs">· Превышен лимит</span>}
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
                <div className="relative" ref={exportRef}>
                  <div className="flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-l-lg text-xs transition-all"
                      style={
                        copied ? { backgroundColor: `${color}20`, color } : { color: '#64748b' }
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
                    <button
                      onClick={() => setShowExportMenu((v) => !v)}
                      className="px-1 py-1.5 rounded-r-lg text-slate-500 hover:text-slate-300 hover:bg-[#1e1e2e] transition-all"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <AnimatePresence>
                    {showExportMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute right-0 bottom-full mb-1 bg-[#1e1e2e] border border-[#2a2a3f] rounded-lg shadow-xl overflow-hidden z-10 min-w-[160px]"
                      >
                        <button
                          onClick={handleCopyMarkdown}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-[#2a2a3f] transition-all"
                        >
                          <FileText className="w-3 h-3" />
                          Копировать Markdown
                        </button>
                        <button
                          onClick={handleDownload}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-[#2a2a3f] transition-all"
                        >
                          <Download className="w-3 h-3" />
                          Скачать .txt
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
