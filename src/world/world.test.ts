import { describe, expect, it } from 'vitest'
import { CameraSplineRig } from './cameraRig'
import { computeRenderBudget, detectWebGLSupport } from './capabilities'

describe('Stage 2 — 3D World Architecture & GPU Capabilities', () => {
  it('samples rising camera trajectory from foundation to horizon panorama', () => {
    const rig = new CameraSplineRig()
    const start = rig.sample(0, 1.77)
    const mid = rig.sample(0.5, 1.77)
    const end = rig.sample(1, 1.77)

    expect(start.position.y).toBeLessThan(mid.position.y)
    expect(mid.position.y).toBeLessThan(end.position.y)
    // Horizon camera pulls back substantially along Z to show entire structure
    expect(end.position.z).toBeGreaterThan(25)
  })

  it('adapts camera framing for narrow mobile viewports and project chamber focus', () => {
    const rig = new CameraSplineRig()
    const desktop = rig.sample(0.7, 1.6, 1)
    const mobile = rig.sample(0.7, 0.5, 1)
    const chamberLeft = rig.sample(0.71, 1.6, -1)
    const chamberRight = rig.sample(0.71, 1.6, 1)

    expect(mobile.position.z).toBeGreaterThan(desktop.position.z)
    expect(chamberLeft.lookAt.x).toBeLessThan(chamberRight.lookAt.x)
  })

  it('computes safe GPU render budgets for lite, mobile, and desktop modes', () => {
    const mobile = computeRenderBudget('auto', 390)
    const lite = computeRenderBudget('lite', 1440)
    const desktop = computeRenderBudget('auto', 1440)

    expect(mobile.isMobileViewport).toBe(true)
    expect(mobile.particleCount).toBeLessThanOrEqual(100)
    expect(lite.tier).toBe('lite')
    expect(lite.antialias).toBe(false)
    expect(desktop.dprCap).toBeGreaterThanOrEqual(1.5)
  })

  it('safely detects WebGL availability without throwing in jsdom', () => {
    expect(typeof detectWebGLSupport()).toBe('boolean')
  })
})
