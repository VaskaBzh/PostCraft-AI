import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '@/test/utils'
import { useStore } from '@/shared/model/store'
import { Sidebar } from './Sidebar'

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/ru/',
}))

vi.mock('@/features/post-generation/ui/TemplateLibrary', () => ({
  TemplateLibrary: () => <div data-testid="template-library" />,
}))
vi.mock('@/features/post-generation/ui/HistoryPanel', () => ({
  HistoryPanel: () => <div data-testid="history-panel" />,
}))

beforeEach(() => {
  useStore.setState({
    messages: [],
    isGenerating: false,
    selectedModel: 'claude-opus-4-8',
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

describe('Sidebar', () => {
  it('renders the PostCraft AI logo', () => {
    render(<Sidebar />)
    expect(screen.getByText('PostCraft AI')).toBeInTheDocument()
  })

  it('renders all 6 platform buttons', () => {
    render(<Sidebar />)
    expect(screen.getByText('X / Twitter')).toBeInTheDocument()
    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Facebook')).toBeInTheDocument()
    expect(screen.getByText('TikTok')).toBeInTheDocument()
    expect(screen.getByText('Telegram')).toBeInTheDocument()
  })

  it('clicking a platform updates the store', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('X / Twitter'))
    expect(useStore.getState().settings.platform).toBe('twitter')
  })

  it('renders all 5 tone buttons', () => {
    render(<Sidebar />)
    expect(screen.getByText('Профессиональный')).toBeInTheDocument()
    expect(screen.getByText('Casual')).toBeInTheDocument()
    expect(screen.getByText('Юмористический')).toBeInTheDocument()
    expect(screen.getByText('Вдохновляющий')).toBeInTheDocument()
    expect(screen.getByText('Смелый')).toBeInTheDocument()
  })

  it('clicking a tone updates the store', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Профессиональный'))
    expect(useStore.getState().settings.tone).toBe('professional')
  })

  it('renders length buttons', () => {
    render(<Sidebar />)
    expect(screen.getByText('Коротко')).toBeInTheDocument()
    expect(screen.getByText('Средне')).toBeInTheDocument()
    expect(screen.getByText('Длинно')).toBeInTheDocument()
  })

  it('clicking length button updates the store', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Длинно'))
    expect(useStore.getState().settings.length).toBe('long')
  })

  it('renders language selector with initial value', () => {
    render(<Sidebar />)
    const select = screen.getByDisplayValue('Русский')
    expect(select).toBeInTheDocument()
  })

  it('changing language updates the store', () => {
    render(<Sidebar />)
    fireEvent.change(screen.getByDisplayValue('Русский'), { target: { value: 'English' } })
    expect(useStore.getState().settings.language).toBe('English')
  })

  it('renders toggle buttons for hashtags and emojis', () => {
    render(<Sidebar />)
    expect(screen.getByText('Хештеги')).toBeInTheDocument()
    expect(screen.getByText('Эмодзи')).toBeInTheDocument()
  })

  it('clicking hashtag toggle flips includeHashtags', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Хештеги').closest('button')!)
    expect(useStore.getState().settings.includeHashtags).toBe(false)
  })

  it('renders model options', () => {
    render(<Sidebar />)
    expect(screen.getByText('Haiku')).toBeInTheDocument()
    expect(screen.getByText('Sonnet')).toBeInTheDocument()
    expect(screen.getByText('Opus')).toBeInTheDocument()
  })

  it('clicking a model updates selectedModel', () => {
    render(<Sidebar />)
    fireEvent.click(screen.getByText('Haiku').closest('button')!)
    expect(useStore.getState().selectedModel).toBe('claude-haiku-4-5')
  })

  it('renders locale switcher', () => {
    render(<Sidebar />)
    expect(screen.getByTestId('locale-switcher')).toBeInTheDocument()
  })
})
