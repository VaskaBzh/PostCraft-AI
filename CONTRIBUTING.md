# Contributing to PostCraft

## Branching Strategy (GitHub Flow)

Создавай ветку от `main`, работай в ней, открывай PR:

```bash
git checkout -b feature/my-feature
# ... commits ...
git push -u origin feature/my-feature
# → открой PR на GitHub
```

| Ветка | Когда использовать | Пример |
|-------|-------------------|--------|
| `feature/<slug>` | Новая функциональность | `feature/template-library` |
| `fix/<slug>` | Исправление бага | `fix/api-key-validation` |
| `chore/<slug>` | Зависимости, tooling | `chore/upgrade-nextjs` |
| `docs/<slug>` | Только документация | `docs/architecture-update` |

## Conventional Commits

Формат: `<type>(<scope>): <subject>`

- `type` — обязательный: `feat`, `fix`, `docs`, `refactor`, `chore`, `ci`, `test`, `perf`
- `scope` — опциональный: имя модуля или фичи
- `subject` — до 72 символов, нижний регистр, без точки в конце

```bash
# Интерактивный режим (рекомендуется)
npm run commit

# Вручную — примеры
git commit -m "feat(sidebar): add multi-model selector"
git commit -m "fix(streaming): handle AbortError on unmount"
git commit -m "chore(deps): upgrade @anthropic-ai/sdk to 0.105"
git commit -m "docs: update API key setup instructions"
```

### Запрещённые форматы

```bash
# ❌ Нет типа
git commit -m "add new feature"

# ❌ Заглавная буква в subject
git commit -m "Feat: add something"

# ❌ Subject длиннее 72 символов
git commit -m "feat: this commit message is way too long and will fail commitlint check here"
```

## Pre-commit Hooks

При каждом `git commit` автоматически запускаются:

1. **lint-staged** — ESLint на staged `.ts`/`.tsx` файлах
2. **commitlint** — проверка формата сообщения коммита

Если хук упал — исправь ошибки и попробуй снова.

## PR Guidelines

1. Ветка актуальна с `main` (`git rebase main` или `git merge main`)
2. Все коммиты следуют conventional commits convention
3. Описание PR объясняет **что** и **зачем** изменилось
4. Скриншот или gif для UI-изменений
