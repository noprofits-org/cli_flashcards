import { describe, it, expect } from 'vitest'
import { reduceAnswer } from './hard-mode'
import { AppState } from '@/lib/types/flashcard'

function baseState(overrides: Partial<AppState> = {}): AppState {
  return {
    currentIndex: 0,
    currentScore: 0,
    totalAttempts: 0,
    cardStates: [null, null, null],
    isAnswered: false,
    hardMode: false,
    currentRetryAttempt: 0,
    ...overrides,
  }
}

describe('reduceAnswer — normal mode', () => {
  it('awards a point and marks answered on a correct answer', () => {
    const next = reduceAnswer(baseState(), 'git status', true)
    expect(next.currentScore).toBe(1)
    expect(next.totalAttempts).toBe(1)
    expect(next.isAnswered).toBe(true)
    expect(next.currentRetryAttempt).toBe(0)
    expect(next.cardStates[0]).toEqual({
      userAnswer: 'git status',
      isCorrect: true,
      retryCount: 0,
    })
  })

  it('does not award a point on a wrong answer', () => {
    const next = reduceAnswer(baseState(), 'wrong', false)
    expect(next.currentScore).toBe(0)
    expect(next.totalAttempts).toBe(1)
    expect(next.isAnswered).toBe(true)
    expect(next.cardStates[0]?.isCorrect).toBe(false)
  })

  it('does not mutate the previous state', () => {
    const prev = baseState()
    const next = reduceAnswer(prev, 'git status', true)
    expect(prev.currentScore).toBe(0)
    expect(prev.cardStates[0]).toBeNull()
    expect(next).not.toBe(prev)
    expect(next.cardStates).not.toBe(prev.cardStates)
  })
})

describe('reduceAnswer — hard mode retry sequence', () => {
  it('a wrong answer starts the retry sequence at attempt 1 with no score', () => {
    const next = reduceAnswer(baseState({ hardMode: true }), 'oops', false)
    expect(next.currentRetryAttempt).toBe(1)
    expect(next.currentScore).toBe(0)
    expect(next.totalAttempts).toBe(1)
    expect(next.cardStates[0]).toEqual({
      userAnswer: 'oops',
      isCorrect: false,
      retryCount: 0,
    })
  })

  it('correct on retry attempt 1 advances to attempt 2, still no score', () => {
    const state = baseState({ hardMode: true, currentRetryAttempt: 1, totalAttempts: 1 })
    const next = reduceAnswer(state, 'git status', true)
    expect(next.currentRetryAttempt).toBe(2)
    expect(next.currentScore).toBe(0)
    expect(next.totalAttempts).toBe(2)
  })

  it('correct on retry attempt 2 advances to attempt 3, still no score', () => {
    const state = baseState({ hardMode: true, currentRetryAttempt: 2, totalAttempts: 2 })
    const next = reduceAnswer(state, 'git status', true)
    expect(next.currentRetryAttempt).toBe(3)
    expect(next.currentScore).toBe(0)
  })

  it('correct on retry attempt 3 completes the card and awards the score', () => {
    const state = baseState({ hardMode: true, currentRetryAttempt: 3, totalAttempts: 3 })
    const next = reduceAnswer(state, 'git status', true)
    expect(next.currentRetryAttempt).toBe(0)
    expect(next.currentScore).toBe(1)
    expect(next.totalAttempts).toBe(4)
    expect(next.cardStates[0]?.isCorrect).toBe(true)
  })

  it('a wrong answer mid-retry restarts the sequence at attempt 1', () => {
    const state = baseState({ hardMode: true, currentRetryAttempt: 2, totalAttempts: 4 })
    const next = reduceAnswer(state, 'nope', false)
    expect(next.currentRetryAttempt).toBe(1)
    expect(next.currentScore).toBe(0)
  })

  it('first-try correct in hard mode completes immediately and awards the score', () => {
    const next = reduceAnswer(baseState({ hardMode: true }), 'git status', true)
    expect(next.currentRetryAttempt).toBe(0)
    expect(next.currentScore).toBe(1)
    expect(next.totalAttempts).toBe(1)
  })

  it('full sequence: wrong then three corrects scores exactly one point', () => {
    let s = baseState({ hardMode: true })
    s = reduceAnswer(s, 'wrong', false) // -> retry 1
    s = reduceAnswer(s, 'git status', true) // -> retry 2
    s = reduceAnswer(s, 'git status', true) // -> retry 3
    s = reduceAnswer(s, 'git status', true) // -> complete
    expect(s.currentScore).toBe(1)
    expect(s.currentRetryAttempt).toBe(0)
    expect(s.totalAttempts).toBe(4)
  })
})
