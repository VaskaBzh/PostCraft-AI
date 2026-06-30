'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, RefreshCw, X, WifiOff, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type ErrorType = 'api' | 'rate-limit' | 'network' | 'unknown'

interface Props {
  type: ErrorType
  message: string
  retryAfter?: number
  onRetry?: () => void
  onDismiss: () => void
}

export function ErrorBanner({ type, message, retryAfter, onRetry, onDismiss }: Props) {
  const [countdown, setCountdown] = useState(() => retryAfter ?? 0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)
  const t = useTranslations('error')

  useEffect(() => {
    if (type !== 'rate-limit' || !retryAfter) return

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [type, retryAfter])

  const icons = {
    api: AlertTriangle,
    'rate-limit': Clock,
    network: WifiOff,
    unknown: AlertTriangle,
  }
  const Icon = icons[type]

  const colors = {
    api: 'border-red-500/30 bg-red-500/10 text-red-400',
    'rate-limit': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    network: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
    unknown: 'border-red-500/30 bg-red-500/10 text-red-400',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[type]} mx-4 mb-2`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm flex-1">{message}</span>
        {type === 'rate-limit' && countdown > 0 && (
          <span className="text-xs opacity-70">{countdown}s</span>
        )}
        {onRetry && (type !== 'rate-limit' || countdown === 0) && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            {t('retry')}
          </button>
        )}
        <button onClick={onDismiss} className="p-1 hover:bg-white/10 rounded-lg transition-all">
          <X className="w-3 h-3" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export function parseErrorType(
  status: number,
  message: string,
  errorMessages: {
    network: string
    rateLimit: string
    forbidden: string
    server: string
    unknown: string
  }
): { type: ErrorType; displayMessage: string; retryAfter?: number } {
  if (!navigator.onLine) {
    return { type: 'network', displayMessage: errorMessages.network }
  }
  if (status === 429) {
    const retryMatch = message.match(/retry.after[:\s]*(\d+)/i)
    const retryAfter = retryMatch ? parseInt(retryMatch[1], 10) : 60
    return { type: 'rate-limit', displayMessage: errorMessages.rateLimit, retryAfter }
  }
  if (status === 403) {
    return { type: 'api', displayMessage: errorMessages.forbidden }
  }
  if (status >= 500) {
    return { type: 'api', displayMessage: errorMessages.server }
  }
  return { type: 'unknown', displayMessage: message || errorMessages.unknown }
}
