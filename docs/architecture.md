[← Configuration](configuration.md) · [Back to README](../README.md)

# Architecture

PostCraft uses a **server-client split** built on Next.js App Router. The Anthropic API key lives only on the server; the browser never touches it.

## Request Flow

```
User input
    ↓
ChatInput (client component)
    ↓
useStreamingGenerate hook  →  POST /api/generate
                                      ↓
                              Next.js Route Handler
                              app/api/generate/route.ts
                              (server-side, reads ANTHROPIC_API_KEY from env)
                                      ↓
                              @anthropic-ai/sdk
                              client.messages.stream()
                              model: claude-opus-4-8
                              thinking: adaptive
                                      ↓
                              ReadableStream → text chunks
                                      ↓
                              Zustand store → updateLastMessage()
                                      ↓
                          MessageBubble renders in real time
```

## Folder Structure

```
app/                              # Next.js App Router
├── layout.tsx                    # root layout (server component)
├── page.tsx                      # entry → <PostCraftApp />
└── api/generate/
    └── route.ts                  # POST handler — streaming (server-side)

src/                              # Feature-Sliced Design (FSD-inspired)
├── entities/                     # business domain — types and constants
│   └── platform/
│       ├── types.ts              # Platform, Tone, Length, Message, AppSettings
│       └── constants.tsx         # PLATFORMS, TONES, LENGTHS, char limits, icons
│
├── features/                     # user-facing features (depend on entities + shared)
│   └── post-generation/
│       ├── hooks/
│       │   ├── useStreamingGenerate.ts   # fetch → /api/generate, stream → store
│       │   └── useBulkGenerate.ts        # generate for all platforms at once
│       └── ui/
│           ├── ChatInterface.tsx         # message list + input area
│           ├── ChatInput.tsx             # text input + quick-prompt picker
│           ├── MessageBubble.tsx         # post bubble + copy/regenerate
│           ├── BulkGenerationView.tsx    # bulk mode layout
│           ├── HistoryPanel.tsx          # chat history panel
│           ├── PostPreview.tsx           # visual platform preview
│           └── TemplateLibrary.tsx       # prompt template picker
│
└── shared/                       # reusable infrastructure (no feature dependencies)
    ├── model/
    │   └── store.ts              # Zustand store + persist (localStorage)
    └── ui/
        ├── PostCraftApp.tsx      # app shell — sidebar + feature layout
        └── Sidebar.tsx           # platform + tone + settings panel
```

## Dependency Rules

```
app/ → shared/ → features/ → entities/
  ↓
Route Handler (server boundary)
```

| Allowed                                                | Forbidden                                      |
| ------------------------------------------------------ | ---------------------------------------------- |
| `features` imports from `entities` and `shared/model`  | Feature imports from another feature           |
| `shared/ui` imports from `entities` and `shared/model` | `shared` imports from `features`               |
| `app/page.tsx` imports from `shared/ui`                | `app/` imports directly from `features/`       |
| Route Handler reads `process.env`                      | Client code reads `process.env`                |
| Any layer imports from `entities/`                     | `entities/` imports anything from other layers |

## Tech Stack

| Layer      | Technology         | Version |
| ---------- | ------------------ | ------- |
| Framework  | Next.js App Router | 16      |
| Language   | TypeScript         | 6       |
| Styles     | TailwindCSS        | v4      |
| Animations | Framer Motion      | 12      |
| Icons      | Lucide React       | 1.17    |
| State      | Zustand            | 5       |
| AI SDK     | @anthropic-ai/sdk  | 0.104   |

## Zustand Store Shape

```typescript
interface StoreState {
  apiKey: string // Anthropic API key
  messages: Message[] // chat history (not persisted — clears on reload)
  settings: AppSettings // platform, tone, length, hashtags, emojis, language
  isGenerating: boolean // true while a stream is in flight
}

// persist: saves only apiKey + settings to localStorage key "postcraft-store"
```

### Selector Pattern

```typescript
// Correct — subscribe to only the field you need
const isGenerating = useStore((s) => s.isGenerating)

// Wrong — subscribes to the entire store, causes unnecessary re-renders
const { isGenerating, messages } = useStore()
```

## Streaming Implementation

`useStreamingGenerate` reads the `ReadableStream` returned by the Route Handler:

```typescript
const response = await fetch('/api/generate', { method: 'POST', body: ... })
const reader = response.body!.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  fullText += decoder.decode(value, { stream: true })
  updateLastMessage(fullText)   // Zustand update → MessageBubble re-renders
}
```

## Anti-Patterns

| Don't                               | Why                                    |
| ----------------------------------- | -------------------------------------- |
| Call Anthropic SDK from a component | API logic belongs in the Route Handler |
| Store chat history in localStorage  | Intentional: history is session-only   |
| Create `.module.css` for components | All styles go through TailwindCSS      |
| Use `default export` for components | Named exports only                     |
| Read `process.env` in client code   | Server-only; use Route Handler instead |

## See Also

- [Getting Started](getting-started.md) — setup and first run
- [Configuration](configuration.md) — how settings are composed into the system prompt
- [ADR Index](adr/README.md) — why these decisions were made
