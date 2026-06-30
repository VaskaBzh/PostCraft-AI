import { beforeEach, describe, expect, it } from 'vitest'
import type { Message } from '@/entities/platform/types'
import { useStore } from './store'

function makeMsg(overrides?: Partial<Message>): Message {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: 'Hello',
    platform: 'instagram',
    tone: 'casual',
    timestamp: new Date(),
    ...overrides,
  }
}

beforeEach(() => {
  useStore.setState({
    messages: [],
    isGenerating: false,
    selectedModel: 'claude-opus-4-8',
    templates: [],
    pendingPrompt: null,
    analytics: {
      totalGenerations: 0,
      byPlatform: {},
      byTone: {},
      byModel: {},
      lastGeneratedAt: null,
    },
    settings: {
      platform: 'instagram',
      tone: 'casual',
      length: 'medium',
      includeHashtags: true,
      includeEmojis: true,
      language: 'Русский',
    },
  })
})

describe('addMessage', () => {
  it('adds a message to the store', () => {
    const msg = makeMsg({ content: 'test' })
    useStore.getState().addMessage(msg)
    expect(useStore.getState().messages).toHaveLength(1)
    expect(useStore.getState().messages[0].content).toBe('test')
  })

  it('trims history to 200 messages', () => {
    for (let i = 0; i < 201; i++) {
      useStore.getState().addMessage(makeMsg({ content: `msg-${i}` }))
    }
    const { messages } = useStore.getState()
    expect(messages).toHaveLength(200)
    expect(messages[0].content).toBe('msg-1')
  })
})

describe('updateLastMessage', () => {
  it('updates content of the last assistant message', () => {
    useStore
      .getState()
      .addMessage(makeMsg({ role: 'assistant', content: 'old', isStreaming: true }))
    useStore.getState().updateLastMessage('new')
    expect(useStore.getState().messages[0].content).toBe('new')
    expect(useStore.getState().messages[0].isStreaming).toBe(true)
  })

  it('sets isStreaming to false when done=true', () => {
    useStore.getState().addMessage(makeMsg({ role: 'assistant', isStreaming: true }))
    useStore.getState().updateLastMessage('final', true)
    expect(useStore.getState().messages[0].isStreaming).toBe(false)
  })

  it('does not update user messages', () => {
    useStore.getState().addMessage(makeMsg({ role: 'user', content: 'question' }))
    useStore.getState().updateLastMessage('ignored')
    expect(useStore.getState().messages[0].content).toBe('question')
  })
})

describe('clearMessages', () => {
  it('removes all messages', () => {
    useStore.getState().addMessage(makeMsg())
    useStore.getState().addMessage(makeMsg())
    useStore.getState().clearMessages()
    expect(useStore.getState().messages).toHaveLength(0)
  })
})

describe('settings', () => {
  it('setPlatform updates platform', () => {
    useStore.getState().setPlatform('twitter')
    expect(useStore.getState().settings.platform).toBe('twitter')
  })

  it('setTone updates tone', () => {
    useStore.getState().setTone('professional')
    expect(useStore.getState().settings.tone).toBe('professional')
  })

  it('setLength updates length', () => {
    useStore.getState().setLength('long')
    expect(useStore.getState().settings.length).toBe('long')
  })

  it('setSettings merges partial settings', () => {
    useStore.getState().setSettings({ includeHashtags: false, language: 'English' })
    const { settings } = useStore.getState()
    expect(settings.includeHashtags).toBe(false)
    expect(settings.language).toBe('English')
    expect(settings.tone).toBe('casual')
  })
})

describe('model', () => {
  it('setModel updates selectedModel', () => {
    useStore.getState().setModel('claude-haiku-4-5')
    expect(useStore.getState().selectedModel).toBe('claude-haiku-4-5')
  })
})

describe('templates', () => {
  it('saveTemplate adds a template', () => {
    useStore.getState().saveTemplate('My template', 'Write a post about {topic}', {
      platform: 'linkedin',
      tone: 'professional',
      length: 'long',
    })
    const { templates } = useStore.getState()
    expect(templates).toHaveLength(1)
    expect(templates[0].name).toBe('My template')
    expect(templates[0].settings.platform).toBe('linkedin')
  })

  it('deleteTemplate removes by id', () => {
    useStore
      .getState()
      .saveTemplate('T1', 'prompt', { platform: 'instagram', tone: 'casual', length: 'short' })
    const id = useStore.getState().templates[0].id
    useStore.getState().deleteTemplate(id)
    expect(useStore.getState().templates).toHaveLength(0)
  })
})

describe('pendingPrompt', () => {
  it('loadPrompt sets pendingPrompt', () => {
    useStore.getState().loadPrompt('Write about AI')
    expect(useStore.getState().pendingPrompt).toBe('Write about AI')
  })

  it('clearPendingPrompt resets to null', () => {
    useStore.getState().loadPrompt('some prompt')
    useStore.getState().clearPendingPrompt()
    expect(useStore.getState().pendingPrompt).toBeNull()
  })
})

describe('isGenerating', () => {
  it('setGenerating updates flag', () => {
    useStore.getState().setGenerating(true)
    expect(useStore.getState().isGenerating).toBe(true)
    useStore.getState().setGenerating(false)
    expect(useStore.getState().isGenerating).toBe(false)
  })
})

describe('analytics', () => {
  it('increments totalGenerations when updateLastMessage called with done=true', () => {
    useStore.getState().addMessage(makeMsg({ role: 'assistant', content: '', isStreaming: true }))
    useStore.getState().updateLastMessage('Post content', true)
    expect(useStore.getState().analytics.totalGenerations).toBe(1)
  })

  it('tracks platform in byPlatform', () => {
    useStore.getState().setPlatform('twitter')
    useStore.getState().addMessage(makeMsg({ role: 'assistant', isStreaming: true }))
    useStore.getState().updateLastMessage('Done', true)
    expect(useStore.getState().analytics.byPlatform.twitter).toBe(1)
  })

  it('tracks model in byModel', () => {
    useStore.getState().setModel('claude-haiku-4-5')
    useStore.getState().addMessage(makeMsg({ role: 'assistant', isStreaming: true }))
    useStore.getState().updateLastMessage('Done', true)
    expect(useStore.getState().analytics.byModel['claude-haiku-4-5']).toBe(1)
  })

  it('does not track error messages', () => {
    useStore.getState().addMessage(makeMsg({ role: 'assistant', isStreaming: true }))
    useStore.getState().updateLastMessage('❌ Error occurred', true)
    expect(useStore.getState().analytics.totalGenerations).toBe(0)
  })

  it('clearAnalytics resets all counters', () => {
    useStore.getState().addMessage(makeMsg({ role: 'assistant', isStreaming: true }))
    useStore.getState().updateLastMessage('Done', true)
    useStore.getState().clearAnalytics()
    const { analytics } = useStore.getState()
    expect(analytics.totalGenerations).toBe(0)
    expect(analytics.byPlatform).toEqual({})
    expect(analytics.lastGeneratedAt).toBeNull()
  })
})
