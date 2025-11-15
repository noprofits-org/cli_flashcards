'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FlashcardSet } from '@/lib/types/flashcard'
import { ModeSelector } from '@/components/flashcards/mode-selector'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function Home() {
  const router = useRouter()
  const [sets, setSets] = useState<FlashcardSet[]>([])
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
  const [hardMode, setHardMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSets()
  }, [])

  const fetchSets = async () => {
    try {
      const response = await fetch('/api/flashcards/sets')
      const data = await response.json()
      setSets(data.sets || [])

      // Auto-select first set (basic)
      if (data.sets && data.sets.length > 0) {
        setSelectedSetId(data.sets[0].id)
      }
    } catch (error) {
      console.error('Error fetching sets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = () => {
    if (selectedSetId) {
      router.push(`/flashcards/${selectedSetId}?hardMode=${hardMode}`)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && selectedSetId) {
      handleStart()
    }
  }

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [selectedSetId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="w-full mb-4">
        <Progress value={0} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8 text-center max-w-4xl w-full">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Master CLI Commands
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Learn essential command-line tools with interactive flashcards
            </p>
          </div>

          {sets.length > 0 ? (
            <>
              <ModeSelector
                sets={sets}
                selectedSetId={selectedSetId}
                onSelectSet={setSelectedSetId}
              />

              {/* Hard Mode Toggle */}
              <div className="flex items-center gap-3 p-4 bg-card border-2 border-border rounded-xl">
                <input
                  type="checkbox"
                  id="hardMode"
                  checked={hardMode}
                  onChange={(e) => setHardMode(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <label htmlFor="hardMode" className="flex flex-col cursor-pointer">
                  <span className="text-sm font-semibold text-foreground">Hard Mode</span>
                  <span className="text-xs text-muted-foreground">
                    Wrong answers require 3 correct retries before proceeding
                  </span>
                </label>
              </div>

              <Button onClick={handleStart} size="lg" disabled={!selectedSetId}>
                Start Learning
              </Button>

              <div className="text-sm text-muted-foreground/70">
                Select a mode and press Enter to start
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">
              <p>No flashcard sets available.</p>
              <p className="text-sm mt-2">
                Please run the database migrations to seed the data.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
