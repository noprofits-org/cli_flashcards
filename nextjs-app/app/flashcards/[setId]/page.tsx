'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Flashcard, AppState } from '@/lib/types/flashcard'
import { shuffleArray } from '@/lib/utils/flashcard'
import { FlashcardViewer } from '@/components/flashcards/flashcard-viewer'
import { Progress } from '@/components/ui/progress'
import {
  useKeyboardShortcuts,
  isTypingInInput,
} from '@/lib/hooks/use-keyboard-shortcuts'

interface PageProps {
  params: Promise<{
    setId: string
  }>
}

export default function FlashcardsPage({ params }: PageProps) {
  const { setId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryHardMode = searchParams.get('hardMode') === 'true'
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)

  const [state, setState] = useState<AppState>({
    currentIndex: 0,
    currentScore: 0,
    totalAttempts: 0,
    cardStates: [],
    isAnswered: false,
    hardMode: queryHardMode,
    currentRetryAttempt: 0,
  })

  // Keep hard mode in sync with URL query
  useEffect(() => {
    setState(prev => prev.hardMode === queryHardMode ? prev : { ...prev, hardMode: queryHardMode })
  }, [queryHardMode])

  useEffect(() => {
    fetchFlashcards()
  }, [setId])

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`/api/flashcards/${setId}`)
      const data = await response.json() as { flashcards: Flashcard[] }

      if (data.flashcards) {
        const shuffled = shuffleArray(data.flashcards)
        setFlashcards(shuffled)
        setState(prev => ({
          ...prev,
          cardStates: new Array(shuffled.length).fill(null)
        }))
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (answer: string, isCorrect: boolean) => {
    const currentRetry = state.currentRetryAttempt || 0

    // Hard mode logic: wrong answer requires 3 correct retries
    if (state.hardMode && !isCorrect) {
      // Wrong answer in hard mode - start/restart retry sequence from attempt 1
      const newCardStates = [...state.cardStates]
      newCardStates[state.currentIndex] = {
        userAnswer: answer,
        isCorrect: false,
        retryCount: 0
      }

      setState(prev => ({
        ...prev,
        cardStates: newCardStates,
        isAnswered: true,
        currentRetryAttempt: 1, // Start retry sequence at attempt 1
        totalAttempts: prev.totalAttempts + 1,
      }))
      return
    }

    // Hard mode: user got it right, check if they're in retry mode
    if (state.hardMode && currentRetry > 0) {
      // They got it correct during a retry attempt
      if (currentRetry < 3) {
        // Still need more retries (attempts 1 and 2 completed, need attempt 3)
        const newCardStates = [...state.cardStates]
        newCardStates[state.currentIndex] = {
          userAnswer: answer,
          isCorrect: true,
          retryCount: currentRetry
        }

        setState(prev => ({
          ...prev,
          cardStates: newCardStates,
          isAnswered: true,
          currentRetryAttempt: currentRetry + 1, // Move to next retry attempt
          totalAttempts: prev.totalAttempts + 1,
        }))
        return
      }
      // currentRetry === 3: Completed all 3 retries successfully - fall through to mark card as complete
    }

    // Normal mode or successful completion of hard mode retries (all 3 attempts)
    const newCardStates = [...state.cardStates]
    newCardStates[state.currentIndex] = {
      userAnswer: answer,
      isCorrect,
      retryCount: currentRetry
    }

    setState(prev => ({
      ...prev,
      cardStates: newCardStates,
      isAnswered: true,
      currentScore: prev.currentScore + (isCorrect ? 1 : 0),
      totalAttempts: prev.totalAttempts + 1,
      currentRetryAttempt: 0, // Reset retry counter
    }))
  }

  const nextCard = () => {
    // In hard mode, if in retry mode, clear answer and stay on same card
    if (state.hardMode && (state.currentRetryAttempt || 0) > 0) {
      setState(prev => ({
        ...prev,
        isAnswered: false,
        // Keep currentRetryAttempt as is
      }))
      return
    }

    // Normal navigation to next card
    if (state.currentIndex < flashcards.length - 1) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        isAnswered: prev.cardStates[prev.currentIndex + 1] !== null,
        currentRetryAttempt: 0,
      }))
    } else {
      router.push(
        `/results?score=${state.currentScore}&total=${state.totalAttempts}`
      )
    }
  }

  const prevCard = () => {
    if (state.currentIndex > 0) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        isAnswered: prev.cardStates[prev.currentIndex - 1] !== null,
      }))
    }
  }

  useKeyboardShortcuts((e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      router.push('/')
      return
    }
    if (e.key === 'Enter' && state.isAnswered) {
      nextCard()
      return
    }
    if (isTypingInInput(document.activeElement)) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prevCard()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      nextCard()
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading flashcards...</div>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">No flashcards found</div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const currentFlashcard = flashcards[state.currentIndex]
  const progress = ((state.currentIndex + 1) / flashcards.length) * 100

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="w-full mb-4">
        <Progress value={progress} />
      </div>

      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-4xl py-4">
          <FlashcardViewer
            flashcard={currentFlashcard}
            cardState={state.cardStates[state.currentIndex]}
            onSubmit={handleSubmit}
            isAnswered={state.isAnswered}
            hardMode={state.hardMode}
            retryAttempt={state.currentRetryAttempt || 0}
          />
        </div>
      </div>
    </main>
  )
}
