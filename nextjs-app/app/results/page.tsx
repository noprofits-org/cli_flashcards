'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { calculatePercentage, getScoreMessage } from '@/lib/utils/flashcard'
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PartyPopper } from 'lucide-react'

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [mode, setMode] = useState<string | null>(null)

  useEffect(() => {
    const scoreParam = searchParams.get('score')
    const totalParam = searchParams.get('total')

    if (scoreParam && totalParam) {
      setScore(parseInt(scoreParam, 10))
      setTotal(parseInt(totalParam, 10))
    }
    setMode(searchParams.get('mode'))
  }, [searchParams])

  const isReview = mode === 'review'
  const heading = isReview ? 'Review Complete!' : 'Session Complete!'
  // Both modes report real session correctness now, so "Correct" is accurate.
  // The second tile counts cards reviewed (review) vs total attempts (flashcards).
  const totalLabel = isReview ? 'Reviewed' : 'Total'

  const handleRestart = () => {
    router.push('/')
  }

  useKeyboardShortcuts((e) => {
    if (e.key === 'Enter') {
      handleRestart()
    }
  })

  const percentage = calculatePercentage(score, total)
  const message = getScoreMessage(percentage)

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="w-full mb-4">
        <Progress value={100} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8 text-center max-w-2xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold inline-flex items-center gap-3">
            {heading} <PartyPopper className="w-10 h-10 text-primary" />
          </h1>

          <div className="text-6xl md:text-7xl font-bold text-primary">
            {score}/{total}
          </div>

          <div className="text-xl md:text-2xl text-muted-foreground">
            {percentage}% Correct • {message}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                  Correct
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">{total}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                  {totalLabel}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button onClick={handleRestart} size="lg">
            Start Over
          </Button>

          <div className="text-sm text-muted-foreground/70">
            Press Enter to start over
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading results...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
