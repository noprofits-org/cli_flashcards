'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flashcard, CardState, AppState } from '@/lib/types/flashcard'
import { shuffleArray } from '@/lib/utils/flashcard'
import { FlashcardViewer } from '@/components/flashcards/flashcard-viewer'
import { Progress } from '@/components/ui/progress'

interface PageProps {
  params: Promise<{
    setId: string
  }>
}

export default function FlashcardsPage({ params }: PageProps) {
  const { setId } = use(params)
  const router = useRouter()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [state, setState] = useState<AppState>({
    currentIndex: 0,
    currentScore: 0,
    totalAttempts: 0,
    cardStates: [],
    isAnswered: false,
  })

  useEffect(() => {
    fetchFlashcards()
    createSession()
  }, [setId])

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`/api/flashcards/${setId}`)
      const data = await response.json()

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

  const createSession = async () => {
    try {
      const response = await fetch('/api/progress/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setId, isGuest: true }),
      })
      const data = await response.json()
      setSessionId(data.session?.id || null)
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  const handleSubmit = (answer: string, isCorrect: boolean) => {
    const newCardStates = [...state.cardStates]
    newCardStates[state.currentIndex] = { userAnswer: answer, isCorrect }

    setState(prev => ({
      ...prev,
      cardStates: newCardStates,
      isAnswered: true,
      currentScore: prev.currentScore + (isCorrect ? 1 : 0),
      totalAttempts: prev.totalAttempts + 1,
    }))
  }

  const nextCard = () => {
    if (state.currentIndex < flashcards.length - 1) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        isAnswered: prev.cardStates[prev.currentIndex + 1] !== null,
      }))
    } else {
      // Navigate to results
      router.push(
        `/results?score=${state.currentScore}&total=${state.totalAttempts}&sessionId=${sessionId}`
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && state.isAnswered) {
        nextCard()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevCard()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextCard()
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [state.isAnswered, state.currentIndex])

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
          />
        </div>
      </div>
    </main>
  )
}
