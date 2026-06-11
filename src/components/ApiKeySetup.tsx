'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Sparkles, Shield, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'

export function ApiKeySetup() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const setApiKey = useStore((s) => s.setApiKey)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim().startsWith('sk-ant-')) {
      setError('Ключ должен начинаться с sk-ant-...')
      return
    }
    setApiKey(value.trim())
  }

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 mb-4 shadow-lg shadow-violet-500/25"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Post<span className="text-violet-400">Craft</span> AI
          </h1>
          <p className="text-slate-400 text-sm">
            Генератор постов для соцсетей на базе Claude
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#12121e] border border-[#2a2a3f] rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-5">
            <Key className="w-5 h-5 text-violet-400" />
            <h2 className="text-white font-semibold">Введите API ключ</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError('') }}
                placeholder="sk-ant-api03-..."
                className="w-full bg-[#1a1a2e] border border-[#2a2a3f] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!value.trim()}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
            >
              Начать работу
            </motion.button>
          </form>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: Shield, text: 'Ключ хранится локально' },
              { icon: Zap, text: 'Стриминг ответов' },
              { icon: Sparkles, text: 'Claude Opus 4.8' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-[#1a1a2e] rounded-xl">
                <Icon className="w-4 h-4 text-violet-400" />
                <span className="text-slate-400 text-[10px] text-center leading-tight">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          Получите ключ на{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300">
            console.anthropic.com
          </a>
        </p>
      </motion.div>
    </div>
  )
}
