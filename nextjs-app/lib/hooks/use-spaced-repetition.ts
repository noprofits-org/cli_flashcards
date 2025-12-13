'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CardProgress,
  SRSStats,
  getSetProgress,
  getCardProgress,
  updateCardProgress,
  getSetStats,
  getDueCards,
  getStudyOrder,
  resetSetProgress,
} from '@/lib/spaced-repetition'

interface UseSpacedRepetitionProps {
  setId: string
  cardIds: string[]
}

interface UseSpacedRepetitionReturn {
  stats: SRSStats
  dueCardIds: string[]
  studyOrder: string[]
  getProgress: (cardId: string) => CardProgress
  recordAnswer: (cardId: string, isCorrect: boolean) => CardProgress
  resetProgress: () => void
  refreshStats: () => void
}

export function useSpacedRepetition({
  setId,
  cardIds,
}: UseSpacedRepetitionProps): UseSpacedRepetitionReturn {
  const [stats, setStats] = useState<SRSStats>({
    totalCards: 0,
    newCards: 0,
    learningCards: 0,
    reviewCards: 0,
    masteredCards: 0,
    dueForReview: 0,
    streakDays: 0,
  })

  const [dueCardIds, setDueCardIds] = useState<string[]>([])
  const [studyOrder, setStudyOrder] = useState<string[]>([])

  const refreshStats = useCallback(() => {
    if (!setId || cardIds.length === 0) return

    const newStats = getSetStats(setId, cardIds)
    setStats(newStats)

    const due = getDueCards(setId, cardIds)
    setDueCardIds(due)

    const order = getStudyOrder(setId, cardIds)
    setStudyOrder(order)
  }, [setId, cardIds])

  // Initial load
  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  const getProgress = useCallback(
    (cardId: string): CardProgress => {
      return getCardProgress(setId, cardId)
    },
    [setId]
  )

  const recordAnswer = useCallback(
    (cardId: string, isCorrect: boolean): CardProgress => {
      const progress = updateCardProgress(setId, cardId, isCorrect)
      // Refresh stats after recording
      refreshStats()
      return progress
    },
    [setId, refreshStats]
  )

  const resetProgress = useCallback(() => {
    resetSetProgress(setId)
    refreshStats()
  }, [setId, refreshStats])

  return {
    stats,
    dueCardIds,
    studyOrder,
    getProgress,
    recordAnswer,
    resetProgress,
    refreshStats,
  }
}
