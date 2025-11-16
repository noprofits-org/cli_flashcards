'use client'

import { useState, useEffect, useRef } from 'react'
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
  hardMode: boolean
  retryAttempt: number
}

export function FlashcardViewer({ flashcard, cardState, onSubmit, isAnswered, hardMode, retryAttempt }: FlashcardViewerProps) {
  const [userAnswer, setUserAnswer] = useState(cardState?.userAnswer || '')
  const inputRef = useRef<HTMLInputElement>(null)

  // Determine if we should show the answer
  // In hard mode: show answer when wrong (retryAttempt=1 after wrong answer) and during retry attempts 1-2
  // In normal mode: only show after answering
  const shouldShowAnswer = hardMode
    ? (retryAttempt >= 1 && retryAttempt <= 2) // Show after wrong answer and during retry attempts 1-2
    : isAnswered // Normal mode: only show after answering

  // In hard mode attempt 3, always hide the answer (whether answered or not)
  const shouldHideAnswer = hardMode && retryAttempt === 3

  // Clear input and focus when flashcard changes (unless it's already been answered)
  useEffect(() => {
    if (cardState && isAnswered) {
      // Card was previously answered and still in answered state, restore the answer
      setUserAnswer(cardState.userAnswer)
    } else {
      // New card OR retry attempt (isAnswered is false), clear the input and focus
      setUserAnswer('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [flashcard.id, cardState, isAnswered])

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
              ref={inputRef}
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

            {/* Hard Mode: Show retry progress (show even when not answered if in retry mode) */}
            {hardMode && retryAttempt > 0 && (
              <div className="p-3 bg-primary/10 border border-primary rounded-lg text-sm">
                <div className="font-semibold text-primary mb-1">Hard Mode - Retry Challenge</div>
                <div className="text-muted-foreground">
                  {retryAttempt === 3 ? (
                    <span>Attempt 3/3 - Type from memory (answer hidden)</span>
                  ) : (
                    <span>Attempt {retryAttempt}/3 - Type the correct answer shown below</span>
                  )}
                </div>
              </div>
            )}

            {/* Show answer (unless hard mode attempt 3) */}
            {shouldShowAnswer && (
              <div className="p-4 bg-muted rounded-lg border-l-4 border-primary font-mono text-sm">
                {flashcard.answer}
              </div>
            )}

            {/* Hide answer on 3rd attempt in hard mode */}
            {shouldHideAnswer && (
              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-muted text-sm text-center text-muted-foreground italic">
                Answer hidden - type from memory
              </div>
            )}

            {isAnswered && (
              <>
                {/* Feedback - only show if not in retry mode OR they got it wrong */}
                {(!hardMode || retryAttempt === 0 || !cardState?.isCorrect) && (
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
                )}

                {/* Show success message when all retries completed */}
                {hardMode && retryAttempt === 0 && cardState?.isCorrect && cardState.retryCount && cardState.retryCount >= 3 && (
                  <div className="p-3 rounded-lg text-sm font-medium text-center bg-success/10 text-success border border-success">
                    🎉 All 3 retries completed successfully! Press Enter to continue.
                  </div>
                )}
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
        <span>Enter to submit/continue • Esc to go home</span>
        <span>Next →</span>
      </div>
    </div>
  )
}
