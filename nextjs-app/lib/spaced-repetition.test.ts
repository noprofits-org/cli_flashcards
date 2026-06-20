import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
  updateCardProgress,
  getCardProgress,
  getDueCards,
  getStudyOrder,
  getSetStats,
  saveAllProgress,
  resetSetProgress,
  type CardProgress,
  type SetProgress,
} from './spaced-repetition'

// In-memory localStorage so the persistence layer works in a Node test env.
// The module gates on `typeof window === 'undefined'`, so we stub both.
const store = new Map<string, string>()
const localStorageMock = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
}

const SET = 'terminal-navigation'
const NOW = new Date('2026-01-01T12:00:00.000Z')

beforeAll(() => {
  vi.stubGlobal('window', {})
  vi.stubGlobal('localStorage', localStorageMock)
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterAll(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

beforeEach(() => {
  store.clear()
  vi.setSystemTime(NOW)
})

// Build a fully-formed CardProgress for seeding localStorage directly.
function card(id: string, over: Partial<CardProgress> = {}): CardProgress {
  return {
    cardId: id,
    setId: SET,
    masteryLevel: 0,
    easeFactor: 2.5,
    interval: 0,
    nextReviewDate: NOW.toISOString(),
    reviewCount: 0,
    correctStreak: 0,
    lastReviewDate: null,
    lastResult: null,
    ...over,
  }
}

function seed(cards: CardProgress[]): void {
  const set: SetProgress = {
    setId: SET,
    cards: Object.fromEntries(cards.map((c) => [c.cardId, c])),
    totalReviews: cards.length,
    lastStudyDate: NOW.toISOString(),
  }
  saveAllProgress({ [SET]: set })
}

describe('updateCardProgress', () => {
  it('a first correct review raises mastery, streak, and review count', () => {
    const p = updateCardProgress(SET, 'c1', true)
    expect(p.masteryLevel).toBe(1)
    expect(p.correctStreak).toBe(1)
    expect(p.reviewCount).toBe(1)
    expect(p.lastResult).toBe('correct')
    expect(p.easeFactor).toBe(2.5) // already at the max, stays clamped
  })

  it('mastery caps at 5 no matter how many corrects', () => {
    let p: CardProgress | undefined
    for (let i = 0; i < 8; i++) p = updateCardProgress(SET, 'c1', true)
    expect(p!.masteryLevel).toBe(5)
    expect(p!.correctStreak).toBe(8)
  })

  it('a wrong answer drops mastery by two (floored at 1 once seen) and resets streak', () => {
    updateCardProgress(SET, 'c1', true) // mastery 1
    updateCardProgress(SET, 'c1', true) // mastery 2
    updateCardProgress(SET, 'c1', true) // mastery 3
    const p = updateCardProgress(SET, 'c1', false)
    expect(p.masteryLevel).toBe(1) // max(1, 3 - 2)
    expect(p.correctStreak).toBe(0)
    expect(p.easeFactor).toBeCloseTo(2.3) // 2.5 - 0.2
    expect(p.lastResult).toBe('incorrect')
  })

  it('ease factor never falls below the 1.3 floor', () => {
    let p: CardProgress | undefined
    for (let i = 0; i < 12; i++) p = updateCardProgress(SET, 'c1', false)
    expect(p!.easeFactor).toBe(1.3)
  })

  it('sets a future review date the computed interval ahead', () => {
    const p = updateCardProgress(SET, 'c1', true)
    const next = new Date(p.nextReviewDate)
    expect(p.interval).toBeGreaterThan(0)
    expect(next.getTime()).toBeGreaterThan(NOW.getTime())
    const days = Math.round((next.getTime() - NOW.getTime()) / 86_400_000)
    expect(days).toBe(p.interval)
  })

  it('persists across calls via the storage layer', () => {
    updateCardProgress(SET, 'c1', true)
    expect(getCardProgress(SET, 'c1').masteryLevel).toBe(1)
  })
})

describe('getDueCards', () => {
  it('treats never-seen cards as always due', () => {
    expect(getDueCards(SET, ['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('excludes a card whose next review is in the future, then includes it once due', () => {
    updateCardProgress(SET, 'a', true) // schedules a future review
    expect(getDueCards(SET, ['a'])).toEqual([]) // not due yet

    vi.setSystemTime(new Date('2026-03-01T12:00:00.000Z')) // well past any interval
    expect(getDueCards(SET, ['a'])).toEqual(['a'])
  })
})

describe('getStudyOrder', () => {
  it('orders due cards by priority (struggling first), then appends new cards', () => {
    const past = new Date('2025-12-01T00:00:00.000Z').toISOString()
    seed([
      // low mastery + last incorrect => highest priority (5 - 1 + 2 = 6)
      card('struggling', { masteryLevel: 1, reviewCount: 4, lastResult: 'incorrect', nextReviewDate: past }),
      // high mastery + last correct => low priority (5 - 4 = 1)
      card('easy', { masteryLevel: 4, reviewCount: 6, lastResult: 'correct', nextReviewDate: past }),
    ])

    const order = getStudyOrder(SET, ['struggling', 'easy', 'fresh'])
    expect(order).toEqual(['struggling', 'easy', 'fresh'])
  })

  it('respects the maxCards limit', () => {
    expect(getStudyOrder(SET, ['a', 'b', 'c', 'd'], 2)).toHaveLength(2)
  })
})

describe('getSetStats', () => {
  it('buckets cards into new / learning / mastered and counts due', () => {
    const future = new Date('2026-06-01T00:00:00.000Z').toISOString()
    const past = new Date('2025-12-01T00:00:00.000Z').toISOString()
    seed([
      card('learn', { masteryLevel: 1, reviewCount: 2, nextReviewDate: past }), // due
      card('master', { masteryLevel: 5, reviewCount: 9, nextReviewDate: future }), // not due
    ])

    const stats = getSetStats(SET, ['learn', 'master', 'brandNew'])
    expect(stats.totalCards).toBe(3)
    expect(stats.newCards).toBe(1) // brandNew (no progress)
    expect(stats.learningCards).toBe(1) // mastery <= 1
    expect(stats.masteredCards).toBe(1) // mastery >= 4
    expect(stats.dueForReview).toBe(2) // learn (past) + brandNew (new)
  })
})

describe('resetSetProgress', () => {
  it('clears a set so its cards read as new again', () => {
    updateCardProgress(SET, 'c1', true)
    resetSetProgress(SET)
    expect(getCardProgress(SET, 'c1').reviewCount).toBe(0)
  })
})
