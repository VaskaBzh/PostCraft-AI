'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Message,
  AppSettings,
  Platform,
  Tone,
  Length,
  ModelId,
  Template,
  Analytics,
} from '@/entities/platform/types'

const EMPTY_ANALYTICS: Analytics = {
  totalGenerations: 0,
  byPlatform: {},
  byTone: {},
  byModel: {},
  lastGeneratedAt: null,
}

interface StoreState {
  messages: Message[]
  settings: AppSettings
  isGenerating: boolean
  selectedModel: ModelId
  templates: Template[]
  pendingPrompt: string | null
  analytics: Analytics
  addMessage: (msg: Message) => void
  updateLastMessage: (content: string, done?: boolean) => void
  clearMessages: () => void
  setSettings: (s: Partial<AppSettings>) => void
  setPlatform: (p: Platform) => void
  setTone: (t: Tone) => void
  setLength: (l: Length) => void
  setGenerating: (v: boolean) => void
  setModel: (model: ModelId) => void
  saveTemplate: (
    name: string,
    prompt: string,
    settings: Pick<AppSettings, 'platform' | 'tone' | 'length'>
  ) => void
  deleteTemplate: (id: string) => void
  loadPrompt: (prompt: string) => void
  clearPendingPrompt: () => void
  clearAnalytics: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      messages: [],
      isGenerating: false,
      selectedModel: 'claude-opus-4-8',
      templates: [],
      pendingPrompt: null,
      analytics: { ...EMPTY_ANALYTICS },
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

          if (done && last?.role === 'assistant' && content && !content.startsWith('❌')) {
            const a = s.analytics
            return {
              messages: msgs,
              analytics: {
                totalGenerations: a.totalGenerations + 1,
                byPlatform: {
                  ...a.byPlatform,
                  [s.settings.platform]: (a.byPlatform[s.settings.platform] ?? 0) + 1,
                },
                byTone: {
                  ...a.byTone,
                  [s.settings.tone]: (a.byTone[s.settings.tone] ?? 0) + 1,
                },
                byModel: {
                  ...a.byModel,
                  [s.selectedModel]: (a.byModel[s.selectedModel] ?? 0) + 1,
                },
                lastGeneratedAt: Date.now(),
              },
            }
          }

          return { messages: msgs }
        }),

      clearMessages: () => set({ messages: [] }),

      setSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),

      setPlatform: (platform) => set((s) => ({ settings: { ...s.settings, platform } })),

      setTone: (tone) => set((s) => ({ settings: { ...s.settings, tone } })),

      setLength: (length) => set((s) => ({ settings: { ...s.settings, length } })),

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

      deleteTemplate: (id) => set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),

      loadPrompt: (prompt) => set({ pendingPrompt: prompt }),
      clearPendingPrompt: () => set({ pendingPrompt: null }),

      clearAnalytics: () => set({ analytics: { ...EMPTY_ANALYTICS } }),
    }),
    {
      name: 'postcraft-store',
      partialize: (s) => ({
        settings: s.settings,
        selectedModel: s.selectedModel,
        templates: s.templates,
        messages: s.messages,
        analytics: s.analytics,
      }),
    }
  )
)
