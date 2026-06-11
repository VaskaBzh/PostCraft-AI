'use client'

import { motion } from 'framer-motion'
import { Send, Sparkles, Hash, Smile, AlignLeft, AlignCenter, AlignJustify, Trash2 } from 'lucide-react'

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.28a8.13 8.13 0 004.77 1.52V7.34a4.85 4.85 0 01-1-.65z"/>
  </svg>
)
import { useStore } from '../store/useStore'
import type { Platform, Tone, Length } from '../types'

const PLATFORMS: { id: Platform; name: string; icon: React.ElementType; color: string }[] = [
  { id: 'twitter', name: 'X / Twitter', icon: TwitterIcon, color: '#1DA1F2' },
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: '#E1306C' },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedinIcon, color: '#0077B5' },
  { id: 'facebook', name: 'Facebook', icon: FacebookIcon, color: '#1877F2' },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, color: '#ff0050' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: '#2AABEE' },
]

const TONES: { id: Tone; name: string; emoji: string }[] = [
  { id: 'professional', name: 'Профессиональный', emoji: '💼' },
  { id: 'casual', name: 'Casual', emoji: '😊' },
  { id: 'humorous', name: 'Юмористический', emoji: '😄' },
  { id: 'inspirational', name: 'Вдохновляющий', emoji: '🔥' },
  { id: 'bold', name: 'Смелый', emoji: '⚡' },
]

const LENGTHS: { id: Length; label: string; icon: React.ElementType }[] = [
  { id: 'short', label: 'Коротко', icon: AlignLeft },
  { id: 'medium', label: 'Средне', icon: AlignCenter },
  { id: 'long', label: 'Длинно', icon: AlignJustify },
]

const LANGUAGES = ['Русский', 'English', 'Español', 'Deutsch', 'Français', 'Italiano']

export function Sidebar() {
  const { settings, setPlatform, setTone, setLength, setSettings, clearMessages } = useStore()

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0e0e1a] border-r border-[#1e1e2e] flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="p-4 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">PostCraft AI</div>
            <div className="text-slate-500 text-[10px] mt-0.5">powered by Claude</div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a2a3f] scrollbar-track-transparent">
        {/* Platform */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">Платформа</label>
          <div className="space-y-0.5">
            {PLATFORMS.map(({ id, name, icon: Icon, color }) => (
              <motion.button
                key={id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPlatform(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  settings.platform === id
                    ? 'text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a2e]'
                }`}
                style={settings.platform === id ? { backgroundColor: `${color}20`, color } : {}}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{name}</span>
                {settings.platform === id && (
                  <motion.div
                    layoutId="platform-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Tone */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">Тон</label>
          <div className="space-y-0.5">
            {TONES.map(({ id, name, emoji }) => (
              <motion.button
                key={id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTone(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  settings.tone === id
                    ? 'bg-violet-600/20 text-violet-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a2e]'
                }`}
              >
                <span className="text-base leading-none">{emoji}</span>
                <span className="truncate">{name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Length */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">Длина</label>
          <div className="flex gap-1">
            {LENGTHS.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setLength(id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] transition-all ${
                  settings.length === id
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-[#1a1a2e]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Options */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">Опции</label>
          <div className="space-y-1">
            <Toggle
              icon={Hash}
              label="Хештеги"
              value={settings.includeHashtags}
              onChange={(v) => setSettings({ includeHashtags: v })}
            />
            <Toggle
              icon={Smile}
              label="Эмодзи"
              value={settings.includeEmojis}
              onChange={(v) => setSettings({ includeEmojis: v })}
            />
          </div>
        </section>

        {/* Language */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">Язык</label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ language: e.target.value })}
            className="w-full bg-[#1a1a2e] border border-[#2a2a3f] text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </section>
      </div>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[#1e1e2e]">
        <button
          onClick={clearMessages}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Очистить историю
        </button>
      </div>
    </aside>
  )
}

function Toggle({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: React.ElementType
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#1a1a2e] transition-all group"
    >
      <Icon className={`w-4 h-4 ${value ? 'text-violet-400' : 'text-slate-600'}`} />
      <span className={`text-sm flex-1 text-left ${value ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
      <div className={`w-8 h-4 rounded-full transition-all relative ${value ? 'bg-violet-600' : 'bg-[#2a2a3f]'}`}>
        <motion.div
          animate={{ x: value ? 16 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow"
        />
      </div>
    </button>
  )
}
