import type { ProjectChamber } from '../data/portfolio'

interface ProjectSchematicPreviewProps {
  project: ProjectChamber
}

export function ProjectSchematicPreview({
  project,
}: ProjectSchematicPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#00E5FF]/25 bg-[#07090E]/90 p-4">
      <div className="arch-grid-backdrop pointer-events-none absolute inset-0 opacity-60" />

      {/* Explicit Screenshot Placeholder Banner */}
      <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#F8FAFC]/10 pb-2.5">
        <span className="inline-flex items-center gap-2 font-display text-[10px] tracking-[0.2em] text-[#00E5FF] uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
          Screenshot Placeholder · Architectural Schematic
        </span>
        <span className="font-display text-[10px] tracking-[0.14em] text-[#F8FAFC]/50 uppercase">
          {project.chamberCode}
        </span>
      </div>

      {/* Custom Schematic Graphic */}
      <div className="relative z-10 grid items-center gap-4 sm:grid-cols-12">
        <div className="flex items-center justify-center sm:col-span-5">
          <svg
            viewBox="0 0 220 140"
            className="h-32 w-full max-w-[220px]"
            role="img"
            aria-label={`${project.name} architectural schematic`}
          >
            {project.geometryKind === 'prism' && (
              <g>
                <polygon
                  points="110,16 172,46 172,96 110,126 48,96 48,46"
                  fill="rgba(0, 229, 255, 0.08)"
                  stroke="#00E5FF"
                  strokeWidth="1.5"
                />
                <polygon
                  points="110,34 146,54 146,88 110,108 74,88 74,54"
                  fill="rgba(6, 182, 212, 0.14)"
                  stroke="#F8FAFC"
                  strokeOpacity="0.65"
                  strokeWidth="1.1"
                />
                <circle cx="110" cy="71" r="6" fill="#00E5FF" />
              </g>
            )}

            {project.geometryKind === 'terrain' && (
              <g>
                <line
                  x1="28"
                  y1="116"
                  x2="192"
                  y2="116"
                  stroke="#F8FAFC"
                  strokeOpacity="0.3"
                />
                <rect
                  x="48"
                  y="62"
                  width="34"
                  height="54"
                  fill="rgba(248, 250, 252, 0.1)"
                  stroke="#F8FAFC"
                  strokeOpacity="0.5"
                />
                <rect
                  x="104"
                  y="34"
                  width="34"
                  height="82"
                  fill="rgba(0, 229, 255, 0.18)"
                  stroke="#00E5FF"
                  strokeWidth="1.5"
                />
                <text
                  x="65"
                  y="54"
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="9"
                  opacity="0.7"
                >
                  57.6% R²
                </text>
                <text
                  x="121"
                  y="26"
                  textAnchor="middle"
                  fill="#00E5FF"
                  fontSize="9"
                >
                  80.5% R²
                </text>
                <path
                  d="M154,96 L186,44"
                  stroke="#00E5FF"
                  strokeDasharray="3 3"
                />
              </g>
            )}

            {project.geometryKind === 'conduit' && (
              <g>
                <rect
                  x="26"
                  y="26"
                  width="168"
                  height="22"
                  rx="4"
                  fill="rgba(0, 229, 255, 0.08)"
                  stroke="#06B6D4"
                />
                <rect
                  x="26"
                  y="59"
                  width="168"
                  height="22"
                  rx="4"
                  fill="rgba(0, 229, 255, 0.16)"
                  stroke="#00E5FF"
                />
                <rect
                  x="26"
                  y="92"
                  width="168"
                  height="22"
                  rx="4"
                  fill="rgba(248, 250, 252, 0.06)"
                  stroke="#F8FAFC"
                  strokeOpacity="0.4"
                />
                <line
                  x1="110"
                  y1="48"
                  x2="110"
                  y2="92"
                  stroke="#00E5FF"
                  strokeWidth="1.4"
                />
              </g>
            )}

            {project.geometryKind === 'beacon' && (
              <g>
                <polygon
                  points="110,22 142,108 78,108"
                  fill="rgba(0, 229, 255, 0.1)"
                  stroke="#00E5FF"
                  strokeWidth="1.4"
                />
                <circle
                  cx="110"
                  cy="28"
                  r="14"
                  fill="none"
                  stroke="#06B6D4"
                  strokeDasharray="3 3"
                />
                <circle
                  cx="110"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#00E5FF"
                  strokeOpacity="0.45"
                />
                <circle cx="110" cy="28" r="4" fill="#00E5FF" />
              </g>
            )}

            {project.geometryKind === 'vault' && (
              <g>
                {[0, 1].map((row) =>
                  [0, 1, 2].map((col) => (
                    <rect
                      key={`${row}-${col}`}
                      x={40 + col * 48}
                      y={32 + row * 40}
                      width="38"
                      height="30"
                      rx="3"
                      fill={
                        row === 0 && col === 1
                          ? 'rgba(0, 229, 255, 0.18)'
                          : 'rgba(13, 19, 31, 0.8)'
                      }
                      stroke={row === 0 && col === 1 ? '#00E5FF' : '#F8FAFC'}
                      strokeOpacity={row === 0 && col === 1 ? 0.95 : 0.35}
                    />
                  )),
                )}
              </g>
            )}
          </svg>
        </div>

        {/* Verified Repository Module Tree & Metrics */}
        <div className="space-y-3 sm:col-span-7">
          <div>
            <span className="block font-display text-[10px] tracking-[0.18em] text-[#F8FAFC]/50 uppercase">
              Verified Repository Structure
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {project.architectureModules.map((mod) => (
                <span
                  key={mod}
                  className="rounded border border-[#F8FAFC]/12 bg-[#0D121D] px-2 py-0.5 font-mono text-[11px] text-[#F8FAFC]/85"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-[#F8FAFC]/10 bg-[#0D121D]/85 p-2"
              >
                <span className="block font-display text-[9px] tracking-[0.14em] text-[#F8FAFC]/45 uppercase">
                  {metric.label}
                </span>
                <span className="mt-0.5 block truncate font-display text-xs font-medium text-[#00E5FF]">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="relative z-10 mt-3 text-[11px] text-[#F8FAFC]/50">
        {project.screenshotPlaceholderNote}
      </p>
    </div>
  )
}
