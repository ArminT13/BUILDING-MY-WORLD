import { useCallback, useEffect, useRef, useState } from 'react'
import { HudOverlay, type VisualQualityMode } from './components/HudOverlay'
import { ProgressSpine } from './components/ProgressSpine'
import { WorldCanvas } from './components/WorldCanvas'
import { WorldSections } from './components/WorldSections'
import {
  BLUEPRINT_MILESTONES,
  CORE_SKILLS,
  SECTIONS,
  type ProjectChamber,
  type SectionId,
} from './data/portfolio'
import type { WorldScrollState } from './world/WorldEngine'

function getSectionForProgress(progress: number): SectionId {
  for (const section of SECTIONS) {
    const [start, end] = section.progressRange
    if (progress >= start && progress <= end) {
      return section.id
    }
  }
  return 'foundation'
}

function computeSectionProgresses(globalProgress: number): WorldScrollState {
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
  return {
    globalProgress: clamp01(globalProgress),
    foundationProgress: clamp01(0.35 + globalProgress * 4.5),
    blueprintProgress: clamp01((globalProgress - 0.1) / 0.25),
    coreProgress: clamp01((globalProgress - 0.3) / 0.25),
    chambersProgress: clamp01((globalProgress - 0.52) / 0.26),
    horizonProgress: clamp01((globalProgress - 0.78) / 0.22),
  }
}

export function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState<SectionId>('foundation')
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    BLUEPRINT_MILESTONES[0].id,
  )
  const [selectedSkillId, setSelectedSkillId] = useState<string>(CORE_SKILLS[0].id)
  const [activeChamberIndex, setActiveChamberIndex] = useState<number>(0)
  const [qualityMode, setQualityMode] = useState<VisualQualityMode>('auto')
  const [webglAvailable, setWebglAvailable] = useState<boolean>(false)
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  const scrollStateRef = useRef<WorldScrollState>(computeSectionProgresses(0))

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const progress =
        maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
      scrollStateRef.current = computeSectionProgresses(progress)
      setScrollProgress(progress)
      setActiveSectionId(getSectionForProgress(progress))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigateSection = useCallback(
    (sectionId: SectionId) => {
      const element = document.getElementById(sectionId)
      if (element && typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
      }
      setActiveSectionId(sectionId)
    },
    [reducedMotion],
  )

  const handleSelectChamberFromUi = useCallback(
    (_chamber: ProjectChamber, index: number) => {
      setActiveChamberIndex(index)
    },
    [],
  )

  const handleSelectChamberFrom3D = useCallback(
    (_chamberId: string, index: number) => {
      setActiveChamberIndex(index)
    },
    [],
  )

  return (
    <div className="relative min-h-screen bg-[#07090E] text-[#F8FAFC]">
      <WorldCanvas
        scrollStateRef={scrollStateRef}
        scrollProgress={scrollProgress}
        activeSectionId={activeSectionId}
        selectedMilestoneId={selectedMilestoneId}
        selectedSkillId={selectedSkillId}
        activeChamberIndex={activeChamberIndex}
        reducedMotion={reducedMotion}
        qualityMode={qualityMode}
        onWebGLAvailabilityChange={setWebglAvailable}
        onSelectSkill={setSelectedSkillId}
        onSelectChamber={handleSelectChamberFrom3D}
      />

      <HudOverlay
        activeSectionId={activeSectionId}
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
        qualityMode={qualityMode}
        webglAvailable={webglAvailable}
        onNavigateSection={handleNavigateSection}
        onToggleQualityMode={() =>
          setQualityMode((prev) => (prev === 'auto' ? 'lite' : 'auto'))
        }
      />

      <ProgressSpine
        activeSectionId={activeSectionId}
        scrollProgress={scrollProgress}
        onNavigateSection={handleNavigateSection}
      />

      <WorldSections
        activeSectionId={activeSectionId}
        selectedMilestoneId={selectedMilestoneId}
        selectedSkillId={selectedSkillId}
        activeChamberIndex={activeChamberIndex}
        onSelectMilestone={setSelectedMilestoneId}
        onSelectSkill={setSelectedSkillId}
        onSelectChamber={handleSelectChamberFromUi}
        onNavigateSection={handleNavigateSection}
      />
    </div>
  )
}

export default App
