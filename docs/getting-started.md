[Back to README](../README.md) · [Configuration →](configuration.md)

# Getting Started

## Requirements

| Dependency        | Version                                                |
| ----------------- | ------------------------------------------------------ |
| Node.js           | 22+                                                    |
| npm               | 10+                                                    |
| Anthropic API key | [console.anthropic.com](https://console.anthropic.com) |

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/VaskaBzh/PostCraft-AI.git
cd PostCraft-AI

# 2. Install dependencies
npm install

# 3. Copy and configure the environment file
cp .env.example .env.local
# Open .env.local and set your API key:
# ANTHROPIC_API_KEY=sk-ant-api03-...

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000**.

## Getting an API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. **API Keys → Create Key**
3. Copy the key (starts with `sk-ant-api03-...`)
4. Paste it into `.env.local`

The key is read server-side only — it is never sent to the browser.

## First Post

1. Open the app and confirm the sidebar shows a platform selector (Twitter/X is default)
2. Configure tone, length, hashtags/emojis in the sidebar
3. Type your post idea in the input field at the bottom
4. Press `Ctrl+Enter` or click the send button
5. Watch the text stream character-by-character as Claude generates it

## Scripts

```bash
npm run dev           # dev server at http://localhost:3000
npm run build         # production build (outputs to .next/)
npm run start         # start production server
npm run lint          # ESLint check on src/
npm run test          # Vitest unit tests
npm run test:coverage # unit tests with coverage (≥80% threshold enforced)
npm run e2e           # Playwright E2E tests (requires ANTHROPIC_API_KEY)
npm run e2e:ui        # Playwright UI mode for debugging
```

## Manual Testing Checklist

### API key screen

1. Open DevTools → Application → Local Storage → `postcraft-store`
2. Delete `apiKey`, reload the page — the API key input screen should appear
3. Enter an invalid key (not starting with `sk-ant-`) — an error should display
4. Enter a valid key — the main chat interface should load

### Real-time streaming

1. Send a prompt
2. Text should stream character-by-character (observe the shimmer cursor)
3. Copy and regenerate buttons appear only after generation completes

### Platform character counter

1. Select Twitter/X and generate a long post
2. The character counter should warn when the 280-character limit is exceeded

### Quick prompts

1. Click the 💡 icon left of the input field
2. Select a template — it should fill the input field

### History clear

1. Click **Очистить историю** in the sidebar
2. All messages are removed; API key and settings remain

## See Also

- [Configuration](configuration.md) — platforms, tones, length, hashtags, language
- [Architecture](architecture.md) — how the app works under the hood
