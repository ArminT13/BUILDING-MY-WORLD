import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Stage 4 — Full Portfolio Sections & Interactive Chambers', () => {
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

  it('opens a non-disruptive Project Chamber modal, steps through chambers, and closes on Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('button', { name: /CHAMBER 01\s+StudyMate/i }),
    )

    const dialog = screen.getByRole('dialog')
    const modal = within(dialog)
    expect(dialog).toBeInTheDocument()
    expect(
      modal.getByRole('heading', { name: /^StudyMate$/i }),
    ).toBeInTheDocument()
    expect(
      modal.getByText(/Screenshot Placeholder · Architectural Schematic/i),
    ).toBeInTheDocument()
    expect(
      modal.getByRole('link', { name: /View GitHub Repo/i }),
    ).toHaveAttribute('href', 'https://github.com/ArminT13/StudyMate')
    expect(
      modal.getByText(/Live demo link placeholder/i),
    ).toBeInTheDocument()

    // Step to Chamber 02 (California House Price Prediction) which has a real live demo
    await user.click(
      modal.getByRole('button', { name: /Next project chamber/i }),
    )
    expect(
      modal.getByRole('heading', {
        name: /^California House Price Prediction$/i,
      }),
    ).toBeInTheDocument()
    expect(
      modal.getByRole('link', { name: /Open Live Demo/i }),
    ).toHaveAttribute(
      'href',
      'https://house-price-prediction-armint13.streamlit.app/',
    )

    // Step to Chamber 03 (FreelanceFlow) which also has a real live demo
    await user.click(
      modal.getByRole('button', { name: /Next project chamber/i }),
    )
    expect(
      modal.getByRole('heading', { name: /^FreelanceFlow$/i }),
    ).toBeInTheDocument()
    expect(
      modal.getByRole('link', { name: /Open Live Demo/i }),
    ).toHaveAttribute('href', 'https://armint13.pythonanywhere.com/')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
