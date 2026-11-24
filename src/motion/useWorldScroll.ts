import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useCallback, useEffect, useRef } from 'react'
import { SECTIONS, type SectionId } from '../data/portfolio'
import type { WorldScrollState } from '../world/WorldEngine'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export function computeSectionScrollState(globalProgress: number): WorldScrollState {
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
  const p = clamp01(globalProgress)
  return {
    globalProgress: p,
    foundationProgress: clamp01(0.25 + p * 5.2),
    blueprintProgress: clamp01((p - 0.08) / 0.24),
    coreProgress: clamp01((p - 0.26) / 0.24),
    chambersProgress: clamp01((p - 0.46) / 0.28),
    horizonProgress: clamp01((p - 0.72) / 0.22),
  }
}

export function resolveSectionFromProgress(progress: number): SectionId {
  for (const section of SECTIONS) {
    const [start, end] = section.progressRange
    if (progress >= start && progress <= end) {
      return section.id
    }
  }
  return progress >= 0.84 ? 'horizon' : 'foundation'
}

interface UseWorldScrollOptions {
  reducedMotion: boolean
  scrollLocked: boolean
  onSectionChange: (sectionId: SectionId) => void
  onProgressPercentChange: (progress: number) => void
  onScrollChamberIndexChange: (index: number) => void
}

export function useWorldScroll({
  reducedMotion,
  scrollLocked,
  onSectionChange,
  onProgressPercentChange,
  onScrollChamberIndexChange,
}: UseWorldScrollOptions) {
  const scrollStateRef = useRef<WorldScrollState>(computeSectionScrollState(0))
  const lenisRef = useRef<Lenis | null>(null)
  const lastSectionRef = useRef<SectionId>('foundation')
  const lastPercentRef = useRef<number>(-1)
  const lastChamberIdxRef = useRef<number>(0)

  const callbacksRef = useRef({
    onSectionChange,
    onProgressPercentChange,
    onScrollChamberIndexChange,
  })

  useEffect(() => {
    callbacksRef.current = {
      onSectionChange,
      onProgressPercentChange,
      onScrollChamberIndexChange,
    }
  })

  useEffect(() => {
    let lenis: Lenis | null = null
    let tickerCallback: ((time: number) => void) | null = null

    const applyProgress = (rawProgress: number) => {
      const next = computeSectionScrollState(rawProgress)
      scrollStateRef.current = next
      document.documentElement.style.setProperty(
        '--world-progress',
        next.globalProgress.toFixed(4),
      )

      const pct = Math.round(next.globalProgress * 100)
      if (pct !== lastPercentRef.current) {
        lastPercentRef.current = pct
        callbacksRef.current.onProgressPercentChange(next.globalProgress)
      }

      const nextSection = resolveSectionFromProgress(next.globalProgress)
      if (nextSection !== lastSectionRef.current) {
        lastSectionRef.current = nextSection
        callbacksRef.current.onSectionChange(nextSection)
      }

      // Sweep active Project Chamber index across Section 04 (0.58 .. 0.84)
      if (next.globalProgress >= 0.57 && next.globalProgress <= 0.85) {
        const local = Math.max(
          0,
          Math.min(0.999, (next.globalProgress - 0.58) / 0.25),
        )
        const idx = Math.min(4, Math.floor(local * 5))
        if (idx !== lastChamberIdxRef.current) {
          lastChamberIdxRef.current = idx
          callbacksRef.current.onScrollChamberIndexChange(idx)
        }
      }
    }

    if (!reducedMotion && typeof window !== 'undefined') {
      try {
        lenis = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.4,
        })
        lenisRef.current = lenis
        lenis.on('scroll', ScrollTrigger.update)

        tickerCallback = (time: number) => {
          lenis?.raf(time * 1000)
        }
        gsap.ticker.add(tickerCallback)
        gsap.ticker.lagSmoothing(0)
      } catch {
        lenis = null
      }
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: reducedMotion ? false : 0.45,
        onUpdate: (self) => {
          applyProgress(self.progress)
        },
      })

      if (!reducedMotion) {
        const revealPanels = gsap.utils.toArray<HTMLElement>('[data-reveal]')
        revealPanels.forEach((panel) => {
          gsap.fromTo(
            panel,
            { y: 18, opacity: 0.72 },
            {
              y: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 86%',
                end: 'top 42%',
                scrub: 0.4,
              },
            },
          )
        })
      }
    })

    const onNativeFallbackScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const p =
        maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0
      applyProgress(p)
    }

    window.addEventListener('scroll', onNativeFallbackScroll, { passive: true })
    onNativeFallbackScroll()

    return () => {
      window.removeEventListener('scroll', onNativeFallbackScroll)
      ctx.revert()
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback)
      }
      lenis?.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!lenisRef.current) return
    if (scrollLocked) {
      lenisRef.current.stop()
    } else {
      lenisRef.current.start()
    }
  }, [scrollLocked])

  const scrollToSection = useCallback(
    (sectionId: SectionId) => {
      const element = document.getElementById(sectionId)
      if (!element) return

      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(element, { offset: 0, duration: 1.25 })
      } else if (typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
        })
      }
      lastSectionRef.current = sectionId
      callbacksRef.current.onSectionChange(sectionId)
    },
    [reducedMotion],
  )

  return {
    scrollStateRef,
    scrollToSection,
  }
}
