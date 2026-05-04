'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setCopied(false), resetMs)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    },
    [resetMs]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { copied, copy }
}
