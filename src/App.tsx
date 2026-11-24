import { useCallback, useEffect, useState } from 'react'
import { ArchitecturalFallback } from './components/ArchitecturalFallback'
import { HudOverlay, type VisualQualityMode } from './components/HudOverlay'
import { ProgressSpine } from './components/ProgressSpine'
import { WorldSections } from './components/WorldSections'
import {
  BLUEPRINT_MILESTONES,
  CORE_SKILLS,
  SECTIONS,
  type ProjectChamber,
  type SectionId,
} from './data/portfolio'

function getSectionForProgress(progress: number): SectionId {
  for (const section of SECTIONS) {
    const [start, end] = section.progressRange
    if (progress >= start && progress <= end) {
      return section.id
    }
  }
  return 'foundation'
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

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const progress =
        maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
      setScrollProgress(progress)
      setActiveSectionId(getSectionForProgress(progress))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigateSection = useCallback((sectionId: SectionId) => {
    const element = document.getElementById(sectionId)
    if (element && typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
    }
    setActiveSectionId(sectionId)
  }, [reducedMotion])

  const handleSelectChamber = useCallback(
    (_chamber: ProjectChamber, index: number) => {
      setActiveChamberIndex(index)
    },
    [],
  )

  return (
    <div className="relative min-h-screen bg-[#07090E] text-[#F8FAFC]">
      <ArchitecturalFallback
        scrollProgress={scrollProgress}
        activeSectionId={activeSectionId}
        reducedMotion={reducedMotion}
        reason="staging"
      />

      <HudOverlay
        activeSectionId={activeSectionId}
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
        qualityMode={qualityMode}
        webglAvailable={false}
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
        onSelectChamber={handleSelectChamber}
        onNavigateSection={handleNavigateSection}
      />
    </div>
  )
}

export default App
