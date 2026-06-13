'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message, AppSettings, Platform, Tone, Length, ModelId, Template } from '@/entities/platform/types'

interface StoreState {
  messages: Message[]
  settings: AppSettings
  isGenerating: boolean
  selectedModel: ModelId
  templates: Template[]
  addMessage: (msg: Message) => void
  updateLastMessage: (content: string, done?: boolean) => void
  clearMessages: () => void
  setSettings: (s: Partial<AppSettings>) => void
  setPlatform: (p: Platform) => void
  setTone: (t: Tone) => void
  setLength: (l: Length) => void
  setGenerating: (v: boolean) => void
  setModel: (model: ModelId) => void
  saveTemplate: (name: string, prompt: string, settings: Pick<AppSettings, 'platform' | 'tone' | 'length'>) => void
  deleteTemplate: (id: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      messages: [],
      isGenerating: false,
      selectedModel: 'claude-opus-4-8',
      templates: [],
      settings: {
        platform: 'instagram',
        tone: 'casual',
        length: 'medium',
        includeHashtags: true,
        includeEmojis: true,
        language: 'Русский',
      },

      addMessage: (msg) =>
        set((s) => {
          const msgs = [...s.messages, msg]
          if (msgs.length > 200) {
            console.warn('[store] history trimmed to 200')
            return { messages: msgs.slice(-200) }
          }
          return { messages: msgs }
        }),

      updateLastMessage: (content, done = false) =>
        set((s) => {
          const msgs = [...s.messages]
          const last = msgs[msgs.length - 1]
          if (last && last.role === 'assistant') {
            msgs[msgs.length - 1] = { ...last, content, isStreaming: !done }
          }
          return { messages: msgs }
        }),

      clearMessages: () => set({ messages: [] }),

      setSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      setPlatform: (platform) =>
        set((s) => ({ settings: { ...s.settings, platform } })),

      setTone: (tone) =>
        set((s) => ({ settings: { ...s.settings, tone } })),

      setLength: (length) =>
        set((s) => ({ settings: { ...s.settings, length } })),

      setGenerating: (isGenerating) => set({ isGenerating }),

      setModel: (selectedModel) => set({ selectedModel }),

      saveTemplate: (name, prompt, settings) =>
        set((s) => ({
          templates: [
            ...s.templates,
            {
              id: crypto.randomUUID(),
              name,
              prompt,
              settings,
              createdAt: Date.now(),
            },
          ],
        })),

      deleteTemplate: (id) =>
        set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
    }),
    {
      name: 'postcraft-store',
      partialize: (s) => ({
        settings: s.settings,
        selectedModel: s.selectedModel,
        templates: s.templates,
        messages: s.messages,
      }),
    }
  )
)
