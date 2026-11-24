import { describe, expect, it } from 'vitest'
import {
  computeSectionScrollState,
  resolveSectionFromProgress,
} from './useWorldScroll'

describe('Stage 3 — Scroll-driven construction state', () => {
  it('progressively unlocks architectural levels as visitor scrolls downward', () => {
    const start = computeSectionScrollState(0)
    const blueprint = computeSectionScrollState(0.27)
    const core = computeSectionScrollState(0.48)
    const chambers = computeSectionScrollState(0.7)
    const end = computeSectionScrollState(1)

    expect(start.blueprintProgress).toBe(0)
    expect(start.horizonProgress).toBe(0)
    expect(blueprint.blueprintProgress).toBeGreaterThan(0.7)
    expect(core.coreProgress).toBeGreaterThan(0.8)
    expect(chambers.chambersProgress).toBeGreaterThan(0.8)
    expect(end.horizonProgress).toBe(1)
  })

  it('resolves exact architectural sections across scroll progress', () => {
    expect(resolveSectionFromProgress(0)).toBe('foundation')
    expect(resolveSectionFromProgress(0.25)).toBe('blueprint')
    expect(resolveSectionFromProgress(0.45)).toBe('core-systems')
    expect(resolveSectionFromProgress(0.7)).toBe('project-chambers')
    expect(resolveSectionFromProgress(0.95)).toBe('horizon')
  })
})
