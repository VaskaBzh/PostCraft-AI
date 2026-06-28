'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageSquarePlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/shared/model/store'
import { useStreamingGenerate } from '@/features/post-generation/hooks/useStreamingGenerate'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'

export function ChatInterface() {
  const messages = useStore((s) => s.messages)
  const settings = useStore((s) => s.settings)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { generate, error, retry, dismissError } = useStreamingGenerate()
  const t = useTranslations('chat')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const lastUserPrompt = messages.filter((m) => m.role === 'user').at(-1)?.content

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]">
        <div>
          <h1 className="text-white font-semibold text-sm">{t('title')}</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {settings.platform} · {t(`tones.${settings.tone}`)} · {settings.language}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-[#12121e] border border-[#2a2a3f] rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Claude Opus 4.8
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-[#2a2a3f] scrollbar-track-transparent">
        <AnimatePresence>
          {messages.length === 0 ? (
            <EmptyState platform={settings.platform} />
          ) : (
            messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onRegenerate={
                  msg.role === 'assistant' && i === messages.length - 1 && lastUserPrompt
                    ? () => generate(lastUserPrompt)
                    : undefined
                }
              />
            ))
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <ErrorBanner
          type={error.type}
          message={error.message}
          retryAfter={error.retryAfter}
          onRetry={retry}
          onDismiss={dismissError}
        />
      )}

      {/* Input */}
      <ChatInput />
    </div>
  )
}

function EmptyState({ platform }: { platform: string }) {
  const t = useTranslations('empty')

  const examples = t.raw(`examples.${platform}`) as string[] | undefined

  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full py-16 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/20 flex items-center justify-center mb-4">
        <Sparkles className="w-7 h-7 text-violet-400" />
      </div>
      <h2 className="text-white font-semibold mb-2">{t('title')}</h2>
      <p className="text-slate-500 text-sm max-w-xs mb-6">{t('subtitle')}</p>
      <div className="space-y-2 w-full max-w-sm">
        {(examples ?? []).map((ex) => (
          <motion.div
            key={ex}
            whileHover={{ x: 4 }}
            className="flex items-center gap-2 text-left px-3 py-2.5 bg-[#12121e] border border-[#2a2a3f] rounded-xl"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            <span className="text-slate-400 text-sm">{ex}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
