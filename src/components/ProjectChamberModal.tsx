import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  ExternalLink,
  X,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ProjectChamber } from '../data/portfolio'
import { ProjectSchematicPreview } from './ProjectSchematicPreview'

interface ProjectChamberModalProps {
  project: ProjectChamber | null
  totalCount: number
  currentIndex: number
  onClose: () => void
  onStepChamber: (delta: -1 | 1) => void
}

export function ProjectChamberModal({
  project,
  totalCount,
  currentIndex,
  onClose,
  onStepChamber,
}: ProjectChamberModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!project) return
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowLeft') {
        onStepChamber(-1)
      } else if (event.key === 'ArrowRight') {
        onStepChamber(1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [project, onClose, onStepChamber])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090E]/75 p-4 backdrop-blur-md sm:p-6"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="chamber-modal-title"
        data-interactive-ui="true"
        className="arch-panel arch-panel-active relative max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6 sm:p-8"
      >
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F8FAFC]/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#00E5FF]/45 bg-[#00E5FF]/12 px-3 py-1 font-display text-[11px] font-medium tracking-[0.18em] text-[#00E5FF] uppercase">
              {project.chamberCode}
            </span>
            <span className="font-display text-xs tracking-[0.14em] text-[#06B6D4] uppercase">
              {project.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStepChamber(-1)}
              aria-label="Previous project chamber"
              className="arch-pill rounded-full p-2 text-[#F8FAFC]/80"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="font-display text-[11px] tracking-[0.14em] text-[#F8FAFC]/55">
              {currentIndex + 1} / {totalCount}
            </span>
            <button
              type="button"
              onClick={() => onStepChamber(1)}
              aria-label="Next project chamber"
              className="arch-pill rounded-full p-2 text-[#F8FAFC]/80"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close project chamber"
              className="arch-pill ml-1 rounded-full p-2 text-[#F8FAFC]"
            >
              <X className="h-4 w-4 text-[#00E5FF]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-6">
          <h2
            id="chamber-modal-title"
            className="font-display text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl"
          >
            {project.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#F8FAFC]/80 sm:text-base">
            {project.shortDescription}
          </p>
        </div>

        {/* Visual Preview / Architectural Schematic Placeholder */}
        <div className="mt-6">
          <ProjectSchematicPreview project={project} />
        </div>

        {/* Verified Highlights & Technologies */}
        <div className="mt-6 grid gap-6 sm:grid-cols-12">
          <div className="sm:col-span-7">
            <h3 className="font-display text-xs font-medium tracking-[0.18em] text-[#00E5FF] uppercase">
              Verified Implementation Highlights
            </h3>
            <ul className="mt-3 space-y-2">
              {project.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-[#F8FAFC]/80 sm:text-sm"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#00E5FF]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-5">
            <h3 className="font-display text-xs font-medium tracking-[0.18em] text-[#00E5FF] uppercase">
              Technologies Used
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-[#F8FAFC]/14 bg-[#07090E]/75 px-2.5 py-1 font-display text-xs text-[#F8FAFC]/90"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Links Footer */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#F8FAFC]/10 pt-5">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#00E5FF] px-5 py-2.5 font-display text-xs font-semibold tracking-[0.14em] text-[#07090E] uppercase shadow-[0_0_24px_rgba(0,229,255,0.28)] transition-colors hover:bg-[#38EEFF]"
          >
            <Code2 className="h-4 w-4" aria-hidden="true" />
            <span>View GitHub Repo</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          {project.liveDemoUrl ? (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="arch-pill inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-xs tracking-[0.14em] text-[#F8FAFC] uppercase"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#00E5FF]" aria-hidden="true" />
              <span>Open Live Demo</span>
            </a>
          ) : (
            <div className="rounded-xl border border-dashed border-[#F8FAFC]/20 bg-[#07090E]/60 px-3.5 py-2 text-xs text-[#F8FAFC]/60">
              {project.liveDemoPlaceholder}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
