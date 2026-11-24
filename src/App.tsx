import { useCallback, useEffect, useState } from 'react'
import { HudOverlay, type VisualQualityMode } from './components/HudOverlay'
import { ProgressSpine } from './components/ProgressSpine'
import { WorldCanvas } from './components/WorldCanvas'
import { WorldSections } from './components/WorldSections'
import {
  BLUEPRINT_MILESTONES,
  CORE_SKILLS,
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
    scrollLocked: false,
    onSectionChange: setActiveSectionId,
    onProgressPercentChange: setScrollProgress,
    onScrollChamberIndexChange: setActiveChamberIndex,
  })

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
    </div>
  )
}

export default App
