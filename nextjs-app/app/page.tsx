'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FlashcardSet } from '@/lib/types/flashcard'
import { ModeSelector } from '@/components/flashcards/mode-selector'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils/cn'
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts'
import { PenLine, CircleHelp, Brain, BookOpen } from 'lucide-react'

type StudyMode = 'flashcards' | 'quiz' | 'review' | 'reading'

export default function Home() {
  const router = useRouter()
  const [sets, setSets] = useState<FlashcardSet[]>([])
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSets()
  }, [])

  const startSet = (setId: string) => {
    setSelectedSetId(setId)
    if (studyMode === 'quiz') {
      router.push(`/quiz/${setId}`)
    } else if (studyMode === 'review') {
      router.push(`/review/${setId}`)
    } else if (studyMode === 'reading') {
      router.push(`/guides/${setId}`)
    } else {
      // Always use hard mode
      router.push(`/flashcards/${setId}?hardMode=true`)
    }
  }

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
      startSet(selectedSetId)
    }
  }

  useKeyboardShortcuts((e) => {
    if (e.key === 'Enter' && selectedSetId) {
      startSet(selectedSetId)
    }
  })

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

      <div className="flex-1 flex justify-center">
        <div className="flex flex-col items-center gap-8 text-center max-w-4xl w-full pt-8 md:pt-16">
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
              {/* Study Mode Selector */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col md:flex-row gap-2 p-1 bg-muted rounded-xl">
                  <button
                    onClick={() => setStudyMode('flashcards')}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all border',
                      studyMode === 'flashcards'
                        ? 'bg-primary/10 text-foreground border-primary/60 ring-2 ring-primary/25 shadow-lg'
                        : 'text-muted-foreground hover:text-foreground border-transparent'
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <PenLine className="w-5 h-5" />
                      <span>Flashcards</span>
                      <span className="text-xs font-normal opacity-70">Type the answer</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setStudyMode('quiz')}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all border',
                      studyMode === 'quiz'
                        ? 'bg-primary/10 text-foreground border-primary/60 ring-2 ring-primary/25 shadow-lg'
                        : 'text-muted-foreground hover:text-foreground border-transparent'
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <CircleHelp className="w-5 h-5" />
                      <span>Quiz Mode</span>
                      <span className="text-xs font-normal opacity-70">Multiple choice</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setStudyMode('review')}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all border',
                      studyMode === 'review'
                        ? 'bg-primary/10 text-foreground border-primary/60 ring-2 ring-primary/25 shadow-lg'
                        : 'text-muted-foreground hover:text-foreground border-transparent'
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Brain className="w-5 h-5" />
                      <span>Smart Review</span>
                      <span className="text-xs font-normal opacity-70">Spaced repetition</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setStudyMode('reading')}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all border',
                      studyMode === 'reading'
                        ? 'bg-primary/10 text-foreground border-primary/60 ring-2 ring-primary/25 shadow-lg'
                        : 'text-muted-foreground hover:text-foreground border-transparent'
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <BookOpen className="w-5 h-5" />
                      <span>Reading</span>
                      <span className="text-xs font-normal opacity-70">Guides & tips</span>
                    </div>
                  </button>
                </div>
              </div>

              <ModeSelector
                sets={sets}
                selectedSetId={selectedSetId}
                selectedCategory={selectedCategory}
                onSelectSet={setSelectedSetId}
                onSelectCategory={setSelectedCategory}
              />

              <Button onClick={handleStart} size="lg" disabled={!selectedSetId}>
                {studyMode === 'quiz'
                  ? 'Start Quiz'
                  : studyMode === 'review'
                  ? 'Start Review'
                  : studyMode === 'reading'
                  ? 'Start Reading'
                  : 'Start Learning'}
              </Button>

              <div className="text-sm text-muted-foreground/70">
                Select a topic and press Enter to start
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">
              <p>Couldn&apos;t load topics.</p>
              <p className="text-sm mt-2">
                Please refresh the page or try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
