# AGENTS.md

> Этот файл поддерживается командами `/aif` и `/aif-docs`. Обновляйте при значительных изменениях структуры проекта.

## Обзор проекта

PostCraft — браузерный AI-генератор постов для социальных сетей (Instagram, Twitter, LinkedIn, Facebook, TikTok, Telegram)
с потоковой генерацией через Claude API и адаптивным мышлением.

## Технический стек

- **Язык:** TypeScript 6
- **Фреймворк:** React 19 + Vite 8
- **Стили:** TailwindCSS v4 + Framer Motion
- **Состояние:** Zustand (с persist middleware)
- **AI SDK:** @anthropic-ai/sdk (streaming + adaptive thinking)
- **Иконки:** Lucide React

## Структура проекта

```
react-test-1/
├── src/
│   ├── components/         # React-компоненты (именованные экспорты)
│   │   ├── ApiKeySetup.tsx  # Экран ввода API-ключа
│   │   ├── ChatInterface.tsx# Основной чат-интерфейс
│   │   ├── ChatInput.tsx    # Поле ввода запроса
│   │   ├── MessageBubble.tsx# Компонент сообщения
│   │   └── Sidebar.tsx      # Боковая панель с настройками
│   ├── hooks/
│   │   └── useStreamingGenerate.ts  # Хук потоковой генерации через Anthropic SDK
│   ├── store/
│   │   └── useStore.ts      # Zustand store (состояние + persist)
│   ├── types.ts             # Общие TypeScript-типы
│   ├── App.tsx              # Корневой компонент
│   ├── main.tsx             # Точка входа
│   └── index.css            # Глобальные стили
├── public/                  # Статические ресурсы
├── .ai-factory/             # AI Factory контекст
│   ├── config.yaml          # Конфигурация AI Factory
│   ├── DESCRIPTION.md       # Описание проекта
│   ├── ARCHITECTURE.md      # Архитектурные правила
│   └── rules/
│       └── base.md          # Базовые соглашения проекта
├── .agents/skills/          # Установленные навыки агентов
├── .mcp.json                # Конфигурация MCP-серверов
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Ключевые точки входа

| Файл | Назначение |
|------|-----------|
| `src/main.tsx` | Точка входа приложения |
| `src/App.tsx` | Корневой компонент, управление API-ключом |
| `src/hooks/useStreamingGenerate.ts` | Логика вызова Anthropic API и streaming |
| `src/store/useStore.ts` | Глобальное состояние (Zustand + persist) |
| `src/types.ts` | Все TypeScript-типы проекта |
| `.mcp.json` | MCP-серверы (GitHub, Chrome DevTools, Playwright) |

## Документация

| Документ | Путь | Описание |
|----------|------|----------|
| README | README.md | Лендинг проекта, быстрый старт |
| Быстрый старт | docs/getting-started.md | Установка, API-ключ, ручное тестирование |
| Настройки | docs/configuration.md | Платформы, тон, длина, хештеги, язык |
| Архитектура проекта | docs/architecture.md | Слои, схема работы, стек, паттерны |
| AI Factory описание | .ai-factory/DESCRIPTION.md | Стек, функции, архитектурные заметки |
| Архитектурные правила | .ai-factory/ARCHITECTURE.md | Правила зависимостей, анти-паттерны |
| Базовые правила | .ai-factory/rules/base.md | Соглашения по именованию и структуре |

## Файлы AI-контекста

| Файл | Назначение |
|------|-----------|
| AGENTS.md | Этот файл — структурная карта для AI-агентов |
| .ai-factory/DESCRIPTION.md | Полное описание проекта и стека |
| .ai-factory/ARCHITECTURE.md | Архитектурные правила и паттерны |
| .ai-factory/config.yaml | Конфигурация AI Factory (язык, пути, git) |
| .ai-factory/ARCHITECTURE.md | Слоевая архитектура React SPA: правила зависимостей, слои, анти-паттерны |

## Git Workflow

### Branching (GitHub Flow)

| Ветка | Назначение |
|-------|-----------|
| `main` | Всегда деплоябельный код; прямые коммиты только через PR |
| `feature/<slug>` | Новые фичи (пример: `feature/bulk-generation`) |
| `fix/<slug>` | Баг-фиксы (пример: `fix/streaming-disconnect`) |
| `chore/<slug>` | Рефакторинг, deps, tooling (пример: `chore/update-tailwind`) |
| `docs/<slug>` | Только документация |

### Conventional Commits

Формат: `<type>(<scope>): <subject>`

```
feat(chat): add platform selector to sidebar
fix(streaming): handle disconnect during generation
docs(readme): update API key instructions
chore(deps): upgrade @anthropic-ai/sdk to 0.105
```

Типы: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `build` | `ci` | `chore` | `revert`

### Хуки (Husky)

- `commit-msg` — commitlint проверяет формат сообщения
- `pre-commit` — lint-staged запускает ESLint на staged `.ts`/`.tsx` файлах

### Интерактивный коммит

`npm run commit` — запускает commitizen CLI вместо `git commit -m`

### GitHub MCP

`.mcp.json` настроен с GitHub MCP-сервером. Можно создавать issue, PR, ветки прямо из AI-сессии без браузера.

## Правила для агентов

- Декомпозируй составные команды на отдельные шаги
  - Неправильно: `git add . && git commit -m "..."` одной командой
  - Правильно: сначала `git add <файлы>`, затем `git commit -m "..."`
- Проект использует git — создавай ветки по схеме `feature/<slug>` для новых задач
- API-ключ Anthropic хранится в localStorage — не логировать и не выводить его
- Все стили — через TailwindCSS, не создавать CSS-файлы для компонентов
- Компоненты — только именованные экспорты, без default export для компонентов
