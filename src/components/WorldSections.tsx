import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Layers,
  Mail,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { useState } from 'react'
import {
  BLUEPRINT_MILESTONES,
  CONTACT_LINKS,
  CORE_SKILLS,
  OWNER_PROFILE,
  PROJECT_CHAMBERS,
  type ProjectChamber,
  type SectionId,
} from '../data/portfolio'

interface WorldSectionsProps {
  activeSectionId: SectionId
  selectedMilestoneId: string
  selectedSkillId: string
  activeChamberIndex: number
  onSelectMilestone: (id: string) => void
  onSelectSkill: (id: string) => void
  onSelectChamber: (chamber: ProjectChamber, index: number) => void
  onNavigateSection: (sectionId: SectionId) => void
}

export function WorldSections({
  activeSectionId,
  selectedMilestoneId,
  selectedSkillId,
  activeChamberIndex,
  onSelectMilestone,
  onSelectSkill,
  onSelectChamber,
  onNavigateSection,
}: WorldSectionsProps) {
  const [copiedPlaceholder, setCopiedPlaceholder] = useState(false)

  const selectedMilestone =
    BLUEPRINT_MILESTONES.find((m) => m.id === selectedMilestoneId) ??
    BLUEPRINT_MILESTONES[0]

  const selectedSkill =
    CORE_SKILLS.find((s) => s.id === selectedSkillId) ?? CORE_SKILLS[0]

  const handleCopyEmailPlaceholder = async (email: string) => {
    try {
      await navigator.clipboard?.writeText(email)
      setCopiedPlaceholder(true)
      window.setTimeout(() => setCopiedPlaceholder(false), 1800)
    } catch {
      setCopiedPlaceholder(true)
      window.setTimeout(() => setCopiedPlaceholder(false), 1800)
    }
  }

  return (
    <main className="relative z-10">
      {/* SECTION 01 — THE FOUNDATION */}
      <section
        id="foundation"
        data-section-id="foundation"
        aria-labelledby="foundation-heading"
        className="relative min-h-[165vh]"
      >
        <div className="sticky top-0 flex min-h-[100dvh] items-center px-4 pt-24 pb-16 sm:px-8 lg:pl-14 lg:pr-44 xl:pr-48">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#07090E]/75 px-3 py-1.5 backdrop-blur-md sm:gap-2.5 sm:px-3.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                <span className="font-display text-[10px] font-medium tracking-[0.16em] text-[#00E5FF] uppercase sm:text-[11px] sm:tracking-[0.22em]">
                  01 // The Foundation · Interactive 3D
                </span>
              </div>

              <h1
                id="foundation-heading"
                className="font-display text-4xl font-bold tracking-[-0.03em] text-[#F8FAFC] sm:text-6xl lg:text-7xl"
              >
                {OWNER_PROFILE.introHeadline}
              </h1>

              <div className="mt-6 space-y-3 text-base leading-relaxed text-[#F8FAFC]/85 sm:text-lg">
                <p className="font-display text-xl font-medium text-[#00E5FF] sm:text-2xl">
                  {OWNER_PROFILE.introGreeting}
                </p>
                <p className="max-w-xl text-[#F8FAFC]/75">
                  {OWNER_PROFILE.introStatement}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateSection('blueprint')}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#00E5FF] px-5 py-2.5 font-display text-xs font-semibold tracking-[0.16em] text-[#07090E] uppercase shadow-[0_0_28px_rgba(0,229,255,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[#38EEFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F8FAFC]"
                >
                  <span>Explore The Construct</span>
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>

                <a
                  href={OWNER_PROFILE.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="arch-pill inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-xs tracking-[0.16em] text-[#F8FAFC]/85 uppercase"
                >
                  <Code2 className="h-3.5 w-3.5 text-[#00E5FF]" aria-hidden="true" />
                  <span>GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#F8FAFC]/50" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={() => onNavigateSection('horizon')}
                  className="arch-pill inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-xs tracking-[0.16em] text-[#F8FAFC]/85 uppercase"
                >
                  <Mail className="h-3.5 w-3.5 text-[#00E5FF]" aria-hidden="true" />
                  <span>Contact</span>
                </button>
              </div>

              <div className="mt-10 flex items-center gap-4 text-xs text-[#F8FAFC]/50">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block h-6 w-[1px] bg-gradient-to-b from-[#00E5FF] to-transparent"
                    aria-hidden="true"
                  />
                  Scroll down to construct each architectural level · Interactive nodes active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02 — THE BLUEPRINT */}
      <section
        id="blueprint"
        data-section-id="blueprint"
        aria-labelledby="blueprint-heading"
        className="relative min-h-[195vh]"
      >
        <div className="sticky top-0 flex min-h-[100dvh] items-center px-4 py-24 sm:px-8 lg:pl-14 lg:pr-44 xl:pr-48">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-12">
            <div
              data-reveal
              data-interactive-ui="true"
              className="arch-panel rounded-2xl p-6 sm:p-8 lg:col-span-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-[11px] font-medium tracking-[0.22em] text-[#00E5FF] uppercase">
                  02 // The Blueprint
                </span>
                <span className="font-display text-[11px] tracking-[0.18em] text-[#F8FAFC]/45 uppercase">
                  Development Trajectory
                </span>
              </div>

              <h2
                id="blueprint-heading"
                className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl"
              >
                From Foundations to Systems Thinking
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#F8FAFC]/70 sm:text-base">
                Each wireframe axis marks a real stage in how I learn and build—grounded
                in Computer Science fundamentals, dual-language practice, and practical
                software engineering.
              </p>

              {/* Milestone Selector Timeline */}
              <div className="mt-6 space-y-2.5" role="list">
                {BLUEPRINT_MILESTONES.map((milestone) => {
                  const isSelected = milestone.id === selectedMilestone.id
                  return (
                    <button
                      key={milestone.id}
                      type="button"
                      onClick={() => onSelectMilestone(milestone.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                        isSelected
                          ? 'border-[#00E5FF]/70 bg-[#00E5FF]/10 shadow-[0_0_24px_rgba(0,229,255,0.12)]'
                          : 'border-[#F8FAFC]/10 bg-[#07090E]/55 hover:border-[#00E5FF]/35 hover:bg-[#07090E]/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-display text-[11px] tracking-[0.18em] ${
                              isSelected ? 'text-[#00E5FF]' : 'text-[#F8FAFC]/45'
                            }`}
                          >
                            {milestone.code}
                          </span>
                          <span className="font-display text-sm font-medium text-[#F8FAFC] sm:text-base">
                            {milestone.title}
                          </span>
                        </div>
                        <span className="hidden font-display text-[10px] tracking-[0.14em] text-[#06B6D4] uppercase sm:inline">
                          {milestone.focus}
                        </span>
                      </div>
                      {isSelected && (
                        <p className="mt-2 text-xs leading-relaxed text-[#F8FAFC]/75 sm:text-sm">
                          {milestone.summary}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right column breathes to frame the 3D blueprint elevation */}
            <div className="hidden lg:col-span-6 lg:flex lg:justify-end">
              <div className="arch-panel max-w-xs rounded-xl px-4 py-3 text-right">
                <span className="block font-display text-[10px] tracking-[0.2em] text-[#00E5FF] uppercase">
                  Active Schematic Node
                </span>
                <span className="mt-1 block font-display text-sm font-medium text-[#F8FAFC]">
                  {selectedMilestone.title}
                </span>
                <span className="mt-0.5 block text-xs text-[#F8FAFC]/55">
                  {selectedMilestone.focus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 — THE CORE SYSTEMS */}
      <section
        id="core-systems"
        data-section-id="core-systems"
        aria-labelledby="core-systems-heading"
        className="relative min-h-[205vh]"
      >
        <div className="sticky top-0 flex min-h-[100dvh] items-center px-4 py-24 sm:px-8 lg:pl-14 lg:pr-44 xl:pr-48">
          <div className="mx-auto grid w-full max-w-7xl items-end gap-8 lg:grid-cols-12">
            {/* Left space showcases the 3D multi-level core & interactive nodes */}
            <div className="order-2 lg:order-1 lg:col-span-7">
              <div
                data-reveal
                data-interactive-ui="true"
                className="arch-panel rounded-2xl p-6 sm:p-7"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-[11px] font-medium tracking-[0.22em] text-[#00E5FF] uppercase">
                    03 // The Core Systems
                  </span>
                  <span className="font-display text-[11px] tracking-[0.16em] text-[#F8FAFC]/50 uppercase">
                    Select node in 3D or below
                  </span>
                </div>

                <h2
                  id="core-systems-heading"
                  className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-3xl"
                >
                  Interconnected Technical Stack
                </h2>
                <p className="mt-2 text-sm text-[#F8FAFC]/70">
                  Honest architectural inventory—each level reflects practical work across
                  coursework and real repositories, without inflated proficiency claims.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {CORE_SKILLS.map((skill) => {
                    const isSelected = skill.id === selectedSkill.id
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => onSelectSkill(skill.id)}
                        className={`arch-pill rounded-full px-3.5 py-2 font-display text-xs tracking-[0.06em] ${
                          isSelected
                            ? 'arch-pill-selected'
                            : 'text-[#F8FAFC]/80'
                        }`}
                      >
                        {skill.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: Selected Core System Node Inspector */}
            <div className="order-1 lg:order-2 lg:col-span-5">
              <div
                data-reveal
                data-interactive-ui="true"
                className="arch-panel arch-panel-active rounded-2xl p-6 sm:p-7"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[11px] tracking-[0.2em] text-[#00E5FF] uppercase">
                    Level 0{selectedSkill.levelRing} // {selectedSkill.category}
                  </span>
                  <span className="rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-2.5 py-0.5 font-display text-[10px] tracking-[0.14em] text-[#00E5FF] uppercase">
                    {selectedSkill.tier}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-2xl font-semibold text-[#F8FAFC]">
                  {selectedSkill.name}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-[#F8FAFC]/75">
                  {selectedSkill.description}
                </p>

                {/* Honest architectural resonance gauge */}
                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between font-display text-[11px] tracking-[0.14em] text-[#F8FAFC]/55 uppercase">
                    <span>Current Depth</span>
                    <span className="text-[#00E5FF]">{selectedSkill.tier}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F8FAFC]/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#06B6D4] to-[#00E5FF] transition-all duration-300"
                      style={{ width: `${Math.round(selectedSkill.honestDepth * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 border-t border-[#F8FAFC]/10 pt-4">
                  <span className="block font-display text-[10px] tracking-[0.18em] text-[#F8FAFC]/45 uppercase">
                    Verified Application
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedSkill.appliedIn.map((projectRef) => (
                      <span
                        key={projectRef}
                        className="rounded-md border border-[#F8FAFC]/10 bg-[#07090E]/70 px-2.5 py-1 text-xs text-[#F8FAFC]/80"
                      >
                        {projectRef}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 — THE PROJECT CHAMBERS */}
      <section
        id="project-chambers"
        data-section-id="project-chambers"
        aria-labelledby="chambers-heading"
        className="relative min-h-[245vh]"
      >
        <div className="sticky top-0 flex min-h-[100dvh] items-end px-4 pt-28 pb-10 sm:px-8 sm:pb-14 lg:pl-14 lg:pr-44 xl:pr-48">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-6 max-w-2xl">
              <div className="mb-2 flex items-center gap-2 font-display text-[11px] font-medium tracking-[0.22em] text-[#00E5FF] uppercase">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                <span>04 // The Project Chambers</span>
              </div>
              <h2
                id="chambers-heading"
                className="font-display text-2xl font-semibold tracking-tight text-[#F8FAFC] sm:text-4xl"
              >
                Architectural Project Chambers
              </h2>
              <p className="mt-2 text-sm text-[#F8FAFC]/70 sm:text-base">
                Five suspended chambers—each housing a real application built during my
                journey. Select any chamber in the 3D gallery or below to inspect its
                verified architecture.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {PROJECT_CHAMBERS.map((chamber, index) => {
                const isFocused =
                  activeSectionId === 'project-chambers' &&
                  activeChamberIndex === index
                return (
                  <button
                    key={chamber.id}
                    type="button"
                    onClick={() => onSelectChamber(chamber, index)}
                    className={`arch-panel group flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#00E5FF]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
                      isFocused ? 'arch-panel-active' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-[10px] tracking-[0.2em] text-[#00E5FF] uppercase">
                          {chamber.chamberCode}
                        </span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-[#F8FAFC]/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#00E5FF]"
                          aria-hidden="true"
                        />
                      </div>

                      <h3 className="mt-2.5 font-display text-base font-semibold text-[#F8FAFC]">
                        {chamber.name}
                      </h3>

                      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[#F8FAFC]/65">
                        {chamber.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F8FAFC]/10">
                      <span className="block truncate font-display text-[10px] tracking-[0.14em] text-[#06B6D4] uppercase">
                        {chamber.status}
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {chamber.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-[#F8FAFC]/10 bg-[#07090E]/75 px-1.5 py-0.5 text-[10px] text-[#F8FAFC]/75"
                          >
                            {tech}
                          </span>
                        ))}
                        {chamber.technologies.length > 3 && (
                          <span className="rounded border border-[#F8FAFC]/10 bg-[#07090E]/75 px-1.5 py-0.5 text-[10px] text-[#00E5FF]">
                            +{chamber.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05 — THE HORIZON */}
      <section
        id="horizon"
        data-section-id="horizon"
        aria-labelledby="horizon-heading"
        className="relative min-h-[165vh]"
      >
        <div className="sticky top-0 flex min-h-[100dvh] items-center px-4 py-24 sm:px-8 lg:pl-14 lg:pr-44 xl:pr-48">
          <div className="mx-auto w-full max-w-4xl">
            <div
              data-reveal
              data-interactive-ui="true"
              className="arch-panel rounded-3xl p-7 sm:p-10"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/35 bg-[#00E5FF]/10 px-3.5 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#00E5FF]" aria-hidden="true" />
                <span className="font-display text-[11px] font-medium tracking-[0.2em] text-[#00E5FF] uppercase">
                  05 // The Horizon · Continuous Construction
                </span>
              </div>

              <h2
                id="horizon-heading"
                className="font-display text-3xl font-bold tracking-[-0.02em] text-[#F8FAFC] sm:text-5xl"
              >
                {OWNER_PROFILE.horizonHeadline}
              </h2>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#F8FAFC]/75 sm:text-lg">
                {OWNER_PROFILE.horizonStatement}
              </p>

              {/* Contact & Verified Links */}
              <div className="mt-8 grid gap-3 lg:grid-cols-3">
                {CONTACT_LINKS.map((item) => {
                  if (!item.isPlaceholder && item.href) {
                    const isExternal = !item.href.startsWith('mailto:')
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noreferrer' : undefined}
                        className="group flex flex-col justify-between rounded-2xl border border-[#00E5FF]/35 bg-[#07090E]/75 p-4 transition-colors hover:border-[#00E5FF] hover:bg-[#00E5FF]/10"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-[11px] tracking-[0.18em] text-[#00E5FF] uppercase">
                            {item.label}
                          </span>
                          <ArrowUpRight
                            className="h-4 w-4 text-[#00E5FF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </div>
                        <span className="mt-3 break-words font-display text-sm font-medium text-[#F8FAFC]">
                          {item.value}
                        </span>
                      </a>
                    )
                  }

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-2xl border border-dashed border-[#F8FAFC]/20 bg-[#07090E]/60 p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-[11px] tracking-[0.18em] text-[#F8FAFC]/60 uppercase">
                          {item.label} · Placeholder
                        </span>
                        {item.id === 'email' && (
                          <button
                            type="button"
                            onClick={() => handleCopyEmailPlaceholder(item.value)}
                            aria-label="Copy email placeholder"
                            className="inline-flex items-center gap-1 rounded-md border border-[#F8FAFC]/15 px-2 py-0.5 text-[10px] text-[#F8FAFC]/70 hover:border-[#00E5FF]/60 hover:text-[#00E5FF]"
                          >
                            {copiedPlaceholder ? (
                              <>
                                <Check className="h-3 w-3 text-[#00E5FF]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="mt-3">
                        <span className="block break-words font-display text-sm text-[#F8FAFC]/80">
                          {item.value}
                        </span>
                        {item.placeholderNote && (
                          <span className="mt-1 block text-[11px] text-[#F8FAFC]/45">
                            {item.placeholderNote}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#F8FAFC]/10 pt-5">
                <div className="flex items-center gap-2 text-xs text-[#F8FAFC]/55">
                  <Terminal className="h-3.5 w-3.5 text-[#00E5FF]" aria-hidden="true" />
                  <span>
                    Armin Tayebi · Computer Science Student · Building in Public
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateSection('foundation')}
                  className="arch-pill inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs tracking-[0.16em] text-[#F8FAFC] uppercase"
                >
                  <ArrowUp className="h-3.5 w-3.5 text-[#00E5FF]" aria-hidden="true" />
                  <span>Return to Foundation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
