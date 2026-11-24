import { useEffect, useRef, useState } from 'react'
import type { VisualQualityMode } from './HudOverlay'
import { ArchitecturalFallback } from './ArchitecturalFallback'
import type { SectionId } from '../data/portfolio'
import {
  computeRenderBudget,
  detectWebGLSupport,
} from '../world/capabilities'
import type {
  HoveredWorldTarget,
  WorldEngine,
  WorldScrollState,
} from '../world/WorldEngine'

interface WorldCanvasProps {
  scrollStateRef: React.MutableRefObject<WorldScrollState>
  scrollProgress: number
  activeSectionId: SectionId
  selectedMilestoneId: string
  selectedSkillId: string
  activeChamberIndex: number
  reducedMotion: boolean
  qualityMode: VisualQualityMode
  onWebGLAvailabilityChange?: (available: boolean) => void
  onSelectSkill: (skillId: string) => void
  onSelectChamber: (chamberId: string, index: number) => void
}

export function WorldCanvas({
  scrollStateRef,
  scrollProgress,
  activeSectionId,
  selectedMilestoneId,
  selectedSkillId,
  activeChamberIndex,
  reducedMotion,
  qualityMode,
  onWebGLAvailabilityChange,
  onSelectSkill,
  onSelectChamber,
}: WorldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<WorldEngine | null>(null)
  const [webglReady, setWebglReady] = useState<boolean>(() =>
    detectWebGLSupport(),
  )
  const [hoveredTarget, setHoveredTarget] =
    useState<HoveredWorldTarget | null>(null)

  const latestPropsRef = useRef({
    scrollStateRef,
    selectedMilestoneId,
    selectedSkillId,
    activeChamberIndex,
    reducedMotion,
    qualityMode,
    onSelectSkill,
    onSelectChamber,
  })

  useEffect(() => {
    latestPropsRef.current = {
      scrollStateRef,
      selectedMilestoneId,
      selectedSkillId,
      activeChamberIndex,
      reducedMotion,
      qualityMode,
      onSelectSkill,
      onSelectChamber,
    }
  })

  useEffect(() => {
    onWebGLAvailabilityChange?.(webglReady)
  }, [webglReady, onWebGLAvailabilityChange])

  // Lazily mount the Three.js engine only when WebGL is available
  useEffect(() => {
    if (!webglReady || !canvasRef.current) return

    let cancelled = false
    let syncTimer = 0

    void import('../world/WorldEngine').then(({ WorldEngine }) => {
      if (cancelled || !canvasRef.current) return

      const initial = latestPropsRef.current
      try {
        const budget = computeRenderBudget(initial.qualityMode, window.innerWidth)
        const engine = new WorldEngine({
          canvas: canvasRef.current,
          budget,
          reducedMotion: initial.reducedMotion,
          onHoverTarget: setHoveredTarget,
          onSelectSkill: (id) => latestPropsRef.current.onSelectSkill(id),
          onSelectChamber: (id, idx) =>
            latestPropsRef.current.onSelectChamber(id, idx),
          onContextLost: () => setWebglReady(false),
        })

        engine.setScrollState(initial.scrollStateRef.current)
        engine.setSelectionState({
          selectedMilestoneId: initial.selectedMilestoneId,
          selectedSkillId: initial.selectedSkillId,
          activeChamberIndex: initial.activeChamberIndex,
        })
        engineRef.current = engine

        // Continuously push ref-based scroll state into engine without React re-renders
        const syncScroll = () => {
          if (cancelled || !engineRef.current) return
          engineRef.current.setScrollState(
            latestPropsRef.current.scrollStateRef.current,
          )
          syncTimer = window.requestAnimationFrame(syncScroll)
        }
        syncTimer = window.requestAnimationFrame(syncScroll)
      } catch {
        setWebglReady(false)
      }
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(syncTimer)
      engineRef.current?.dispose()
      engineRef.current = null
      setHoveredTarget(null)
    }
  }, [webglReady])

  useEffect(() => {
    engineRef.current?.setSelectionState({
      selectedMilestoneId,
      selectedSkillId,
      activeChamberIndex,
    })
  }, [selectedMilestoneId, selectedSkillId, activeChamberIndex])

  useEffect(() => {
    engineRef.current?.setReducedMotion(reducedMotion)
  }, [reducedMotion])

  useEffect(() => {
    if (!engineRef.current) return
    engineRef.current.updateBudget(
      computeRenderBudget(qualityMode, window.innerWidth),
    )
  }, [qualityMode])

  if (!webglReady) {
    return (
      <ArchitecturalFallback
        scrollProgress={scrollProgress}
        activeSectionId={activeSectionId}
        reducedMotion={reducedMotion}
        reason={reducedMotion ? 'reduced-motion' : 'webgl-unavailable'}
      />
    )
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 block h-full w-full"
        aria-hidden="true"
      />

      {/* Lightweight 3D Raycast Hover Tooltip */}
      {hoveredTarget && (
        <div
          className="pointer-events-none fixed z-40 -translate-y-full rounded-lg border border-[#00E5FF]/55 bg-[#07090E]/90 px-3 py-1.5 backdrop-blur-md shadow-[0_0_24px_rgba(0,229,255,0.2)]"
          style={{
            left: Math.min(window.innerWidth - 190, hoveredTarget.clientX + 14),
            top: Math.max(44, hoveredTarget.clientY - 10),
          }}
        >
          <span className="block font-display text-[9px] tracking-[0.2em] text-[#00E5FF] uppercase">
            {hoveredTarget.type === 'chamber'
              ? 'Click to inspect chamber'
              : 'Click to inspect skill'}
          </span>
          <span className="block font-display text-xs font-medium text-[#F8FAFC]">
            {hoveredTarget.label}
          </span>
        </div>
      )}
    </>
  )
}
