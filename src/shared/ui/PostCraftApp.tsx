'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Layers } from 'lucide-react'
import { ChatInterface } from '@/features/post-generation/ui/ChatInterface'
import { BulkGenerationView } from '@/features/post-generation/ui/BulkGenerationView'
import { Sidebar } from './Sidebar'

type Mode = 'chat' | 'bulk'

export function PostCraftApp() {
  const [mode, setMode] = useState<Mode>('chat')

  return (
    <div className="h-screen bg-[#080810] flex overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mode switcher */}
        <div className="flex-shrink-0 flex items-center gap-1 px-4 pt-3 pb-0">
          {(
            [
              { id: 'chat' as Mode, label: 'Чат', icon: MessageSquare },
              { id: 'bulk' as Mode, label: 'Все платформы', icon: Layers },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                mode === id
                  ? 'bg-violet-600/20 text-violet-300 font-medium'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1a2e]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </motion.button>
          ))}
        </div>

        {mode === 'chat' ? <ChatInterface /> : <BulkGenerationView />}
      </main>
    </div>
  )
}
