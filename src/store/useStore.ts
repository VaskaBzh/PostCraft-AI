import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message, AppSettings, Platform, Tone, Length } from '../types'

interface StoreState {
  apiKey: string
  messages: Message[]
  settings: AppSettings
  isGenerating: boolean
  setApiKey: (key: string) => void
  addMessage: (msg: Message) => void
  updateLastMessage: (content: string, done?: boolean) => void
  clearMessages: () => void
  setSettings: (s: Partial<AppSettings>) => void
  setPlatform: (p: Platform) => void
  setTone: (t: Tone) => void
  setLength: (l: Length) => void
  setGenerating: (v: boolean) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      apiKey: '',
      messages: [],
      isGenerating: false,
      settings: {
        platform: 'instagram',
        tone: 'casual',
        length: 'medium',
        includeHashtags: true,
        includeEmojis: true,
        language: 'Русский',
      },

      setApiKey: (key) => set({ apiKey: key }),

      addMessage: (msg) =>
        set((s) => ({ messages: [...s.messages, msg] })),

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
    }),
    {
      name: 'postcraft-store',
      partialize: (s) => ({ apiKey: s.apiKey, settings: s.settings }),
    }
  )
)
