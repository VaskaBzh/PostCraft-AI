# Contributing to PostCraft

## Branching Strategy (Git Flow)

Проект использует **Git Flow**. Основная ветка разработки — `develop`.
`main` содержит только стабильные релизы.

```
main       ←── hotfix/*
  ↑              ↑
  └── release/* ─┘
           ↑
        develop  ←── feature/*
                 ←── fix/*
```

### Типы веток

| Ветка | Откуда | Куда | Назначение |
|-------|--------|------|-----------|
| `feature/<slug>` | `develop` | `develop` | Новая функциональность |
| `fix/<slug>` | `develop` | `develop` | Баг-фикс в процессе разработки |
| `release/<version>` | `develop` | `main` + `develop` | Подготовка релиза |
| `hotfix/<slug>` | `main` | `main` + `develop` | Срочный фикс в production |

### Обычный workflow (feature)

```bash
# 1. Убедиться что develop актуален
git checkout develop
git pull origin develop

# 2. Создать feature-ветку
git checkout -b feature/template-library

# 3. Работать, коммитить
npm run commit  # или git commit -m "feat(templates): add save template"

# 4. Push и PR в develop
git push -u origin feature/template-library
# → открой PR: feature/template-library → develop
```

### Hotfix workflow

```bash
# Срочный фикс — ветвиться от main
git checkout main
git checkout -b hotfix/api-key-crash

# После фикса — merge в main И в develop
git checkout main && git merge hotfix/api-key-crash
git checkout develop && git merge hotfix/api-key-crash
git branch -d hotfix/api-key-crash
```

### Release workflow

```bash
# Готовим релиз — ветвиться от develop
git checkout develop
git checkout -b release/1.0.0

# Только bugfixes и version bumps — без новых фич
npm version 1.0.0

# Merge в main (тег) и в develop
git checkout main && git merge release/1.0.0
git tag v1.0.0
git checkout develop && git merge release/1.0.0
git branch -d release/1.0.0
```

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

1. PR открывается **в `develop`**, не в `main` (исключение — hotfix и release)
2. Ветка актуальна с `develop` (`git rebase develop`)
3. Все коммиты следуют conventional commits convention
4. Описание PR объясняет **что** и **зачем** изменилось
5. Скриншот или gif для UI-изменений
