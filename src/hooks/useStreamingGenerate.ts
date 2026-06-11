import Anthropic from '@anthropic-ai/sdk'
import { useStore } from '../store/useStore'
import type { Platform, Tone, Length } from '../types'

const PLATFORM_DETAILS: Record<Platform, string> = {
  twitter: 'Twitter/X (лимит 280 символов, без длинных абзацев)',
  instagram: 'Instagram (до 2200 символов, визуальный storytelling)',
  linkedin: 'LinkedIn (профессиональная сеть, до 3000 символов)',
  facebook: 'Facebook (без лимита, дружелюбный тон)',
  tiktok: 'TikTok (молодёжная аудитория, вирусный контент)',
  telegram: 'Telegram (без лимита, информативный стиль)',
}

const TONE_DETAILS: Record<Tone, string> = {
  professional: 'деловой и профессиональный — авторитетный, чёткий, без жаргона',
  casual: 'непринуждённый и дружелюбный — разговорный, тёплый, близкий к аудитории',
  humorous: 'юмористический и остроумный — смешной, игривый, с каламбурами',
  inspirational: 'вдохновляющий и мотивирующий — поднимает боевой дух, цепляет эмоции',
  bold: 'смелый и провокационный — дерзкий, вызывающий, запоминающийся',
}

const LENGTH_DETAILS: Record<Length, string> = {
  short: 'короткий (1-3 предложения)',
  medium: 'средний (3-7 предложений)',
  long: 'длинный (7+ предложений, развёрнутый)',
}

function buildSystemPrompt(
  platform: Platform,
  tone: Tone,
  length: Length,
  hashtags: boolean,
  emojis: boolean,
  language: string,
): string {
  return `Ты — профессиональный SMM-копирайтер мирового уровня. Создаёшь вирусные посты для социальных сетей.

Платформа: ${PLATFORM_DETAILS[platform]}
Тон: ${TONE_DETAILS[tone]}
Длина: ${LENGTH_DETAILS[length]}
Хештеги: ${hashtags ? 'добавь релевантные хештеги в конце' : 'без хештегов'}
Эмодзи: ${emojis ? 'используй эмодзи уместно для усиления текста' : 'без эмодзи'}
Язык ответа: ${language}

Правила:
- Пиши ТОЛЬКО готовый пост, без объяснений и комментариев
- Адаптируй контент под специфику платформы
- Делай первую строку цепляющей (hook)
- CTA (призыв к действию) в конце если уместно
- Никогда не добавляй фразы типа "Вот ваш пост:" или "Готово:" — сразу текст поста`
}

export function useStreamingGenerate() {
  const { apiKey, settings, addMessage, updateLastMessage, setGenerating } = useStore()

  const generate = async (userPrompt: string) => {
    if (!apiKey || !userPrompt.trim()) return

    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
    const { platform, tone, length, includeHashtags, includeEmojis, language } = settings

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: userPrompt,
      platform,
      tone,
      timestamp: new Date(),
    }
    addMessage(userMsg)

    const assistantMsg = {
      id: crypto.randomUUID(),
      role: 'assistant' as const,
      content: '',
      platform,
      tone,
      timestamp: new Date(),
      isStreaming: true,
    }
    addMessage(assistantMsg)
    setGenerating(true)

    try {
      const stream = client.messages.stream({
        model: 'claude-opus-4-8',
        max_tokens: 1024,
        thinking: { type: 'adaptive' },
        system: buildSystemPrompt(platform, tone, length, includeHashtags, includeEmojis, language),
        messages: [{ role: 'user', content: userPrompt }],
      })

      let fullText = ''
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          fullText += event.delta.text
          updateLastMessage(fullText)
        }
      }
      updateLastMessage(fullText, true)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Неизвестная ошибка'
      updateLastMessage(`❌ Ошибка: ${errMsg}`, true)
    } finally {
      setGenerating(false)
    }
  }

  return { generate }
}
