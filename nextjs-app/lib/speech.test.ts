import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import {
  functionPhrase,
  isSpeechEnabled,
  setSpeechEnabled,
  isSpeechSupported,
} from './speech'

describe('functionPhrase', () => {
  it('drops the "In <tool>:" context prefix', () => {
    expect(functionPhrase('In nano: Save the current file')).toBe('Save the current file')
    expect(functionPhrase('In git: Stage all changes')).toBe('Stage all changes')
  })

  it('falls back to the full task when there is no prefix', () => {
    expect(functionPhrase('Save the current file')).toBe('Save the current file')
  })

  it('never returns an empty string', () => {
    // A prefix-only task would strip to nothing; fall back to the original.
    expect(functionPhrase('In nano:')).toBe('In nano:')
  })
})

describe('speech enabled flag', () => {
  const store = new Map<string, string>()
  const localStorageMock = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  }

  beforeAll(() => {
    vi.stubGlobal('window', { speechSynthesis: { cancel: () => {} } })
    vi.stubGlobal('localStorage', localStorageMock)
  })
  afterAll(() => vi.unstubAllGlobals())
  beforeEach(() => store.clear())

  it('reports speech as supported when speechSynthesis is present', () => {
    expect(isSpeechSupported()).toBe(true)
  })

  it('defaults to enabled when nothing is stored', () => {
    expect(isSpeechEnabled()).toBe(true)
  })

  it('round-trips an explicit disable/enable', () => {
    setSpeechEnabled(false)
    expect(isSpeechEnabled()).toBe(false)
    setSpeechEnabled(true)
    expect(isSpeechEnabled()).toBe(true)
  })
})
