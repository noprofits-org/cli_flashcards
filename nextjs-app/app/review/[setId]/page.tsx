'use client'

import { use, useEffect, useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Flashcard } from '@/lib/types/flashcard'
import { useSpacedRepetition } from '@/lib/hooks/use-spaced-repetition'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import { isAnswerCorrect } from '@/lib/utils/flashcard'
import { Check, X, Flame, PartyPopper } from 'lucide-react'

interface PageProps {
  params: Promise<{ setId: string }>
}

export default function ReviewPage({ params }: PageProps) {
  const { setId } = use(params)
  const router = useRouter()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')

  // Study state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)

  // Frozen study order for the session - prevents cards from shifting mid-review
  const [sessionStudyOrder, setSessionStudyOrder] = useState<string[]>([])
  const sessionInitialized = useRef(false)

  // Get card IDs for SRS
  const cardIds = useMemo(() => flashcards.map(f => f.id), [flashcards])

  const {
    stats,
    studyOrder,
    getProgress,
    recordAnswer,
    resetProgress,
  } = useSpacedRepetition({ setId, cardIds })

  useEffect(() => {
    fetchFlashcards()
  }, [setId])

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`/api/flashcards/${setId}`)
      const data = await response.json()

      if (data.flashcards) {
        setFlashcards(data.flashcards)
        setTitle(data.metadata?.title || setId)
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initialize session study order once when studyOrder first becomes available
  useEffect(() => {
    if (!sessionInitialized.current && studyOrder.length > 0 && flashcards.length > 0) {
      setSessionStudyOrder([...studyOrder])
      sessionInitialized.current = true
    }
  }, [studyOrder, flashcards])

  // Get current card from FROZEN session study order (not the live studyOrder)
  const currentCard = useMemo(() => {
    if (sessionStudyOrder.length === 0 || currentIndex >= sessionStudyOrder.length) return null
    const cardId = sessionStudyOrder[currentIndex]
    return flashcards.find(f => f.id === cardId) || null
  }, [flashcards, sessionStudyOrder, currentIndex])

  const currentProgress = useMemo(() => {
    if (!currentCard) return null
    return getProgress(currentCard.id)
  }, [currentCard, getProgress])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAnswered || !currentCard) return

    const correct = isAnswerCorrect(userAnswer, currentCard.answer)
    recordAnswer(currentCard.id, correct)
    setLastCorrect(correct)
    setIsAnswered(true)
  }

  const handleNext = () => {
    if (currentIndex < sessionStudyOrder.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserAnswer('')
      setIsAnswered(false)
      setLastCorrect(null)
    } else {
      // Review complete
      router.push(`/results?score=${stats.masteredCards}&total=${stats.totalCards}&mode=review&setId=${setId}`)
    }
  }

  const handleReset = () => {
    if (confirm('Reset all progress for this set? This cannot be undone.')) {
      resetProgress()
      // Reset session state and allow reinitialization
      sessionInitialized.current = false
      setSessionStudyOrder([])
      setCurrentIndex(0)
      setUserAnswer('')
      setIsAnswered(false)
      setLastCorrect(null)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (isAnswered) {
          handleNext()
        } else if (userAnswer.trim()) {
          handleSubmit(e as unknown as React.FormEvent)
        }
      } else if (e.key === 'Escape') {
        router.push('/')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAnswered, userAnswer, currentIndex])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading review...</div>
      </div>
    )
  }

  // Show stats dashboard if no cards due
  if (sessionStudyOrder.length === 0 || !currentCard) {
    return (
      <main className="min-h-screen flex flex-col p-4 md:p-8">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6 text-center">
            <PartyPopper className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold">All Caught Up!</h1>
            <p className="text-muted-foreground">
              No cards due for review right now. Come back later!
            </p>

            {/* Stats Card */}
            <Card className="text-left">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-lg">{title} Progress</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Cards</div>
                    <div className="text-2xl font-bold">{stats.totalCards}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Mastered</div>
                    <div className="text-2xl font-bold text-success">{stats.masteredCards}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Learning</div>
                    <div className="text-2xl font-bold text-primary">{stats.learningCards}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">New</div>
                    <div className="text-2xl font-bold text-muted-foreground">{stats.newCards}</div>
                  </div>
                </div>

                {/* Mastery Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Mastery</span>
                    <span>{Math.round((stats.masteredCards / stats.totalCards) * 100)}%</span>
                  </div>
                  <Progress value={(stats.masteredCards / stats.totalCards) * 100} />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/')}>
                Back Home
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset Progress
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const progress = ((currentIndex + 1) / sessionStudyOrder.length) * 100
  const masteryLabels = ['New', 'Learning', 'Review', 'Familiar', 'Known', 'Mastered']
  const masteryColors = ['bg-gray-400', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-emerald-500']

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Progress bar */}
      <div className="w-full mb-4">
        <Progress value={progress} />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Card {currentIndex + 1} of {sessionStudyOrder.length} due</span>
          <span>
            Mastered: {stats.masteredCards}/{stats.totalCards}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-6">
          {/* Current card mastery indicator */}
          {currentProgress && (
            <div className="flex items-center gap-2 text-sm">
              <span className={cn(
                'px-2 py-1 rounded text-white text-xs font-semibold',
                masteryColors[currentProgress.masteryLevel]
              )}>
                {masteryLabels[currentProgress.masteryLevel]}
              </span>
              <span className="text-muted-foreground">
                Reviewed {currentProgress.reviewCount} times
                {currentProgress.correctStreak > 0 && (
                  <span className="text-success ml-2 inline-flex items-center gap-1">
                    <Flame className="w-4 h-4" /> {currentProgress.correctStreak} streak
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Context */}
          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">What it does</div>
              <div className="text-sm text-muted-foreground">{currentCard.description}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">When to use it</div>
              <div className="text-sm text-muted-foreground">{currentCard.when_to_use}</div>
            </div>
          </div>

          {/* Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-semibold bg-purple-500/10 text-purple-500 rounded">
                  SPACED REVIEW
                </span>
                <span className="text-xs text-muted-foreground">{title}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-medium leading-relaxed">
                {currentCard.task}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  disabled={isAnswered}
                  className="text-base md:text-lg py-3 font-mono"
                  autoFocus
                />

                {isAnswered && (
                  <>
                    {/* Correct answer */}
                    <div className="p-4 bg-muted rounded-lg border-l-4 border-primary font-mono text-sm">
                      {currentCard.answer}
                    </div>

                    {/* Feedback */}
                    <div className={cn(
                      'p-3 rounded-lg text-sm font-medium text-center',
                      lastCorrect
                        ? 'bg-success/10 text-success border border-success'
                        : 'bg-error/10 text-error border border-error'
                    )}>
                      <span className="inline-flex items-center gap-1">
                      {lastCorrect
                        ? <><Check className="w-4 h-4" /> Correct! Moving up in mastery.</>
                        : <><X className="w-4 h-4" /> Incorrect. We&apos;ll review this again soon.</>}
                    </span>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/')}>
              Exit Review
            </Button>

            {!isAnswered ? (
              <Button onClick={handleSubmit} disabled={!userAnswer.trim()}>
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentIndex < sessionStudyOrder.length - 1 ? 'Next Card' : 'Finish Review'}
              </Button>
            )}
          </div>

          {/* Keyboard hints */}
          <div className="text-center text-xs text-muted-foreground/60">
            Enter to submit/continue • Esc to exit
          </div>
        </div>
      </div>
    </main>
  )
}
