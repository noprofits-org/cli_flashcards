'use client'

import { useEffect, useRef } from 'react'

type KeyboardHandler = (event: KeyboardEvent) => void

interface Options {
  enabled?: boolean
  eventType?: 'keydown' | 'keyup'
}

/**
 * Attach a single window-level keyboard listener whose callback always sees
 * the latest state. Avoids the stale-closure bugs that arise from listing
 * every referenced state value in a useEffect dep array.
 */
export function useKeyboardShortcuts(handler: KeyboardHandler, options: Options = {}) {
  const { enabled = true, eventType = 'keydown' } = options
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    if (!enabled) return
    const listener = (event: KeyboardEvent) => handlerRef.current(event)
    window.addEventListener(eventType, listener)
    return () => window.removeEventListener(eventType, listener)
  }, [enabled, eventType])
}

/** True when the user is typing in an input/textarea/contenteditable. */
export function isTypingInInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}
