import * as THREE from 'three'
import type { RenderBudget } from './capabilities'
import { CameraSplineRig } from './cameraRig'
import { PALETTE, createSharedMaterials, type SharedMaterials } from './materials'
import { buildBlueprint, type BlueprintConstruct } from './sections/buildBlueprint'
import {
  buildCoreSystems,
  type CoreSystemsConstruct,
} from './sections/buildCoreSystems'
import {
  buildFoundation,
  type FoundationConstruct,
} from './sections/buildFoundation'
import { buildHorizon, type HorizonConstruct } from './sections/buildHorizon'
import { buildParticles, type ParticleField } from './sections/buildParticles'
import {
  buildProjectChambers,
  type ProjectChambersConstruct,
} from './sections/buildProjectChambers'

export interface WorldScrollState {
  globalProgress: number
  foundationProgress: number
  blueprintProgress: number
  coreProgress: number
  chambersProgress: number
  horizonProgress: number
}

export interface HoveredWorldTarget {
  type: 'skill' | 'chamber'
  id: string
  label: string
  clientX: number
  clientY: number
}

export interface WorldEngineOptions {
  canvas: HTMLCanvasElement
  budget: RenderBudget
  reducedMotion: boolean
  onHoverTarget?: (target: HoveredWorldTarget | null) => void
  onSelectSkill?: (skillId: string) => void
  onSelectChamber?: (chamberId: string, index: number) => void
  onContextLost?: () => void
}

export class WorldEngine {
  private readonly canvas: HTMLCanvasElement
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly rig: CameraSplineRig
  private readonly materials: SharedMaterials
  private readonly accentLight: THREE.PointLight

  private readonly foundation: FoundationConstruct
  private readonly blueprint: BlueprintConstruct
  private readonly coreSystems: CoreSystemsConstruct
  private readonly projectChambers: ProjectChambersConstruct
  private readonly horizon: HorizonConstruct
  private readonly particles: ParticleField

  private readonly raycaster = new THREE.Raycaster()
  private readonly pointerNdc = new THREE.Vector2(0, 0)
  private readonly smoothPointer = new THREE.Vector2(0, 0)
  private readonly camPos = new THREE.Vector3()
  private readonly camLookAt = new THREE.Vector3()

  private readonly options: WorldEngineOptions
  private budget: RenderBudget
  private reducedMotion: boolean

  private scrollState: WorldScrollState = {
    globalProgress: 0,
    foundationProgress: 1,
    blueprintProgress: 0.2,
    coreProgress: 0.15,
    chambersProgress: 0.12,
    horizonProgress: 0.1,
  }
  private targetGlobalProgress = 0
  private smoothedGlobalProgress = 0

  private selectedMilestoneId = 'cs-student'
  private selectedSkillId = 'python'
  private activeChamberIndex = 0
  private hoveredChamberId: string | null = null
  private lastHoverKey: string | null = null

  private rafId = 0
  private startTime = performance.now()
  private disposed = false

