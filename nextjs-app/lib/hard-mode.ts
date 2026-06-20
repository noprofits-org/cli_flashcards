import { AppState } from '@/lib/types/flashcard'

/**
 * Pure reducer for a submitted answer. Extracted from the flashcards page so
 * the hard-mode retry state machine can be unit-tested without a DOM.
 *
 * Hard-mode rules:
 * - Normal mode: record the result and bump the score on a correct answer.
 * - Hard mode, wrong answer: (re)start the retry sequence at attempt 1. No
 *   score is awarded; the learner must now get it right 3 times in a row.
 * - Hard mode, correct during retry attempt 1 or 2: advance to the next retry
 *   attempt. Still no score — the card isn't mastered yet.
 * - Hard mode, correct on the 3rd retry (or correct on the very first try):
 *   complete the card and award the score.
 */
export function reduceAnswer(
  state: AppState,
  answer: string,
  isCorrect: boolean
): AppState {
  const currentRetry = state.currentRetryAttempt || 0
  const cardStates = [...state.cardStates]

  // Wrong answer in hard mode — (re)start the retry sequence from attempt 1.
  if (state.hardMode && !isCorrect) {
    cardStates[state.currentIndex] = {
      userAnswer: answer,
      isCorrect: false,
      retryCount: 0,
    }
    return {
      ...state,
      cardStates,
      isAnswered: true,
      currentRetryAttempt: 1,
      totalAttempts: state.totalAttempts + 1,
    }
  }

  // Correct during retry attempt 1 or 2 — advance, not yet complete.
  if (state.hardMode && currentRetry > 0 && currentRetry < 3) {
    cardStates[state.currentIndex] = {
      userAnswer: answer,
      isCorrect: true,
      retryCount: currentRetry,
    }
    return {
      ...state,
      cardStates,
      isAnswered: true,
      currentRetryAttempt: currentRetry + 1,
      totalAttempts: state.totalAttempts + 1,
    }
  }

  // Normal mode, first-try correct in hard mode, or 3rd-retry success —
  // complete the card and award the score on a correct answer.
  cardStates[state.currentIndex] = {
    userAnswer: answer,
    isCorrect,
    retryCount: currentRetry,
  }
  return {
    ...state,
    cardStates,
    isAnswered: true,
    currentScore: state.currentScore + (isCorrect ? 1 : 0),
    totalAttempts: state.totalAttempts + 1,
    currentRetryAttempt: 0,
  }
}
