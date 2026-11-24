import { SECTIONS, type SectionId } from '../data/portfolio'

interface ProgressSpineProps {
  activeSectionId: SectionId
  scrollProgress: number
  onNavigateSection: (sectionId: SectionId) => void
}

export function ProgressSpine({
  activeSectionId,
  scrollProgress,
  onNavigateSection,
}: ProgressSpineProps) {
  const clamped = Math.max(0, Math.min(1, scrollProgress))

  return (
    <>
      {/* Mobile / narrow viewport horizontal architectural hairline */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] bg-[#F8FAFC]/10 lg:hidden"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#00E5FF] shadow-[0_0_12px_#00E5FF] transition-[width] duration-150 ease-out"
          style={{ width: `${(clamped * 100).toFixed(1)}%` }}
        />
      </div>

      {/* Desktop vertical architectural spine */}
      <nav
        data-interactive-ui="true"
        aria-label="Architectural elevation progress"
        className="pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex"
      >
        <div className="relative flex flex-col items-end gap-6 pr-3">
          {/* Background vertical rail */}
          <div
            className="pointer-events-none absolute right-[5px] top-2 bottom-2 w-px bg-[#F8FAFC]/15"
            aria-hidden="true"
          >
            <div
              className="w-full bg-gradient-to-b from-[#00E5FF] to-[#06B6D4] shadow-[0_0_10px_#00E5FF]"
              style={{ height: `${(clamped * 100).toFixed(1)}%` }}
            />
          </div>

          {SECTIONS.map((section) => {
            const isActive = section.id === activeSectionId
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onNavigateSection(section.id)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Jump to ${section.index} ${section.title}`}
                className="group relative flex items-center gap-3 py-1 text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-sm"
              >
                <span
                  className={`font-display text-[11px] tracking-[0.18em] uppercase transition-all duration-200 ${
                    isActive
                      ? 'translate-x-0 text-[#00E5FF] opacity-100'
                      : 'translate-x-1 text-[#F8FAFC]/55 opacity-0 group-hover:translate-x-0 group-hover:opacity-95 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'
                  }`}
                >
                  {section.index} · {section.shortLabel}
                </span>

                <span
                  className={`relative z-10 flex h-[11px] w-[11px] rotate-45 items-center justify-center border transition-all duration-200 ${
                    isActive
                      ? 'scale-110 border-[#00E5FF] bg-[#00E5FF] shadow-[0_0_14px_#00E5FF]'
                      : 'border-[#F8FAFC]/35 bg-[#07090E] group-hover:border-[#00E5FF]/80'
                  }`}
                />
              </button>
            )
          })}
        </div>

        <div className="pr-1 font-display text-[10px] tracking-[0.22em] text-[#F8FAFC]/45">
          {Math.round(clamped * 100)
            .toString()
            .padStart(3, '0')}
          %
        </div>
      </nav>
    </>
  )
}
