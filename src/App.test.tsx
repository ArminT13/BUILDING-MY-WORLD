import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Stage 1 — Visual foundation and responsive layout', () => {
  it('renders core portfolio identity and all five narrative sections', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /BUILDING MY WORLD\./i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Hi, I'm Armin Tayebi\./i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /From Foundations to Systems Thinking/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Interconnected Technical Stack/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Architectural Project Chambers/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /THIS WORLD IS STILL UNDER CONSTRUCTION\./i,
      }),
    ).toBeInTheDocument()
  })

  it('allows switching blueprint milestones and core system skill inspectors', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /NODE 05/i }))
    expect(
      screen.getByText(
        /Experimenting with predictive machine learning pipelines/i,
      ),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^FastAPI$/i }))
    expect(
      screen.getByRole('heading', { name: /^FastAPI$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Pydantic validation schemas, JWT auth/i),
    ).toBeInTheDocument()
  })

  it('opens the floating sector navigation drawer cleanly', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggle = screen.getByRole('button', { name: /Open sector index/i })
    await user.click(toggle)

    expect(screen.getByText(/World Elevation Index/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /04 — Chambers/i }),
    ).toBeInTheDocument()
  })
})
