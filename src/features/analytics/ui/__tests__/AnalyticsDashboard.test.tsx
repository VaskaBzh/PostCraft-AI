import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { useStore } from '@/shared/model/store'
import messages from '../../../../../messages/en.json'
import { AnalyticsDashboard } from '../AnalyticsDashboard'

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  )
}

beforeEach(() => {
  useStore.setState({
    analytics: {
      totalGenerations: 0,
      byPlatform: {},
      byTone: {},
      byModel: {},
      lastGeneratedAt: null,
    },
  })
})

describe('AnalyticsDashboard', () => {
  it('shows empty state when no generations', () => {
    renderWithIntl(<AnalyticsDashboard />)
    expect(screen.getByText(/No data yet/i)).toBeInTheDocument()
  })

  it('shows total count when generations exist', () => {
    useStore.setState({
      analytics: {
        totalGenerations: 42,
        byPlatform: { instagram: 5 },
        byTone: { casual: 3 },
        byModel: { 'claude-opus-4-8': 1 },
        lastGeneratedAt: Date.now(),
      },
    })
    renderWithIntl(<AnalyticsDashboard />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('shows title', () => {
    renderWithIntl(<AnalyticsDashboard />)
    expect(screen.getByText('Usage Analytics')).toBeInTheDocument()
  })
})
