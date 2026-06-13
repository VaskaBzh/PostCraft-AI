import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { useStore } from '@/shared/model/store'
import { ChatInput } from './ChatInput'

const mockGenerate = vi.fn()
vi.mock('@/features/post-generation/hooks/useStreamingGenerate', () => ({
  useStreamingGenerate: () => ({ generate: mockGenerate }),
}))

beforeEach(() => {
  mockGenerate.mockReset()
  useStore.setState({
    messages: [],
    isGenerating: false,
    selectedModel: 'claude-sonnet-4-6',
    templates: [],
    pendingPrompt: null,
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

describe('ChatInput', () => {
  it('renders the textarea', () => {
    render(<ChatInput />)
    expect(screen.getByPlaceholderText(/Опишите тему/)).toBeInTheDocument()
  })

  it('send button is disabled when textarea is empty', () => {
    render(<ChatInput />)
    const sendBtn = screen.getAllByRole('button').at(-1)!
    expect(sendBtn).toBeDisabled()
  })

  it('send button becomes enabled when text is entered', async () => {
    render(<ChatInput />)
    const textarea = screen.getByPlaceholderText(/Опишите тему/)
    await userEvent.type(textarea, 'Привет')

    const buttons = screen.getAllByRole('button')
    const sendBtn = buttons.at(-1)!
    expect(sendBtn).not.toBeDisabled()
  })

  it('calls generate on send button click', async () => {
    mockGenerate.mockResolvedValue(undefined)
    render(<ChatInput />)
    const textarea = screen.getByPlaceholderText(/Опишите тему/)
    await userEvent.type(textarea, 'Тест промпта')
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons.at(-1)!)
    expect(mockGenerate).toHaveBeenCalledWith('Тест промпта')
  })

  it('clears textarea after submission', async () => {
    mockGenerate.mockResolvedValue(undefined)
    render(<ChatInput />)
    const textarea = screen.getByPlaceholderText(/Опишите тему/)
    await userEvent.type(textarea, 'Тест')
    fireEvent.click(screen.getAllByRole('button').at(-1)!)
    expect((textarea as HTMLTextAreaElement).value).toBe('')
  })

  it('does not call generate when isGenerating=true', async () => {
    useStore.setState({ isGenerating: true })
    render(<ChatInput />)
    const textarea = screen.getByPlaceholderText(/Опишите тему/)
    expect(textarea).toBeDisabled()
  })

  it('shows quick prompts panel on lightbulb click', async () => {
    render(<ChatInput />)
    const lightbulbBtn = screen.getAllByRole('button')[0]
    fireEvent.click(lightbulbBtn)
    expect(screen.getByText('Анонс нового продукта с акцентом на выгоды')).toBeInTheDocument()
  })

  it('selects a quick prompt on click', async () => {
    render(<ChatInput />)
    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(screen.getByText('Мотивационный пост для предпринимателей'))
    const textarea = screen.getByPlaceholderText(/Опишите тему/)
    expect((textarea as HTMLTextAreaElement).value).toBe('Мотивационный пост для предпринимателей')
  })
})
