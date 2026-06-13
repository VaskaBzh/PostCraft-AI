'use client'

import { motion } from 'framer-motion'
import { Sparkles, Hash, Smile, Trash2 } from 'lucide-react'
import { useStore } from '@/shared/model/store'
import { PLATFORMS, TONES, LENGTHS, LANGUAGES, MODEL_OPTIONS } from '@/entities/platform/constants'

export function Sidebar() {
  const { settings, selectedModel, setPlatform, setTone, setLength, setSettings, clearMessages, setModel } = useStore()

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

        {/* Model */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">Модель</label>
          <div className="space-y-0.5">
            {MODEL_OPTIONS.map(({ id, name, description, icon: Icon }) => (
              <motion.button
                key={id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setModel(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedModel === id
                    ? 'bg-violet-600/20 text-violet-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a2e]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className="flex flex-col items-start min-w-0">
                  <span className="truncate leading-none">{name}</span>
                  <span className="text-[10px] text-slate-500 leading-none mt-0.5">{description}</span>
                </div>
                {selectedModel === id && (
                  <motion.div
                    layoutId="model-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0"
                  />
                )}
              </motion.button>
            ))}
          </div>
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

