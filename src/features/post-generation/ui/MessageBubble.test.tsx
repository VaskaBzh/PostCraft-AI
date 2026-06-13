import { describe, expect, it, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@/test/utils'
import type { Message } from '@/entities/platform/types'
import { MessageBubble } from './MessageBubble'

vi.mock('./PostPreview', () => ({
  PostPreview: ({ text }: { text: string }) => <div data-testid="post-preview">{text}</div>,
}))

const userMsg: Message = {
  id: '1',
  role: 'user',
  content: 'Напиши пост про AI',
  platform: 'instagram',
  tone: 'casual',
  timestamp: new Date(),
}

const assistantMsg: Message = {
  id: '2',
  role: 'assistant',
  content: 'Вот ваш пост про AI!',
  platform: 'twitter',
  tone: 'professional',
  timestamp: new Date(),
}

describe('MessageBubble — user', () => {
  it('renders user message content', () => {
    render(<MessageBubble message={userMsg} />)
    expect(screen.getByText('Напиши пост про AI')).toBeInTheDocument()
  })
})

describe('MessageBubble — assistant', () => {
  it('renders platform and tone labels', () => {
    render(<MessageBubble message={assistantMsg} />)
    expect(screen.getByText('twitter')).toBeInTheDocument()
    expect(screen.getByText('professional')).toBeInTheDocument()
  })

  it('renders message content', () => {
    render(<MessageBubble message={assistantMsg} />)
    expect(screen.getByText('Вот ваш пост про AI!')).toBeInTheDocument()
  })

  it('shows Генерация indicator when isStreaming', () => {
    render(<MessageBubble message={{ ...assistantMsg, isStreaming: true }} />)
    expect(screen.getByText('Генерация...')).toBeInTheDocument()
  })

  it('hides action buttons when streaming', () => {
    render(<MessageBubble message={{ ...assistantMsg, isStreaming: true }} />)
    expect(screen.queryByText('Копировать')).not.toBeInTheDocument()
  })

  it('shows copy button when not streaming', () => {
    render(<MessageBubble message={assistantMsg} />)
    expect(screen.getByText('Копировать')).toBeInTheDocument()
  })

  it('shows char count', () => {
    render(<MessageBubble message={assistantMsg} />)
    expect(screen.getByText(/символов/)).toBeInTheDocument()
  })

  it('shows over-limit warning for twitter when content exceeds 280 chars', () => {
    const longContent = 'A'.repeat(300)
    render(
      <MessageBubble message={{ ...assistantMsg, platform: 'twitter', content: longContent }} />
    )
    expect(screen.getByText('· Превышен лимит')).toBeInTheDocument()
  })

  it('does not show over-limit for facebook (no char limit)', () => {
    const longContent = 'A'.repeat(5000)
    render(
      <MessageBubble message={{ ...assistantMsg, platform: 'facebook', content: longContent }} />
    )
    expect(screen.queryByText('· Превышен лимит')).not.toBeInTheDocument()
  })

  it('shows onRegenerate button when callback provided', () => {
    const onRegenerate = vi.fn()
    render(<MessageBubble message={assistantMsg} onRegenerate={onRegenerate} />)
    const regenBtn = screen.getByText('Ещё раз')
    expect(regenBtn).toBeInTheDocument()
    fireEvent.click(regenBtn)
    expect(onRegenerate).toHaveBeenCalledTimes(1)
  })

  it('copies content to clipboard on copy button click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
    })
    render(<MessageBubble message={assistantMsg} />)
    fireEvent.click(screen.getByText('Копировать'))
    expect(writeText).toHaveBeenCalledWith('Вот ваш пост про AI!')
    await waitFor(() => expect(screen.getByText('Скопировано!')).toBeInTheDocument())
  })

  it('switches to preview view', () => {
    render(<MessageBubble message={assistantMsg} />)
    fireEvent.click(screen.getByText('Превью'))
    expect(screen.getByTestId('post-preview')).toBeInTheDocument()
  })
})
