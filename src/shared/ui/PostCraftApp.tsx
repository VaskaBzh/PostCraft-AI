'use client'

import { Sidebar } from './Sidebar'
import { ChatInterface } from '@/features/post-generation/ui/ChatInterface'

export function PostCraftApp() {
  return (
    <div className="h-screen bg-[#080810] flex overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <ChatInterface />
      </main>
    </div>
  )
}
