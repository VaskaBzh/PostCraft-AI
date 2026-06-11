import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Lightbulb } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useStreamingGenerate } from '../hooks/useStreamingGenerate'

const QUICK_PROMPTS = [
  'Анонс нового продукта с акцентом на выгоды',
  'Мотивационный пост для предпринимателей',
  'Пост о трендах в IT-индустрии',
  'Продвижение обучающего курса',
  'История успеха клиента/кейс',
  'Пост с советами по продуктивности',
  'Анонс мероприятия/вебинара',
  'Развлекательный опрос для аудитории',
]

export function ChatInput() {
  const [value, setValue] = useState('')
  const [showQuick, setShowQuick] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isGenerating = useStore((s) => s.isGenerating)
  const { generate } = useStreamingGenerate()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  const handleSubmit = async () => {
    if (!value.trim() || isGenerating) return
    const prompt = value.trim()
    setValue('')
    await generate(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setValue(prompt)
    setShowQuick(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="p-4 border-t border-[#1e1e2e] bg-[#0e0e1a]">
      {/* Quick prompts */}
      <AnimatePresence>
        {showQuick && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-3 grid grid-cols-2 gap-1.5"
          >
            {QUICK_PROMPTS.map((prompt) => (
              <motion.button
                key={prompt}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-left px-3 py-2 text-xs text-slate-400 bg-[#12121e] border border-[#2a2a3f] rounded-lg hover:border-violet-500/50 hover:text-slate-200 transition-all truncate"
              >
                {prompt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        {/* Quick prompts toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQuick((v) => !v)}
          className={`flex-shrink-0 mb-1 p-2 rounded-xl transition-all ${
            showQuick
              ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
              : 'text-slate-500 hover:text-slate-300 hover:bg-[#1a1a2e]'
          }`}
          title="Готовые промпты"
        >
          <Lightbulb className="w-5 h-5" />
        </motion.button>

        {/* Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Опишите тему или идею для поста... (Ctrl+Enter для отправки)"
            rows={1}
            disabled={isGenerating}
            className="w-full bg-[#12121e] border border-[#2a2a3f] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all disabled:opacity-50 pr-12 leading-relaxed"
          />
        </div>

        {/* Send button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!value.trim() || isGenerating}
          className="flex-shrink-0 mb-0.5 w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-blue-500"
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </motion.div>
            ) : (
              <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Send className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <p className="text-slate-700 text-[10px] mt-2 text-center">
        Ctrl+Enter для отправки · Claude Opus 4.8 со стримингом
      </p>
    </div>
  )
}
