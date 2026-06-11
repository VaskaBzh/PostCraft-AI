'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Key } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ApiKeySetup } from './ApiKeySetup'
import { Sidebar } from './Sidebar'
import { ChatInterface } from './ChatInterface'

function ChangeKeyModal({ onClose }: { onClose: () => void }) {
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
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#12121e] border border-[#2a2a3f] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-violet-400" />
            <h2 className="text-white font-semibold">Сменить API ключ</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError('') }}
            placeholder="sk-ant-api03-..."
            autoFocus
            className="w-full bg-[#1a1a2e] border border-[#2a2a3f] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!value.trim()}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Сохранить
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export function PostCraftApp() {
  const apiKey = useStore((s) => s.apiKey)
  const [showKeyModal, setShowKeyModal] = useState(false)

  if (!apiKey) {
    return <ApiKeySetup />
  }

  return (
    <div className="h-screen bg-[#080810] flex overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar onSettings={() => setShowKeyModal(true)} />

      <main className="flex-1 flex flex-col min-w-0">
        <ChatInterface />
      </main>

      <AnimatePresence>
        {showKeyModal && (
          <ChangeKeyModal onClose={() => setShowKeyModal(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
