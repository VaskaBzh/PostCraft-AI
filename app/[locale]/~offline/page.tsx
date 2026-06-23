'use client'

import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="h-screen bg-[#080810] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
          <WifiOff className="w-8 h-8 text-orange-400" />
        </div>
        <h1 className="text-white font-semibold text-lg mb-2">Offline</h1>
        <p className="text-slate-500 text-sm max-w-xs">
          PostCraft AI requires an internet connection for content generation.
        </p>
      </div>
    </div>
  )
}
