import { useCallback, useEffect, useState } from 'react'
import { HudOverlay, type VisualQualityMode } from './components/HudOverlay'
import { ProgressSpine } from './components/ProgressSpine'
import { ProjectChamberModal } from './components/ProjectChamberModal'
import { WorldCanvas } from './components/WorldCanvas'
import { WorldSections } from './components/WorldSections'
import {
  BLUEPRINT_MILESTONES,
  CORE_SKILLS,
  PROJECT_CHAMBERS,
  type ProjectChamber,
  type SectionId,
} from './data/portfolio'
import { useWorldScroll } from './motion/useWorldScroll'

export function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState<SectionId>('foundation')
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    BLUEPRINT_MILESTONES[0].id,
  )
  const [selectedSkillId, setSelectedSkillId] = useState<string>(CORE_SKILLS[0].id)
  const [activeChamberIndex, setActiveChamberIndex] = useState<number>(0)
  const [openChamberId, setOpenChamberId] = useState<string | null>(null)
  const [qualityMode, setQualityMode] = useState<VisualQualityMode>('auto')
  const [webglAvailable, setWebglAvailable] = useState<boolean>(false)
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const { scrollStateRef, scrollToSection } = useWorldScroll({
    reducedMotion,
    scrollLocked: openChamberId !== null,
    onSectionChange: setActiveSectionId,
    onProgressPercentChange: setScrollProgress,
    onScrollChamberIndexChange: (idx) => {
      if (openChamberId === null) {
        setActiveChamberIndex(idx)
      }
    },
  })

  const handleSelectChamberFromUi = useCallback(
    (chamber: ProjectChamber, index: number) => {
      setActiveChamberIndex(index)
      setOpenChamberId(chamber.id)
    },
    [],
  )

  const handleSelectChamberFrom3D = useCallback(
    (chamberId: string, index: number) => {
      setActiveChamberIndex(index)
      setOpenChamberId(chamberId)
    },
    [],
  )

  const handleStepChamber = useCallback(
    (delta: -1 | 1) => {
      const currentIdx = PROJECT_CHAMBERS.findIndex(
        (c) => c.id === openChamberId,
      )
      const baseIdx = currentIdx >= 0 ? currentIdx : activeChamberIndex
      const nextIdx =
        (baseIdx + delta + PROJECT_CHAMBERS.length) % PROJECT_CHAMBERS.length
      setActiveChamberIndex(nextIdx)
      setOpenChamberId(PROJECT_CHAMBERS[nextIdx].id)
    },
    [openChamberId, activeChamberIndex],
  )

  const openChamberIndex = openChamberId
    ? PROJECT_CHAMBERS.findIndex((c) => c.id === openChamberId)
    : -1
  const openChamber =
    openChamberIndex >= 0 ? PROJECT_CHAMBERS[openChamberIndex] : null

  return (
    <div className="relative min-h-screen bg-[#07090E] text-[#F8FAFC]">
      <a
        href="#foundation"
        onClick={(event) => {
          event.preventDefault()
          scrollToSection('foundation')
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[#00E5FF] focus:px-4 focus:py-2 focus:font-display focus:text-xs focus:font-semibold focus:text-[#07090E]"
      >
        Skip to main architectural experience
      </a>
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
        onNavigateSection={scrollToSection}
        onToggleQualityMode={() =>
          setQualityMode((prev) => (prev === 'auto' ? 'lite' : 'auto'))
        }
      />

      <ProgressSpine
        activeSectionId={activeSectionId}
        scrollProgress={scrollProgress}
        onNavigateSection={scrollToSection}
      />

      <WorldSections
        activeSectionId={activeSectionId}
        selectedMilestoneId={selectedMilestoneId}
        selectedSkillId={selectedSkillId}
        activeChamberIndex={activeChamberIndex}
        onSelectMilestone={setSelectedMilestoneId}
        onSelectSkill={setSelectedSkillId}
        onSelectChamber={handleSelectChamberFromUi}
        onNavigateSection={scrollToSection}
      />

      <ProjectChamberModal
        project={openChamber}
        totalCount={PROJECT_CHAMBERS.length}
        currentIndex={openChamberIndex >= 0 ? openChamberIndex : 0}
        onClose={() => setOpenChamberId(null)}
        onStepChamber={handleStepChamber}
      />
    </div>
  )
}

export default App
