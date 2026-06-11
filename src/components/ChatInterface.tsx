'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageSquarePlus } from 'lucide-react'
import { useStore } from '../store/useStore'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { useStreamingGenerate } from '../hooks/useStreamingGenerate'

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'X / Twitter',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  telegram: 'Telegram',
}

const TONE_LABELS: Record<string, string> = {
  professional: 'Профессиональный',
  casual: 'Casual',
  humorous: 'Юмористический',
  inspirational: 'Вдохновляющий',
  bold: 'Смелый',
}

export function ChatInterface() {
  const messages = useStore((s) => s.messages)
  const settings = useStore((s) => s.settings)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { generate } = useStreamingGenerate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const lastUserPrompt = messages.filter((m) => m.role === 'user').at(-1)?.content

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]">
        <div>
          <h1 className="text-white font-semibold text-sm">Генератор постов</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {PLATFORM_LABELS[settings.platform]} · {TONE_LABELS[settings.tone]} · {settings.language}
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

      {/* Input */}
      <ChatInput />
    </div>
  )
}

function EmptyState({ platform }: { platform: string }) {
  const EXAMPLES: Record<string, string[]> = {
    twitter: ['Анонс продукта за 280 символов', 'Острый комментарий к тренду', 'Тред с советами'],
    instagram: ['Пост с историей бренда', 'Капшн к фото продукта', 'Карусель с лайфхаками'],
    linkedin: ['Кейс успеха компании', 'Мысли о будущем индустрии', 'Анонс вакансии'],
    facebook: ['Новость для сообщества', 'Опрос аудитории', 'Розыгрыш/конкурс'],
    tiktok: ['Описание к видео с трендом', 'Хук для вирусного ролика', 'Образовательный контент'],
    telegram: ['Аналитика рынка', 'Срочная новость', 'Анонс обновления'],
  }

  const examples = EXAMPLES[platform] || []

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
      <h2 className="text-white font-semibold mb-2">Готов к созданию постов</h2>
      <p className="text-slate-500 text-sm max-w-xs mb-6">
        Опишите тему или идею — Claude создаст пост с учётом платформы и тона
      </p>
      <div className="space-y-2 w-full max-w-sm">
        {examples.map((ex) => (
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
