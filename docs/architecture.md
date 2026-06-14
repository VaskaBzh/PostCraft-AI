[← Настройки](configuration.md) · [Back to README](../README.md)

# Архитектура

PostCraft использует **слоевую архитектуру**, адаптированную для React SPA.

## Схема работы

```
Пользователь → ChatInput
                   ↓
          useStreamingGenerate (хук)
                   ↓
          Anthropic SDK → client.messages.stream()
          claude-opus-4-8 · thinking: adaptive
                   ↓
          content_block_delta события (stream)
                   ↓
          Zustand store → updateLastMessage()
                   ↓
          MessageBubble рендерит в реальном времени
```

## Структура папок

```
src/
├── components/          # Слой представления
│   ├── ApiKeySetup.tsx   # Экран ввода API-ключа (первый запуск)
│   ├── ChatInterface.tsx # Главный экран: история + ввод
│   ├── ChatInput.tsx     # Поле ввода + быстрые промпты
│   ├── MessageBubble.tsx # Пузырь сообщения + копировать/перегенерировать
│   └── Sidebar.tsx       # Боковая панель: платформа, тон, настройки
│
├── hooks/               # Слой логики приложения
│   └── useStreamingGenerate.ts  # Вызов API + потоковое обновление store
│
├── store/               # Слой состояния
│   └── useStore.ts       # Zustand store + persist (localStorage)
│
└── types.ts             # Общие типы: Platform, Tone, Length, Message
```

## Правила зависимостей

```
components → hooks → store → types
     ↓           ↓
 (Framer      (Anthropic
  Motion)      SDK)
```

| Разрешено                         | Запрещено                              |
| --------------------------------- | -------------------------------------- |
| Компонент импортирует хук         | Хук импортирует компонент              |
| Хук импортирует store             | Store импортирует хук                  |
| Хук импортирует Anthropic SDK     | Компонент вызывает SDK напрямую        |
| Любой слой импортирует `types.ts` | `types.ts` импортирует что-либо из src |

## Технологический стек

| Слой      | Технология        | Версия |
| --------- | ----------------- | ------ |
| Фреймворк | React             | 19     |
| Язык      | TypeScript        | 6      |
| Сборщик   | Vite              | 8      |
| Стили     | TailwindCSS       | v4     |
| Анимации  | Framer Motion     | 12     |
| Иконки    | Lucide React      | 1.17   |
| Состояние | Zustand           | 5      |
| AI SDK    | @anthropic-ai/sdk | 0.104  |

## Состояние приложения (Zustand store)

```typescript
interface StoreState {
  apiKey: string // Anthropic API-ключ
  messages: Message[] // история чата (не персистируется)
  settings: AppSettings // платформа, тон, длина, хештеги, эмодзи, язык
  isGenerating: boolean // идёт ли генерация прямо сейчас
}

// persist: сохраняются только apiKey + settings
// messages очищаются при перезагрузке
```

## Паттерн чтения store

```typescript
// ✅ Правильно: читать только нужное поле
const isGenerating = useStore((s) => s.isGenerating)

// ❌ Неправильно: деструктурировать весь store — лишние ре-рендеры
const { isGenerating, messages } = useStore()
```

## Потоковая генерация

`useStreamingGenerate` итерирует по событиям SDK:

```typescript
const stream = client.messages.stream({
  model: 'claude-opus-4-8',
  thinking: { type: 'adaptive' },
  system: buildSystemPrompt(...),
  messages: [{ role: 'user', content: userPrompt }],
})

for await (const event of stream) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    fullText += event.delta.text
    updateLastMessage(fullText)  // обновляет store — компонент ре-рендерится
  }
}
```

## Анти-паттерны

| Нельзя                                        | Почему                                        |
| --------------------------------------------- | --------------------------------------------- |
| Вызывать Anthropic SDK из компонента          | Логика API принадлежит хукам                  |
| Хранить историю в localStorage                | Намеренное решение: история не персистируется |
| Создавать `.module.css` для компонентов       | Все стили — через TailwindCSS                 |
| Использовать `default export` для компонентов | Только именованные экспорты                   |

## See Also

- [Быстрый старт](getting-started.md) — установка и запуск
- [Настройки](configuration.md) — платформы, тон, системный промпт
