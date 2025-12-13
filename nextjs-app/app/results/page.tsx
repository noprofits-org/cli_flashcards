'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { calculatePercentage, getScoreMessage } from '@/lib/utils/flashcard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PartyPopper } from 'lucide-react'

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const scoreParam = searchParams.get('score')
    const totalParam = searchParams.get('total')
    const sessionIdParam = searchParams.get('sessionId')

    if (scoreParam && totalParam) {
      const scoreNum = parseInt(scoreParam, 10)
      const totalNum = parseInt(totalParam, 10)
      setScore(scoreNum)
      setTotal(totalNum)
      setSessionId(sessionIdParam)

      // Update session as completed
      if (sessionIdParam) {
        updateSession(sessionIdParam, scoreNum, totalNum)
      }
    }
  }, [searchParams])

  const updateSession = async (id: string, finalScore: number, finalTotal: number) => {
    try {
      await fetch('/api/progress/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: id,
          score: finalScore,
          totalAttempts: finalTotal,
          completed: true,
        }),
      })
    } catch (error) {
      console.error('Error updating session:', error)
    }
  }

  const handleRestart = () => {
    router.push('/')
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleRestart()
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [])

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
            Session Complete! <PartyPopper className="w-10 h-10 text-primary" />
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
                  Total
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
