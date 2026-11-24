import { describe, expect, it } from 'vitest'
import {
  BLUEPRINT_MILESTONES,
  CONTACT_LINKS,
  CORE_SKILLS,
  OWNER_PROFILE,
  PROJECT_CHAMBERS,
  SECTIONS,
} from './portfolio'

describe('portfolio verified dataset', () => {
  it('defines all five architectural sections with monotonic progress ranges', () => {
    expect(SECTIONS).toHaveLength(5)
    expect(SECTIONS.map((s) => s.id)).toEqual([
      'foundation',
      'blueprint',
      'core-systems',
      'project-chambers',
      'horizon',
    ])

    let prevEnd = 0
    for (const section of SECTIONS) {
      const [start, end] = section.progressRange
      expect(start).toBe(prevEnd)
      expect(end).toBeGreaterThan(start)
      expect(section.anchorProgress).toBeGreaterThanOrEqual(start)
      expect(section.anchorProgress).toBeLessThanOrEqual(end)
      prevEnd = end
    }
    expect(prevEnd).toBe(1)
  })

  it('keeps blueprint milestones honest without invented dates or job titles', () => {
    expect(BLUEPRINT_MILESTONES).toHaveLength(5)
    for (const milestone of BLUEPRINT_MILESTONES) {
      expect(milestone.summary.length).toBeGreaterThan(20)
      expect(milestone.title).not.toMatch(/\b(19|20)\d{2}\b/)
      expect(milestone.summary).not.toMatch(/\b(senior|lead|years of experience)\b/i)
    }
  })

  it('includes all eight required core skills with honest proficiency tiers', () => {
    expect(CORE_SKILLS.map((s) => s.name)).toEqual([
      'Python',
      'Java',
      'FastAPI',
      'SQLite',
      'Git & GitHub',
      'API Integration',
      'Artificial Intelligence',
      'Machine Learning',
    ])

    for (const skill of CORE_SKILLS) {
      expect(skill.honestDepth).toBeGreaterThan(0)
      expect(skill.honestDepth).toBeLessThanOrEqual(0.75)
      expect(skill.appliedIn.length).toBeGreaterThan(0)
    }
  })

  it('contains all five verified ArminT13 project chambers with real GitHub URLs and clear placeholders', () => {
    expect(PROJECT_CHAMBERS).toHaveLength(5)
    expect(PROJECT_CHAMBERS.map((p) => p.name)).toEqual([
      'StudyMate',
      'California House Price Prediction',
      'FreelanceFlow',
      'Predict & Bet',
      'Warehouse Management System',
    ])

    for (const project of PROJECT_CHAMBERS) {
      expect(project.githubUrl).toMatch(/^https:\/\/github\.com\/ArminT13\//)
      expect(project.isScreenshotPlaceholder).toBe(true)
      expect(project.technologies.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('marks missing contact email and social links clearly as placeholders', () => {
    expect(OWNER_PROFILE.githubUrl).toBe('https://github.com/ArminT13')
    const email = CONTACT_LINKS.find((item) => item.id === 'email')
    expect(email?.isPlaceholder).toBe(true)
    const github = CONTACT_LINKS.find((item) => item.id === 'github')
    expect(github?.isPlaceholder).toBe(false)
    expect(github?.href).toBe('https://github.com/ArminT13')
  })
})
