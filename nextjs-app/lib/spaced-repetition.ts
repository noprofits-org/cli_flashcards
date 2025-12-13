/**
 * Spaced Repetition System (SRS) using SM-2 algorithm variant
 *
 * Cards have mastery levels 0-5:
 * 0: New - never seen
 * 1: Learning - just introduced, needs frequent review
 * 2: Review - seen a few times, medium interval
 * 3: Familiar - comfortable, longer interval
 * 4: Known - well learned, much longer interval
 * 5: Mastered - fully learned, very long interval
 */

export interface CardProgress {
  cardId: string
  setId: string
  masteryLevel: number // 0-5
  easeFactor: number // 1.3-2.5, affects interval growth
  interval: number // days until next review
  nextReviewDate: string // ISO date string
  reviewCount: number
  correctStreak: number
  lastReviewDate: string | null
  lastResult: 'correct' | 'incorrect' | null
}

export interface SetProgress {
  setId: string
  cards: Record<string, CardProgress>
  totalReviews: number
  lastStudyDate: string | null
}

export interface SRSStats {
  totalCards: number
  newCards: number
  learningCards: number
  reviewCards: number
  masteredCards: number
  dueForReview: number
  streakDays: number
}

const STORAGE_KEY = 'flashcards_srs_progress'
const MIN_EASE_FACTOR = 1.3
const MAX_EASE_FACTOR = 2.5
const DEFAULT_EASE_FACTOR = 2.5

// Interval multipliers for each mastery level (in days)
const MASTERY_INTERVALS = {
  0: 0,    // New - immediate
  1: 1,    // Learning - 1 day
  2: 3,    // Review - 3 days
  3: 7,    // Familiar - 1 week
  4: 14,   // Known - 2 weeks
  5: 30,   // Mastered - 1 month
}

/**
 * Load all progress from localStorage
 */
export function loadAllProgress(): Record<string, SetProgress> {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/**
 * Save all progress to localStorage
 */
export function saveAllProgress(progress: Record<string, SetProgress>): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save progress:', error)
  }
}

/**
 * Get progress for a specific set
 */
export function getSetProgress(setId: string): SetProgress {
  const allProgress = loadAllProgress()
  return allProgress[setId] || {
    setId,
    cards: {},
    totalReviews: 0,
    lastStudyDate: null,
  }
}

/**
 * Get progress for a specific card
 */
export function getCardProgress(setId: string, cardId: string): CardProgress {
  const setProgress = getSetProgress(setId)
  return setProgress.cards[cardId] || createNewCardProgress(setId, cardId)
}

/**
 * Create initial progress for a new card
 */
function createNewCardProgress(setId: string, cardId: string): CardProgress {
  return {
    cardId,
    setId,
    masteryLevel: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    nextReviewDate: new Date().toISOString(),
    reviewCount: 0,
    correctStreak: 0,
    lastReviewDate: null,
    lastResult: null,
  }
}

/**
 * Update card progress after a review
 */
export function updateCardProgress(
  setId: string,
  cardId: string,
  isCorrect: boolean
): CardProgress {
  const allProgress = loadAllProgress()
  const setProgress = allProgress[setId] || {
    setId,
    cards: {},
    totalReviews: 0,
    lastStudyDate: null,
  }

  const cardProgress = setProgress.cards[cardId] || createNewCardProgress(setId, cardId)
  const now = new Date()

  // Update based on result
  if (isCorrect) {
    // Increase mastery level (max 5)
    cardProgress.masteryLevel = Math.min(5, cardProgress.masteryLevel + 1)
    cardProgress.correctStreak++

    // Increase ease factor slightly on correct answers
    cardProgress.easeFactor = Math.min(
      MAX_EASE_FACTOR,
      cardProgress.easeFactor + 0.1
    )
  } else {
    // Decrease mastery level (min 1 if they've seen it, else 0)
    cardProgress.masteryLevel = Math.max(
      cardProgress.reviewCount > 0 ? 1 : 0,
      cardProgress.masteryLevel - 2
    )
    cardProgress.correctStreak = 0

    // Decrease ease factor on incorrect answers
    cardProgress.easeFactor = Math.max(
      MIN_EASE_FACTOR,
      cardProgress.easeFactor - 0.2
    )
  }

  // Calculate next interval
  const baseInterval = MASTERY_INTERVALS[cardProgress.masteryLevel as keyof typeof MASTERY_INTERVALS]
  cardProgress.interval = Math.round(baseInterval * cardProgress.easeFactor)

  // Set next review date
  const nextReview = new Date(now)
  nextReview.setDate(nextReview.getDate() + cardProgress.interval)
  cardProgress.nextReviewDate = nextReview.toISOString()

  // Update metadata
  cardProgress.reviewCount++
  cardProgress.lastReviewDate = now.toISOString()
  cardProgress.lastResult = isCorrect ? 'correct' : 'incorrect'

  // Save progress
  setProgress.cards[cardId] = cardProgress
  setProgress.totalReviews++
  setProgress.lastStudyDate = now.toISOString()
  allProgress[setId] = setProgress

  saveAllProgress(allProgress)

  return cardProgress
}

