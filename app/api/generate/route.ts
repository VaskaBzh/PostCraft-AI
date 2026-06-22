import Anthropic from '@anthropic-ai/sdk'
import type { Platform, Tone, Length, AppSettings, ModelId } from '@/entities/platform/types'
import { rateLimit } from '@/shared/lib/rate-limit'
import { validateOrigin } from '@/shared/lib/origin-check'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

function buildSystemPrompt(settings: AppSettings): string {
  const { platform, tone, length, includeHashtags, includeEmojis, language } = settings
  return `Ты — профессиональный SMM-копирайтер мирового уровня. Создаёшь вирусные посты для социальных сетей.

Платформа: ${PLATFORM_DETAILS[platform]}
Тон: ${TONE_DETAILS[tone]}
Длина: ${LENGTH_DETAILS[length]}
Хештеги: ${includeHashtags ? 'добавь релевантные хештеги в конце' : 'без хештегов'}
Эмодзи: ${includeEmojis ? 'используй эмодзи уместно для усиления текста' : 'без эмодзи'}
Язык ответа: ${language}

Правила:
- Пиши ТОЛЬКО готовый пост, без объяснений и комментариев
- Адаптируй контент под специфику платформы
- Делай первую строку цепляющей (hook)
- CTA (призыв к действию) в конце если уместно
- Никогда не добавляй фразы типа "Вот ваш пост:" или "Готово:" — сразу текст поста`
}

export async function POST(request: Request) {
  try {
    if (!validateOrigin(request)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const rl = await rateLimit(request)
    if (!rl.success) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000))),
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rl.reset),
        },
      })
    }

    const { prompt, settings, model } = (await request.json()) as {
      prompt: string
      settings: AppSettings
      model?: ModelId
    }

    const selectedModel: ModelId = model ?? 'claude-opus-4-8'

    const stream = client.messages.stream({
      model: selectedModel,
      max_tokens: 1024,
      ...(selectedModel === 'claude-opus-4-8' ? { thinking: { type: 'adaptive' } } : {}),
      system: buildSystemPrompt(settings),
      messages: [{ role: 'user', content: prompt }],
    })

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
        } catch (err) {
          console.error('[api/generate] stream error:', err)
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
        'X-RateLimit-Limit': String(rl.limit),
        'X-RateLimit-Remaining': String(rl.remaining),
        'X-RateLimit-Reset': String(rl.reset),
      },
    })
  } catch (err) {
    console.error('[api/generate] error:', err)
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
