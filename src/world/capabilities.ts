import type { VisualQualityMode } from '../components/HudOverlay'

export type GpuTier = 'high' | 'balanced' | 'lite'

export interface RenderBudget {
  tier: GpuTier
  dprCap: number
  particleCount: number
  antialias: boolean
  enablePulseShaders: boolean
  isMobileViewport: boolean
}

export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false
  }
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2', { powerPreference: 'high-performance' }) ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return Boolean(gl)
  } catch {
    return false
  }
}

export function computeRenderBudget(
  qualityMode: VisualQualityMode,
  viewportWidth: number,
): RenderBudget {
  const isMobileViewport = viewportWidth < 768
  const isTabletViewport = viewportWidth >= 768 && viewportWidth < 1024

  if (qualityMode === 'lite') {
    return {
      tier: 'lite',
      dprCap: 1.15,
      particleCount: isMobileViewport ? 60 : 100,
      antialias: false,
      enablePulseShaders: false,
      isMobileViewport,
    }
  }

  const cores =
    typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 4
  const memory =
    typeof navigator !== 'undefined' &&
    'deviceMemory' in navigator &&
    typeof (navigator as { deviceMemory?: number }).deviceMemory === 'number'
      ? ((navigator as { deviceMemory?: number }).deviceMemory ?? 4)
      : 4

  if (isMobileViewport || cores <= 2 || memory <= 2) {
    return {
      tier: 'lite',
      dprCap: 1.25,
      particleCount: 85,
      antialias: false,
      enablePulseShaders: true,
      isMobileViewport,
    }
  }

  if (isTabletViewport || cores <= 4 || memory <= 4) {
    return {
      tier: 'balanced',
      dprCap: 1.5,
      particleCount: 200,
      antialias: true,
      enablePulseShaders: true,
      isMobileViewport,
    }
  }

  return {
    tier: 'high',
    dprCap: 2,
    particleCount: 380,
    antialias: true,
    enablePulseShaders: true,
    isMobileViewport,
  }
}
