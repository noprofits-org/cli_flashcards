/**
 * Spoken function cues via the Web Speech API. When a learner enters a
 * keyboard command correctly, the browser speaks what that command does
 * (e.g. pressing Ctrl+O → "Save the current file"), reinforcing the
 * association between the chord and its function.
 *
 * Everything here is a no-op when the API is unavailable or the user has
 * muted cues, so callers can speak() unconditionally.
 */

const SPEECH_ENABLED_KEY = 'flashcards_speech_enabled'

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Cues default to ON; only an explicit "false" disables them. */
export function isSpeechEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(SPEECH_ENABLED_KEY) !== 'false'
}

export function setSpeechEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SPEECH_ENABLED_KEY, String(enabled))
  if (!enabled && isSpeechSupported()) window.speechSynthesis.cancel()
}

/** Speak a short phrase. No-op if the API is unsupported or cues are muted. */
export function speak(text: string): void {
  if (!isSpeechSupported() || !isSpeechEnabled()) return
  const synth = window.speechSynthesis
  // Drop anything queued or mid-utterance so rapid answers don't stack up.
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
  utterance.pitch = 1
  synth.speak(utterance)
}

/**
 * Derive the spoken function phrase from a card's task prompt, dropping the
 * "In <tool>:" context prefix — e.g. "In nano: Save the current file" becomes
 * "Save the current file". Falls back to the full task if there's no prefix.
 */
export function functionPhrase(task: string): string {
  return task.replace(/^In\s+[^:]+:\s*/i, '').trim() || task
}