/**
 * Get cards that are due for review
 */
export function getDueCards(setId: string, allCardIds: string[]): string[] {
  const setProgress = getSetProgress(setId)
  const now = new Date()

  return allCardIds.filter(cardId => {
    const progress = setProgress.cards[cardId]
    if (!progress) return true // New cards are always "due"

    const nextReview = new Date(progress.nextReviewDate)
    return nextReview <= now
  })
}

/**
 * Get new cards (never reviewed)
 */
export function getNewCards(setId: string, allCardIds: string[]): string[] {
  const setProgress = getSetProgress(setId)

  return allCardIds.filter(cardId => {
    const progress = setProgress.cards[cardId]
    return !progress || progress.reviewCount === 0
  })
}

/**
 * Get cards by mastery level
 */
export function getCardsByMastery(
  setId: string,
  allCardIds: string[],
  masteryLevel: number
): string[] {
  const setProgress = getSetProgress(setId)

  return allCardIds.filter(cardId => {
    const progress = setProgress.cards[cardId]
    if (!progress) return masteryLevel === 0
    return progress.masteryLevel === masteryLevel
  })
}

/**
 * Calculate SRS statistics for a set
 */
export function getSetStats(setId: string, allCardIds: string[]): SRSStats {
  const setProgress = getSetProgress(setId)
  const now = new Date()

  let newCards = 0
  let learningCards = 0
  let reviewCards = 0
  let masteredCards = 0
  let dueForReview = 0

  allCardIds.forEach(cardId => {
    const progress = setProgress.cards[cardId]

    if (!progress || progress.reviewCount === 0) {
      newCards++
      dueForReview++
    } else {
      // Check if due
      if (new Date(progress.nextReviewDate) <= now) {
        dueForReview++
      }

      // Count by mastery
      if (progress.masteryLevel <= 1) {
        learningCards++
      } else if (progress.masteryLevel <= 3) {
        reviewCards++
      } else {
        masteredCards++
      }
    }
  })

  // Calculate streak (simplified - days in a row with at least one review)
  let streakDays = 0
  if (setProgress.lastStudyDate) {
    const lastStudy = new Date(setProgress.lastStudyDate)
    const daysDiff = Math.floor((now.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24))
    streakDays = daysDiff <= 1 ? 1 : 0 // Simple streak - studied today or yesterday
  }

  return {
    totalCards: allCardIds.length,
    newCards,
    learningCards,
    reviewCards,
    masteredCards,
    dueForReview,
    streakDays,
  }
}

/**
 * Reset progress for a set
 */
export function resetSetProgress(setId: string): void {
  const allProgress = loadAllProgress()
  delete allProgress[setId]
  saveAllProgress(allProgress)
}

/**
 * Reset all progress
 */
export function resetAllProgress(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Get recommended study order (prioritizes due cards, then new cards)
 */
export function getStudyOrder(setId: string, allCardIds: string[], maxCards: number = 20): string[] {
  const setProgress = getSetProgress(setId)
  const now = new Date()

  // Categorize cards
  const dueCards: { id: string; priority: number }[] = []
  const newCards: string[] = []

  allCardIds.forEach(cardId => {
    const progress = setProgress.cards[cardId]

    if (!progress || progress.reviewCount === 0) {
      newCards.push(cardId)
    } else {
      const nextReview = new Date(progress.nextReviewDate)
      if (nextReview <= now) {
        // Priority: lower mastery = higher priority (review struggling cards first)
        dueCards.push({
          id: cardId,
          priority: 5 - progress.masteryLevel + (progress.lastResult === 'incorrect' ? 2 : 0)
        })
      }
    }
  })

  // Sort due cards by priority (highest first)
  dueCards.sort((a, b) => b.priority - a.priority)

  // Combine: due cards first, then new cards, limited to maxCards
  const studyOrder = [
    ...dueCards.map(c => c.id),
    ...newCards
  ].slice(0, maxCards)

  return studyOrder
}
