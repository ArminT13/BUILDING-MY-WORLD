import type { SectionId } from '../data/portfolio'

interface ArchitecturalFallbackProps {
  scrollProgress: number
  activeSectionId: SectionId
  reducedMotion: boolean
  reason?: 'webgl-unavailable' | 'reduced-motion' | 'staging'
}

export function ArchitecturalFallback({
  scrollProgress,
  activeSectionId,
  reducedMotion,
  reason = 'webgl-unavailable',
}: ArchitecturalFallbackProps) {
  const buildFactor = Math.max(0.08, Math.min(1, scrollProgress))
  const blueprintLevel = Math.min(1, Math.max(0, (scrollProgress - 0.12) / 0.28))
  const coreLevel = Math.min(1, Math.max(0, (scrollProgress - 0.34) / 0.28))
  const chambersLevel = Math.min(1, Math.max(0, (scrollProgress - 0.56) / 0.28))
  const horizonLevel = Math.min(1, Math.max(0, (scrollProgress - 0.8) / 0.2))

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07090E]"
      aria-hidden="true"
    >
      {/* Subtle architectural blueprint grid & radial atmosphere */}
      <div className="arch-grid-backdrop absolute inset-0 opacity-60" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 68% 44%, rgba(0, 229, 255, 0.08), rgba(6, 182, 212, 0.03) 38%, rgba(7, 9, 14, 0.92) 76%)',
        }}
      />

      {/* Elevation Wireframe Construct */}
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-75"
      >
        <defs>
          <linearGradient id="cyanEnergyLine" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Foundation Datum Rings */}
        <g
          transform="translate(760, 620)"
          opacity={0.45 + buildFactor * 0.55}
        >
          <ellipse
            cx="0"
            cy="0"
            rx="270"
            ry="64"
            fill="none"
            stroke="#06B6D4"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="185"
            ry="42"
            fill="rgba(0,229,255,0.04)"
            stroke="#00E5FF"
            strokeOpacity="0.7"
            strokeWidth="1.2"
          />
          <line
            x1="-320"
            y1="0"
            x2="320"
            y2="0"
            stroke="#F8FAFC"
            strokeOpacity="0.16"
            strokeDasharray="6 6"
          />
        </g>

        {/* Central Energy Column */}
        <line
          x1="760"
          y1="620"
          x2="760"
          y2={620 - 470 * buildFactor}
          stroke="url(#cyanEnergyLine)"
          strokeWidth="2"
        />

        {/* Blueprint Drafting Frame */}
        <g
          transform="translate(760, 480)"
          opacity={0.2 + blueprintLevel * 0.75}
        >
          <polygon
            points="-190,40 0,-30 190,40 0,110"
            fill="rgba(6, 182, 212, 0.04)"
            stroke="#00E5FF"
            strokeOpacity="0.65"
            strokeWidth="1.1"
          />
          <line
            x1="-190"
            y1="40"
            x2="-190"
            y2="-60"
            stroke="#F8FAFC"
            strokeOpacity="0.24"
          />
          <line
            x1="190"
            y1="40"
            x2="190"
            y2="-60"
            stroke="#F8FAFC"
            strokeOpacity="0.24"
          />
        </g>

        {/* Core Systems Interconnected Tiers */}
        <g
          transform="translate(760, 360)"
          opacity={0.18 + coreLevel * 0.8}
        >
          {[-45, 0, 45].map((dy, index) => (
            <g key={dy} transform={`translate(0, ${dy})`}>
              <polygon
                points="-135,0 0,-38 135,0 0,38"
                fill="rgba(13, 19, 31, 0.5)"
                stroke={index === 1 ? '#00E5FF' : '#F8FAFC'}
                strokeOpacity={index === 1 ? 0.78 : 0.35}
                strokeWidth="1.2"
              />
            </g>
          ))}
        </g>

        {/* Project Chambers Wing */}
        <g
          transform="translate(760, 240)"
          opacity={0.15 + chambersLevel * 0.82}
        >
          {[-180, -90, 0, 90, 180].map((dx, index) => {
            const offsetY = Math.abs(dx) * 0.2
            return (
              <g key={dx} transform={`translate(${dx}, ${offsetY})`}>
                <rect
                  x="-24"
                  y="-34"
                  width="48"
                  height="64"
                  rx="4"
                  fill="rgba(0, 229, 255, 0.06)"
                  stroke="#00E5FF"
                  strokeOpacity={
                    activeSectionId === 'project-chambers' ? 0.85 : 0.45
                  }
                  strokeWidth="1.2"
                />
                <circle
                  cx="0"
                  cy="-42"
                  r={index === 2 ? 3.5 : 2.5}
                  fill="#00E5FF"
                />
              </g>
            )
          })}
        </g>

        {/* Horizon Apex Spire */}
        <g
          transform="translate(760, 120)"
          opacity={0.12 + horizonLevel * 0.88}
        >
          <polygon
            points="0,-65 46,20 0,48 -46,20"
            fill="rgba(0, 229, 255, 0.08)"
            stroke="#F8FAFC"
            strokeOpacity="0.6"
            strokeWidth="1.2"
          />
          <line
            x1="0"
            y1="-65"
            x2="0"
            y2="-120"
            stroke="#00E5FF"
            strokeDasharray="4 4"
            strokeOpacity="0.85"
          />
        </g>
      </svg>

      {reason !== 'staging' && (
        <div className="absolute bottom-5 left-5 hidden rounded-full border border-[#F8FAFC]/10 bg-[#07090E]/80 px-3 py-1.5 font-display text-[10px] tracking-[0.18em] text-[#F8FAFC]/55 uppercase sm:block">
          {reducedMotion
            ? 'Architectural Vector Mode · Reduced Motion Active'
            : 'Architectural Vector Fallback · WebGL Simplified'}
        </div>
      )}
    </div>
  )
}
