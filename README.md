# PostCraft AI — Social Media Post Generator

Professional AI-powered application for generating social media posts with real-time streaming via Claude.

---

## Quick Start

```bash
# 1. Copy the environment file
cp .env.example .env.local

# 2. Add your Anthropic API key to .env.local
ANTHROPIC_API_KEY=sk-ant-...

# 3. Install dependencies and start
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Getting an API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. **API Keys → Create Key**
3. Copy the key (starts with `sk-ant-api03-...`)
4. Paste it into `.env.local`

---

## How to Use

### 1. Select a platform in the left panel

| Platform | Character limit |
|----------|----------------|
| X / Twitter | 280 |
| Instagram | 2,200 |
| LinkedIn | 3,000 |
| Facebook | no limit |
| TikTok | 2,200 |
| Telegram | no limit |

### 2. Configure settings

- **Tone** — professional, casual, humorous, inspirational, bold
- **Length** — short / medium / long
- **Hashtags** — on/off
- **Emojis** — on/off
- **Language** — Russian, English, German and more

### 3. Describe your idea and send

Example prompts:
- `Announce a new SaaS product focused on time savings`
- `Motivational post for entrepreneurs after a setback`
- `Promote a Python programming course`

Click the 💡 bulb icon for quick prompt templates.

### 4. Working with results

- **Copy** — one-click copy of the generated post
- **Regenerate** — re-generate with the same settings
- Character counter shows whether you're within the platform's limit

---

## How It Works

```
User → ChatInput → useStreamingGenerate hook
                           ↓
                   POST /api/generate
                   (Next.js Route Handler)
                           ↓
                   Anthropic SDK (server-side)
                   claude-opus-4-8
                   thinking: adaptive
                           ↓
                   ReadableStream → chunks
                           ↓
                   Zustand store → updateLastMessage()
                           ↓
                   MessageBubble renders in real time
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styles | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| State | Zustand (persisted settings) |
| AI | Anthropic SDK + Claude Opus 4.8 |

### Key Files

```
app/
├── layout.tsx                      # root layout
├── page.tsx                        # entry page → <PostCraftApp />
└── api/generate/route.ts           # POST route handler (streaming)

src/
├── components/
│   ├── PostCraftApp.tsx            # root client component
│   ├── Sidebar.tsx                 # settings panel
│   ├── ChatInterface.tsx           # message area
│   ├── MessageBubble.tsx           # post bubble + action buttons
│   └── ChatInput.tsx               # input field + quick prompts
├── hooks/useStreamingGenerate.ts   # fetch → /api/generate
├── store/useStore.ts               # global state (Zustand)
└── types/index.ts                  # Platform, Tone, Length, Message
```

---

## Scripts

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm run start    # start production server
npm run lint     # ESLint check
```

---

## Request Cost

Uses **Claude Opus 4.8** — $5 per 1M input tokens, $25 per 1M output tokens.  
One post generation ≈ 300–800 input tokens + 100–500 output tokens → **< $0.01** per post.
