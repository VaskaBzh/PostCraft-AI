'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Hash, Smile, Upload, Download, Globe } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname, type Locale } from '@/i18n/routing'
import { useStore } from '@/shared/model/store'
import { PLATFORMS, TONES, LENGTHS, LANGUAGES, MODEL_OPTIONS } from '@/entities/platform/constants'
import { TemplateLibrary } from '@/features/post-generation/ui/TemplateLibrary'
import { HistoryPanel } from '@/features/post-generation/ui/HistoryPanel'
import { exportHistory, importHistory } from '@/shared/lib/history-io'

export function Sidebar() {
  const { settings, selectedModel, setPlatform, setTone, setLength, setSettings, setModel } =
    useStore()
  const t = useTranslations('sidebar')
  const tTones = useTranslations('tones')
  const tLengths = useTranslations('lengths')
  const tModels = useTranslations('models')

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
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">
            {t('platform')}
          </label>
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
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">
            {t('tone')}
          </label>
          <div className="space-y-0.5">
            {TONES.map(({ id, emoji }) => (
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
                <span className="truncate">{tTones(id)}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Length */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">
            {t('length')}
          </label>
          <div className="flex gap-1">
            {LENGTHS.map(({ id, icon: Icon }) => (
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
                {tLengths(id)}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Options */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">
            {t('options')}
          </label>
          <div className="space-y-1">
            <Toggle
              icon={Hash}
              label={t('hashtags')}
              value={settings.includeHashtags}
              onChange={(v) => setSettings({ includeHashtags: v })}
            />
            <Toggle
              icon={Smile}
              label={t('emojis')}
              value={settings.includeEmojis}
              onChange={(v) => setSettings({ includeEmojis: v })}
            />
          </div>
        </section>

        {/* Language */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">
            {t('language')}
          </label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ language: e.target.value })}
            className="w-full bg-[#1a1a2e] border border-[#2a2a3f] text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </section>

        {/* Templates */}
        <TemplateLibrary />

        {/* History */}
        <HistoryPanel />
        <HistoryActions />

        {/* Model */}
        <section>
          <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 block">
            {t('model')}
          </label>
          <div className="space-y-0.5">
            {MODEL_OPTIONS.map(({ id, name, descriptionKey, icon: Icon }) => (
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
                  <span className="text-[10px] text-slate-500 leading-none mt-0.5">
                    {tModels(descriptionKey)}
                  </span>
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

      {/* Locale switcher */}
      <div className="p-3 border-t border-[#1e1e2e]">
        <LocaleSwitcher />
      </div>
    </aside>
  )
}

function HistoryActions() {
  const messages = useStore((s) => s.messages)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('sidebar')

  const handleExport = () => {
    if (messages.length === 0) return
    exportHistory(messages)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imported = await importHistory(file)
      if (confirm(t('importConfirm', { count: imported.length }))) {
        useStore.setState({ messages: imported })
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to import history')
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (messages.length === 0) return null

  return (
    <div className="flex gap-1 px-1">
      <button
        onClick={handleExport}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-slate-600 hover:text-slate-400 hover:bg-[#1a1a2e] transition-all"
      >
        <Download className="w-3 h-3" />
        {t('export')}
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-slate-600 hover:text-slate-400 hover:bg-[#1a1a2e] transition-all"
      >
        <Upload className="w-3 h-3" />
        {t('import')}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  )
}

const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'RU',
  en: 'EN',
}

function LocaleSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-3.5 h-3.5 text-slate-500" />
      <div className="flex gap-0.5 bg-[#12121e] rounded-lg p-0.5">
        {(Object.keys(LOCALE_LABELS) as Locale[]).map((loc) => (
          <motion.button
            key={loc}
            whileTap={{ scale: 0.95 }}
            onClick={() => switchLocale(loc)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              locale === loc
                ? 'bg-violet-600/20 text-violet-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {LOCALE_LABELS[loc]}
          </motion.button>
        ))}
      </div>
    </div>
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
      <span className={`text-sm flex-1 text-left ${value ? 'text-slate-300' : 'text-slate-600'}`}>
        {label}
      </span>
      <div
        className={`w-8 h-4 rounded-full transition-all relative ${value ? 'bg-violet-600' : 'bg-[#2a2a3f]'}`}
      >
        <motion.div
          animate={{ x: value ? 16 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow"
        />
      </div>
    </button>
  )
}
