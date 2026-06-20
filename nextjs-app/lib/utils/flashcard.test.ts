import { describe, it, expect } from 'vitest'
import {
  normalizeAnswer,
  isAnswerCorrect,
  shuffleArray,
  calculatePercentage,
} from './flashcard'

describe('normalizeAnswer', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalizeAnswer('  Git   STATUS  ')).toBe('git status')
  })

  it('strips [optional] bracketed content', () => {
    expect(normalizeAnswer('git commit [options]')).toBe('git commit')
    expect(normalizeAnswer('npm install [package]')).toBe('npm install')
  })

  it('strips <placeholder> angle brackets', () => {
    expect(normalizeAnswer('cd <directory>')).toBe('cd')
    expect(normalizeAnswer('git checkout <branch>')).toBe('git checkout')
  })

  it('leaves a plain command unchanged apart from case/space', () => {
    expect(normalizeAnswer('ls -la')).toBe('ls -la')
  })
})

describe('isAnswerCorrect', () => {
  it('matches case-insensitively', () => {
    expect(isAnswerCorrect('GIT STATUS', 'git status')).toBe(true)
  })

  it('ignores surrounding and repeated whitespace', () => {
    expect(isAnswerCorrect('  git   status ', 'git status')).toBe(true)
  })

  it('treats bracketed placeholders as optional', () => {
    expect(isAnswerCorrect('git commit', 'git commit [options]')).toBe(true)
    expect(isAnswerCorrect('cd', 'cd <directory>')).toBe(true)
  })

  it('rejects a genuinely different answer', () => {
    expect(isAnswerCorrect('git pull', 'git push')).toBe(false)
  })

  it('matches the nano go-to-line shortcut typed literally', () => {
    expect(isAnswerCorrect('Ctrl+_', 'Ctrl+_')).toBe(true)
    expect(isAnswerCorrect('ctrl+_', 'Ctrl+_')).toBe(true)
  })
})

describe('shuffleArray', () => {
  it('returns a new array and does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5]
    const copy = [...input]
    const out = shuffleArray(input)
    expect(out).not.toBe(input)
    expect(input).toEqual(copy)
  })

  it('preserves all elements (a permutation)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8]
    const out = shuffleArray(input)
    expect([...out].sort((a, b) => a - b)).toEqual(input)
  })

  it('handles empty and single-element arrays', () => {
    expect(shuffleArray([])).toEqual([])
    expect(shuffleArray([42])).toEqual([42])
  })
})

describe('calculatePercentage', () => {
  it('rounds to the nearest integer percent', () => {
    expect(calculatePercentage(1, 3)).toBe(33)
    expect(calculatePercentage(2, 3)).toBe(67)
  })

  it('returns 0 when total is 0 (no divide-by-zero)', () => {
    expect(calculatePercentage(0, 0)).toBe(0)
  })

  it('returns 100 for a perfect score', () => {
    expect(calculatePercentage(5, 5)).toBe(100)
  })
})
