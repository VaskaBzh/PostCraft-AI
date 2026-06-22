'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Trash2, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useStore } from '@/shared/model/store'
import { PLATFORMS } from '@/entities/platform/constants'
import type { Template } from '@/entities/platform/types'

export function TemplateLibrary() {
  const { templates, deleteTemplate, setSettings, loadPrompt } = useStore()
  const t = useTranslations('templates')

  function handleLoad(template: Template) {
    setSettings(template.settings)
    loadPrompt(template.prompt)
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
  }

  const platformName = (id: string) => PLATFORMS.find((p) => p.id === id)?.name ?? id

  return (
    <section>
      <label className="text-slate-500 text-[10px] uppercase tracking-widest px-1 mb-2 flex items-center gap-1.5">
        <Bookmark className="w-3 h-3" />
        {t('title')}
      </label>

      <AnimatePresence initial={false}>
        {templates.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-slate-600 text-[11px] px-3 py-2"
          >
            {t('empty')}
          </motion.p>
        ) : (
          templates.map((tmpl) => (
            <motion.div
              key={tmpl.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-1"
            >
              <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-lg hover:bg-[#1a1a2e] group">
                <div className="flex-1 min-w-0">
                  <div className="text-slate-300 text-xs font-medium truncate">{tmpl.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-violet-400">
                      {platformName(tmpl.settings.platform)}
                    </span>
                    <span className="text-slate-600 text-[10px]">{formatDate(tmpl.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleLoad(tmpl)}
                    title={t('load')}
                    className="p-1 rounded text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                  >
                    <Upload className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(tmpl.id)}
                    title={t('delete')}
                    className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </section>
  )
}
