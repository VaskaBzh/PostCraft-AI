'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Lightbulb, Bookmark, Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/shared/model/store'
import { useStreamingGenerate } from '@/features/post-generation/hooks/useStreamingGenerate'

const QUICK_PROMPT_COUNT = 8

export function ChatInput() {
  const [value, setValue] = useState('')
  const [showQuick, setShowQuick] = useState(false)
  const [showSave, setShowSave] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const templateInputRef = useRef<HTMLInputElement>(null)

  const isGenerating = useStore((s) => s.isGenerating)
  const { saveTemplate, settings } = useStore()
  const { generate } = useStreamingGenerate()
  const t = useTranslations('chat')
  const tPrompts = useTranslations('quickPrompts')

  const quickPrompts = Array.from({ length: QUICK_PROMPT_COUNT }, (_, i) => tPrompts(String(i)))

  const applyPendingPrompt = useCallback((prompt: string) => {
    setValue(prompt)
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    return useStore.subscribe((state, prev) => {
      if (state.pendingPrompt !== null && state.pendingPrompt !== prev.pendingPrompt) {
        applyPendingPrompt(state.pendingPrompt)
        useStore.getState().clearPendingPrompt()
      }
    })
  }, [applyPendingPrompt])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  useEffect(() => {
    if (showSave) {
      templateInputRef.current?.focus()
    }
  }, [showSave])

  const handleSubmit = async () => {
    if (!value.trim() || isGenerating) return
    const prompt = value.trim()
    setValue('')
    await generate(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setValue(prompt)
    setShowQuick(false)
    textareaRef.current?.focus()
  }

  const handleSaveTemplate = () => {
    const name = templateName.trim()
    if (!name || !value.trim()) return
    saveTemplate(name, value.trim(), {
      platform: settings.platform,
      tone: settings.tone,
      length: settings.length,
    })
    setShowSave(false)
    setTemplateName('')
  }

  const handleSaveKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveTemplate()
    if (e.key === 'Escape') {
      setShowSave(false)
      setTemplateName('')
    }
  }

  return (
    <div className="p-4 border-t border-[#1e1e2e] bg-[#0e0e1a]">
      {/* Quick prompts */}
      <AnimatePresence>
        {showQuick && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-3 grid grid-cols-2 gap-1.5"
          >
            {quickPrompts.map((prompt) => (
              <motion.button
                key={prompt}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-left px-3 py-2 text-xs text-slate-400 bg-[#12121e] border border-[#2a2a3f] rounded-lg hover:border-violet-500/50 hover:text-slate-200 transition-all truncate"
              >
                {prompt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save as template inline field */}
      <AnimatePresence>
        {showSave && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex items-center gap-2"
          >
            <input
              ref={templateInputRef}
              data-testid="template-name-input"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={handleSaveKeyDown}
              placeholder={t('templateNamePlaceholder')}
              className="flex-1 bg-[#12121e] border border-violet-500/40 text-white placeholder-slate-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500 transition-all"
            />
            <button
              onClick={handleSaveTemplate}
              disabled={!templateName.trim() || !value.trim()}
              className="p-2 rounded-lg bg-violet-600/20 text-violet-400 hover:bg-violet-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowSave(false)
                setTemplateName('')
              }}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#1a1a2e] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQuick((v) => !v)}
          data-testid="quick-prompts-button"
          className={`flex-shrink-0 mb-1 p-2 rounded-xl transition-all ${
            showQuick
              ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
              : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1a2e]'
          }`}
          title={t('quickPromptsTitle')}
        >
          <Lightbulb className="w-5 h-5" />
        </motion.button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            data-testid="chat-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('inputPlaceholder')}
            rows={1}
            disabled={isGenerating}
            className="w-full bg-[#12121e] border border-[#2a2a3f] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all disabled:opacity-50 pr-12 leading-relaxed"
          />
          {value.trim() && (
            <button
              onClick={() => setShowSave((v) => !v)}
              data-testid="save-template-button"
              title={t('saveAsTemplate')}
              className={`absolute right-3 bottom-3 p-0.5 rounded transition-all ${
                showSave ? 'text-violet-400' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}
        </div>

        <motion.button
          data-testid="send-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!value.trim() || isGenerating}
          className="flex-shrink-0 mb-0.5 w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-blue-500"
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Send className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <p className="text-slate-700 text-[10px] mt-2 text-center">{t('inputHint')}</p>
    </div>
  )
}