  constructor(options: WorldEngineOptions) {
    this.options = options
    this.canvas = options.canvas
    this.budget = options.budget
    this.reducedMotion = options.reducedMotion

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.budget.antialias,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this.budget.dprCap),
    )
    this.renderer.setSize(window.innerWidth, window.innerHeight, false)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.08

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(PALETTE.void)
    this.scene.fog = new THREE.FogExp2(PALETTE.void, 0.0155)

    this.camera = new THREE.PerspectiveCamera(
      46,
      window.innerWidth / Math.max(1, window.innerHeight),
      0.1,
      180,
    )
    this.rig = new CameraSplineRig()

    // Efficient 3-point lighting setup (zero shadow maps)
    const ambient = new THREE.AmbientLight(0xdbeafe, 0.55)
    this.scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(PALETTE.offWhite, 1.45)
    keyLight.position.set(16, 48, 22)
    this.scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(PALETTE.cyanSecondary, 0.85)
    rimLight.position.set(-18, 22, -16)
    this.scene.add(rimLight)

    this.accentLight = new THREE.PointLight(PALETTE.cyanElectric, 3.2, 34, 1.5)
    this.scene.add(this.accentLight)

    this.materials = createSharedMaterials()

    this.foundation = buildFoundation(this.materials)
    this.blueprint = buildBlueprint(this.materials)
    this.coreSystems = buildCoreSystems(this.materials)
    this.projectChambers = buildProjectChambers(this.materials)
    this.horizon = buildHorizon(this.materials)
    this.particles = buildParticles(this.budget.particleCount)

    this.scene.add(
      this.foundation.group,
      this.blueprint.group,
      this.coreSystems.group,
      this.projectChambers.group,
      this.horizon.group,
      this.particles.mesh,
    )

    this.bindEvents()
    this.animate()
  }

  private bindEvents() {
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('pointermove', this.handlePointerMove, {
      passive: true,
    })
    window.addEventListener('click', this.handleClick)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    this.canvas.addEventListener('webglcontextlost', this.handleContextLost)
  }

  private handleVisibilityChange = () => {
    if (this.disposed) return
    if (document.hidden) {
      window.cancelAnimationFrame(this.rafId)
      this.rafId = 0
    } else if (this.rafId === 0) {
      this.animate()
    }
  }

  private handleContextLost = (event: Event) => {
    event.preventDefault()
    this.options.onContextLost?.()
  }

  private handleResize = () => {
    if (this.disposed) return
    const width = window.innerWidth
    const height = Math.max(1, window.innerHeight)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, this.budget.dprCap),
    )
    this.renderer.setSize(width, height, false)
  }

  private isEventOverUi(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false
    return Boolean(
      target.closest(
        'button, a, input, [role="dialog"], [data-interactive-ui="true"]',
      ),
    )
  }

  private handlePointerMove = (event: PointerEvent) => {
    if (this.disposed) return
    const width = Math.max(1, window.innerWidth)
    const height = Math.max(1, window.innerHeight)
    this.pointerNdc.x = (event.clientX / width) * 2 - 1
    this.pointerNdc.y = -(event.clientY / height) * 2 + 1

    if (this.isEventOverUi(event.target)) {
      this.clearHover()
      return
    }

    this.raycastInteractive(event.clientX, event.clientY)
  }

  private handleClick = (event: MouseEvent) => {
    if (this.disposed || this.isEventOverUi(event.target)) return

    const width = Math.max(1, window.innerWidth)
    const height = Math.max(1, window.innerHeight)
    this.pointerNdc.x = (event.clientX / width) * 2 - 1
    this.pointerNdc.y = -(event.clientY / height) * 2 + 1

    const hit = this.pickInteractiveObject()
    if (!hit) return

    const { interactiveType, id, index } = hit.object.userData as {
      interactiveType?: 'skill' | 'chamber'
      id?: string
      index?: number
    }

    if (interactiveType === 'skill' && id) {
      this.options.onSelectSkill?.(id)
    } else if (
      interactiveType === 'chamber' &&
      id &&
      typeof index === 'number'
    ) {
      this.options.onSelectChamber?.(id, index)
    }
  }

  private pickInteractiveObject(): THREE.Intersection | null {
    this.raycaster.setFromCamera(this.pointerNdc, this.camera)
    const targets = [
      ...this.coreSystems.interactiveMeshes,
      ...this.projectChambers.interactiveMeshes,
    ]
    const hits = this.raycaster.intersectObjects(targets, false)
    return hits.length > 0 ? hits[0] : null
  }

  private raycastInteractive(clientX: number, clientY: number) {
    const hit = this.pickInteractiveObject()
    if (!hit) {
      this.clearHover()
      return
    }

    const { interactiveType, id, label } = hit.object.userData as {
      interactiveType?: 'skill' | 'chamber'
      id?: string
      label?: string
    }

    if (!interactiveType || !id || !label) {
      this.clearHover()
      return
    }

    this.hoveredChamberId = interactiveType === 'chamber' ? id : null
    document.body.style.cursor = 'pointer'
    const hoverKey = `${interactiveType}:${id}`
    if (this.lastHoverKey !== hoverKey) {
      this.lastHoverKey = hoverKey
    }
    this.options.onHoverTarget?.({
      type: interactiveType,
      id,
      label,
      clientX,
      clientY,
    })
  }

  private clearHover() {
    if (this.hoveredChamberId !== null || this.lastHoverKey !== null) {
      this.hoveredChamberId = null
      this.lastHoverKey = null
      document.body.style.cursor = ''
      this.options.onHoverTarget?.(null)
    }
  }

  setScrollState(state: WorldScrollState) {
    this.scrollState = state
    this.targetGlobalProgress = state.globalProgress
  }

  setSelectionState(opts: {
    selectedMilestoneId?: string
    selectedSkillId?: string
    activeChamberIndex?: number
  }) {
    if (opts.selectedMilestoneId !== undefined) {
      this.selectedMilestoneId = opts.selectedMilestoneId
    }
    if (opts.selectedSkillId !== undefined) {
      this.selectedSkillId = opts.selectedSkillId
    }
    if (opts.activeChamberIndex !== undefined) {
      this.activeChamberIndex = opts.activeChamberIndex
    }
  }

  setReducedMotion(reducedMotion: boolean) {
    this.reducedMotion = reducedMotion
  }

  updateBudget(budget: RenderBudget) {
    this.budget = budget
    this.handleResize()
  }

  private animate = () => {
    if (this.disposed) return
    this.rafId = window.requestAnimationFrame(this.animate)

    const elapsed = (performance.now() - this.startTime) * 0.001
    const motionTime = this.reducedMotion ? 0 : elapsed
    const introEase = this.reducedMotion ? 1 : Math.min(1, elapsed / 1.4)

    // Smooth camera interpolation toward scroll target
    const lerpFactor = this.reducedMotion ? 1 : 0.1
    this.smoothedGlobalProgress +=
      (this.targetGlobalProgress - this.smoothedGlobalProgress) * lerpFactor

    this.smoothPointer.lerp(this.pointerNdc, this.reducedMotion ? 0 : 0.06)

    // Pan subtly toward active project chamber (-2..+2 normalized to -1..+1)
    const chamberPanOffset = (this.activeChamberIndex - 2) * 0.5
    this.rig.sample(
      this.smoothedGlobalProgress,
      this.camera.aspect,
      chamberPanOffset,
      this.camPos,
      this.camLookAt,
    )

    if (!this.reducedMotion && !this.budget.isMobileViewport) {
      this.camPos.x += this.smoothPointer.x * 0.85
      this.camPos.y += this.smoothPointer.y * 0.45
    }

    this.camera.position.copy(this.camPos)
    this.camera.lookAt(this.camLookAt)

    // Keep accent point light floating cleanly near the camera focal elevation
    this.accentLight.position.set(
      this.camLookAt.x + 3,
      this.camLookAt.y + 3.5,
      this.camLookAt.z + 6,
    )

    // Progressive visibility gating keeps early void uncluttered and avoids wasted draws
    const foundationBuild = Math.min(
      1,
      introEase * 0.72 + this.scrollState.foundationProgress * 0.55,
    )
    this.blueprint.group.visible = this.scrollState.blueprintProgress > 0.01
    this.coreSystems.group.visible = this.scrollState.coreProgress > 0.01
    this.projectChambers.group.visible = this.scrollState.chambersProgress > 0.01
    this.horizon.group.visible = this.scrollState.horizonProgress > 0.01

    // Update modular architectural constructions
    this.foundation.update(
      motionTime,
      foundationBuild,
      this.smoothedGlobalProgress,
    )
    if (this.blueprint.group.visible) {
      this.blueprint.update(
        motionTime,
        this.scrollState.blueprintProgress,
        this.selectedMilestoneId,
      )
    }
    if (this.coreSystems.group.visible) {
      this.coreSystems.update(
        motionTime,
        this.scrollState.coreProgress,
        this.selectedSkillId,
      )
    }
    if (this.projectChambers.group.visible) {
      this.projectChambers.update(
        motionTime,
        this.scrollState.chambersProgress,
        this.activeChamberIndex,
        this.hoveredChamberId,
      )
    }
    if (this.horizon.group.visible) {
      this.horizon.update(motionTime, this.scrollState.horizonProgress)
    }
    this.particles.update(
      motionTime,
      this.smoothedGlobalProgress,
      this.reducedMotion,
    )

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    window.cancelAnimationFrame(this.rafId)
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('pointermove', this.handlePointerMove)
    window.removeEventListener('click', this.handleClick)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost)
    document.body.style.cursor = ''

    this.blueprint.dispose()
    this.coreSystems.dispose()
    this.projectChambers.dispose()
    this.horizon.dispose()
    this.particles.dispose()
    this.materials.dispose()
    this.renderer.dispose()
  }
}
