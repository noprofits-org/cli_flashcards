'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils/cn'
import { Check, X } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  correctAnswer: string
  options: string[]
  hint?: string
  explanation?: string
}

interface QuizState {
  currentIndex: number
  score: number
  answers: Record<string, string>
  showResult: boolean
  selectedOption: string | null
}

interface PageProps {
  params: Promise<{ setId: string }>
}

export default function QuizPage({ params }: PageProps) {
  const { setId } = use(params)
  const router = useRouter()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [showHint, setShowHint] = useState(false)

  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    score: 0,
    answers: {},
    showResult: false,
    selectedOption: null,
  })

  useEffect(() => {
    fetchQuiz()
  }, [setId])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/${setId}?limit=10`)
      const data = await response.json()

      if (data.questions) {
        setQuestions(data.questions)
        setTitle(data.metadata?.title || setId)
      }
    } catch (error) {
      console.error('Error fetching quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOption = (option: string) => {
    if (state.showResult) return
    setState(prev => ({ ...prev, selectedOption: option }))
  }

  const handleSubmit = () => {
    if (!state.selectedOption) return

    const currentQuestion = questions[state.currentIndex]
    const isCorrect = state.selectedOption === currentQuestion.correctAnswer

    setState(prev => ({
      ...prev,
      score: prev.score + (isCorrect ? 1 : 0),
      answers: { ...prev.answers, [currentQuestion.id]: prev.selectedOption! },
      showResult: true,
    }))
    setShowHint(false)
  }

  const handleNext = () => {
    if (state.currentIndex < questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        showResult: false,
        selectedOption: null,
      }))
      setShowHint(false)
    } else {
      // Quiz complete - go to results
      router.push(`/results?score=${state.score}&total=${questions.length}&mode=quiz&setId=${setId}`)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (state.showResult) {
          handleNext()
        } else if (state.selectedOption) {
          handleSubmit()
        }
      } else if (e.key === 'Escape') {
        router.push('/')
      } else if (!state.showResult && ['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key) - 1
        if (index < questions[state.currentIndex]?.options.length) {
          handleSelectOption(questions[state.currentIndex].options[index])
        }
      } else if (e.key === 'h' || e.key === 'H') {
        setShowHint(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.showResult, state.selectedOption, state.currentIndex, questions])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading quiz...</div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">No quiz questions available</div>
          <button onClick={() => router.push('/')} className="mt-4 text-primary hover:underline">
            Go back
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[state.currentIndex]
  const progress = ((state.currentIndex + 1) / questions.length) * 100

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Progress bar */}
      <div className="w-full mb-4">
        <Progress value={progress} />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Question {state.currentIndex + 1} of {questions.length}</span>
          <span>Score: {state.score}/{state.currentIndex + (state.showResult ? 1 : 0)}</span>
        </div>
      </div>

      {/* Quiz content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-6">
          {/* Question */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded">
                  QUIZ
                </span>
                <span className="text-xs text-muted-foreground">{title}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = state.selectedOption === option
                  const isCorrect = option === currentQuestion.correctAnswer
                  const showCorrectness = state.showResult

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(option)}
                      disabled={state.showResult}
                      className={cn(
                        'w-full p-4 text-left rounded-lg border-2 transition-all font-mono text-sm',
                        'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20',
                        !showCorrectness && isSelected && 'border-primary bg-primary/5',
                        !showCorrectness && !isSelected && 'border-border bg-card',
                        showCorrectness && isCorrect && 'border-success bg-success/10',
                        showCorrectness && isSelected && !isCorrect && 'border-error bg-error/10',
                        showCorrectness && !isSelected && !isCorrect && 'border-border bg-card opacity-50'
                      )}
                    >
                      <span className="text-muted-foreground mr-2">{index + 1}.</span>
                      {option}
                      {showCorrectness && isCorrect && (
                        <Check className="float-right text-success w-5 h-5" />
                      )}
                      {showCorrectness && isSelected && !isCorrect && (
                        <X className="float-right text-error w-5 h-5" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Hint toggle */}
              {!state.showResult && currentQuestion.hint && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowHint(prev => !prev)}
                    className="text-sm text-muted-foreground hover:text-primary underline"
                  >
                    {showHint ? 'Hide hint' : 'Show hint (H)'}
                  </button>
                  {showHint && (
                    <div className="mt-2 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                      <strong>Hint:</strong> {currentQuestion.hint}
                    </div>
                  )}
                </div>
              )}

              {/* Result feedback */}
              {state.showResult && (
                <div className={cn(
                  'mt-4 p-4 rounded-lg',
                  state.selectedOption === currentQuestion.correctAnswer
                    ? 'bg-success/10 border border-success'
                    : 'bg-error/10 border border-error'
                )}>
                  <div className={cn(
                    'font-semibold mb-2',
                    state.selectedOption === currentQuestion.correctAnswer ? 'text-success' : 'text-error'
                  )}>
                    <span className="inline-flex items-center gap-1">
                      {state.selectedOption === currentQuestion.correctAnswer
                        ? <><Check className="w-4 h-4" /> Correct!</>
                        : <><X className="w-4 h-4" /> Incorrect</>}
                    </span>
                  </div>
                  {currentQuestion.explanation && (
                    <div className="text-sm text-muted-foreground">
                      {currentQuestion.explanation}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/')}>
              Exit Quiz
            </Button>

            {!state.showResult ? (
              <Button onClick={handleSubmit} disabled={!state.selectedOption}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {state.currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            )}
          </div>

          {/* Keyboard hints */}
          <div className="text-center text-xs text-muted-foreground/60">
            Press 1-4 to select • Enter to submit/continue • H for hint • Esc to exit
          </div>
        </div>
      </div>
    </main>
  )
}
