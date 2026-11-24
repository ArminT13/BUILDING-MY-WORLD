import { useEffect, useState } from 'react'
import { Compass, Menu, Sparkles, X } from 'lucide-react'
import { OWNER_PROFILE, SECTIONS, type SectionId } from '../data/portfolio'

export type VisualQualityMode = 'auto' | 'lite'

interface HudOverlayProps {
  activeSectionId: SectionId
  scrollProgress: number
  reducedMotion: boolean
  qualityMode: VisualQualityMode
  webglAvailable: boolean
  onNavigateSection: (sectionId: SectionId) => void
  onToggleQualityMode: () => void
}

export function HudOverlay({
  activeSectionId,
  scrollProgress,
  reducedMotion,
  qualityMode,
  webglAvailable,
  onNavigateSection,
  onToggleQualityMode,
}: HudOverlayProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection =
    SECTIONS.find((section) => section.id === activeSectionId) ?? SECTIONS[0]

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const handleJump = (sectionId: SectionId) => {
    setMenuOpen(false)
    onNavigateSection(sectionId)
  }

  return (
    <header
      data-interactive-ui="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-8 sm:pt-6"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
        {/* Top-left architectural identity beacon */}
        <a
          href="#foundation"
          onClick={(event) => {
            event.preventDefault()
            handleJump('foundation')
          }}
          className="pointer-events-auto group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[#F8FAFC]/10 bg-[#07090E]/80 px-3 py-1.5 backdrop-blur-md transition-colors hover:border-[#00E5FF]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] sm:gap-3 sm:px-3.5 sm:py-2"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"
            aria-hidden="true"
          />
          <span className="font-display text-[10px] font-semibold tracking-[0.14em] text-[#F8FAFC] uppercase sm:text-xs sm:tracking-[0.2em]">
            {OWNER_PROFILE.brand}
          </span>
          <span className="hidden text-xs text-[#F8FAFC]/45 md:inline">
            // {OWNER_PROFILE.name}
          </span>
        </a>

        {/* Top-right sector telemetry + minimal sector jumper */}
        <div className="pointer-events-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-[#F8FAFC]/10 bg-[#07090E]/80 px-3.5 py-2 backdrop-blur-md lg:flex">
            <Compass className="h-3.5 w-3.5 text-[#00E5FF]" aria-hidden="true" />
            <span className="font-display text-[11px] tracking-[0.18em] text-[#F8FAFC]/80 uppercase">
              {activeSection.index} / 05 · {activeSection.shortLabel}
            </span>
          </div>

          {webglAvailable && !reducedMotion && (
            <button
              type="button"
              onClick={onToggleQualityMode}
              title={
                qualityMode === 'auto'
                  ? 'Switch to simplified 3D graphics'
                  : 'Restore full 3D fidelity'
              }
              className="arch-pill inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 font-display text-[10px] tracking-[0.12em] text-[#F8FAFC]/85 uppercase sm:px-3 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]"
            >
              <Sparkles
                className="h-3 w-3 text-[#00E5FF] sm:h-3.5 sm:w-3.5"
                aria-hidden="true"
              />
              <span className="sm:hidden">
                {qualityMode === 'auto' ? '3D' : 'Lite'}
              </span>
              <span className="hidden sm:inline">
                {qualityMode === 'auto' ? '3D Full' : '3D Lite'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="world-sector-drawer"
            aria-label={menuOpen ? 'Close sector index' : 'Open sector index'}
            className="arch-pill inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-display text-[10px] tracking-[0.14em] text-[#F8FAFC] uppercase sm:gap-2 sm:px-3.5 sm:py-2 sm:text-[11px] sm:tracking-[0.18em]"
          >
            {menuOpen ? (
              <X className="h-3 w-3 text-[#00E5FF] sm:h-3.5 sm:w-3.5" aria-hidden="true" />
            ) : (
              <Menu className="h-3 w-3 text-[#00E5FF] sm:h-3.5 sm:w-3.5" aria-hidden="true" />
            )}
            <span>Sectors</span>
          </button>
        </div>
      </div>

      {/* Expandable minimal floating sector switcher */}
      {menuOpen && (
        <div
          id="world-sector-drawer"
          className="pointer-events-auto ml-auto mt-3 w-full max-w-xs rounded-2xl border border-[#00E5FF]/45 bg-[#07090E]/95 p-4 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.88)]"
        >
          <div className="mb-3 flex items-center justify-between border-b border-[#F8FAFC]/10 pb-2.5">
            <span className="font-display text-[11px] tracking-[0.2em] text-[#00E5FF] uppercase">
              World Elevation Index
            </span>
            <span className="font-display text-[11px] tracking-[0.15em] text-[#F8FAFC]/55">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          <ul className="space-y-1.5">
            {SECTIONS.map((section) => {
              const isActive = section.id === activeSectionId
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => handleJump(section.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? 'bg-[#00E5FF]/15 text-[#F8FAFC] border border-[#00E5FF]/45'
                        : 'text-[#F8FAFC]/75 hover:bg-[#F8FAFC]/5 hover:text-[#F8FAFC] border border-transparent'
                    }`}
                  >
                    <span className="font-display text-xs tracking-[0.14em] uppercase">
                      {section.index} — {section.shortLabel}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rotate-45 ${
                        isActive ? 'bg-[#00E5FF]' : 'bg-[#F8FAFC]/30'
                      }`}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </header>
  )
}
