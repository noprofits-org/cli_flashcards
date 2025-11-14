'use client'

import { useState } from 'react'
import { Flashcard, CardState } from '@/lib/types/flashcard'
import { isAnswerCorrect } from '@/lib/utils/flashcard'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

interface FlashcardViewerProps {
  flashcard: Flashcard
  cardState: CardState | null
  onSubmit: (answer: string, isCorrect: boolean) => void
  isAnswered: boolean
}

export function FlashcardViewer({ flashcard, cardState, onSubmit, isAnswered }: FlashcardViewerProps) {
  const [userAnswer, setUserAnswer] = useState(cardState?.userAnswer || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAnswered) return

    const correct = isAnswerCorrect(userAnswer, flashcard.answer)
    onSubmit(userAnswer, correct)
  }

  const scenarios = Array.isArray(flashcard.scenarios)
    ? flashcard.scenarios
    : typeof flashcard.scenarios === 'string'
    ? JSON.parse(flashcard.scenarios)
    : []

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      {/* Context above card */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">What it does</div>
          <div className="text-sm text-muted-foreground leading-relaxed">{flashcard.description}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">When to use it</div>
          <div className="text-sm text-muted-foreground leading-relaxed">{flashcard.when_to_use}</div>
        </div>
      </div>

      {/* Main card */}
      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="text-xl md:text-2xl font-medium leading-relaxed">{flashcard.task}</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="clasp ..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              disabled={isAnswered}
              className="text-base md:text-lg py-3"
            />

            {isAnswered && (
              <>
                <div className="p-4 bg-muted rounded-lg border-l-4 border-primary font-mono text-sm">
                  {flashcard.answer}
                </div>

                <div
                  className={cn(
                    'p-3 rounded-lg text-sm font-medium text-center',
                    cardState?.isCorrect
                      ? 'bg-success/10 text-success border border-success'
                      : 'bg-error/10 text-error border border-error'
                  )}
                >
                  {cardState?.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Context below card */}
      <div className="flex flex-col gap-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">Example scenarios</div>
        <ul className="space-y-2">
          {scenarios.map((scenario: string, index: number) => (
            <li key={index} className="text-sm text-muted-foreground leading-relaxed pl-4 relative">
              <span className="absolute left-0 text-primary font-bold">→</span>
              {scenario}
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation hints */}
      <div className="flex justify-between text-xs text-muted-foreground/60 px-4">
        <span>← Previous</span>
        <span>Enter to submit/continue</span>
        <span>Next →</span>
      </div>
    </div>
  )
}
