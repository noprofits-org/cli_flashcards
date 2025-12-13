import { NextResponse } from 'next/server'

// Import all module data statically
import claspBasics from '@/data/clasp-basics.json'
import claspAdvanced from '@/data/clasp-advanced.json'
import claspScenarios from '@/data/clasp-scenarios.json'
import claspFundamentals from '@/data/clasp-fundamentals.json'
import claspTroubleshooting from '@/data/clasp-troubleshooting.json'
import gitBasics from '@/data/git-basics.json'
import gitBranching from '@/data/git-branching.json'
import gitTroubleshooting from '@/data/git-troubleshooting.json'

interface FlashcardModule {
  id: string
  title: string
  cards: Array<{
    id: string
    task: string
    answer: string
    description: string
    whenToUse: string
    scenarios: string[]
  }>
}

interface QuizQuestion {
  id: string
  question: string
  correctAnswer: string
  options: string[]
  hint?: string
  explanation?: string
}

const moduleMap: Record<string, FlashcardModule> = {
  'clasp-basics': claspBasics as FlashcardModule,
  'clasp-advanced': claspAdvanced as FlashcardModule,
  'clasp-scenarios': claspScenarios as FlashcardModule,
  'clasp-fundamentals': claspFundamentals as FlashcardModule,
  'clasp-troubleshooting': claspTroubleshooting as FlashcardModule,
  'git-basics': gitBasics as FlashcardModule,
  'git-branching': gitBranching as FlashcardModule,
  'git-troubleshooting': gitTroubleshooting as FlashcardModule,
}

// Get all answers from all modules for generating wrong options
function getAllAnswers(): string[] {
  const answers: string[] = []
  Object.values(moduleMap).forEach(module => {
    module.cards.forEach(card => {
      answers.push(card.answer)
    })
  })
  return answers
}

// Shuffle array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Generate wrong answers that are plausible (from same category or similar commands)
function generateWrongOptions(
  correctAnswer: string,
  allAnswers: string[],
  count: number = 3
): string[] {
  // Filter out the correct answer and get unique wrong options
  const wrongOptions = allAnswers
    .filter(a => a !== correctAnswer)
    .filter((a, i, arr) => arr.indexOf(a) === i) // unique

  // Shuffle and pick the first 'count' options
  return shuffleArray(wrongOptions).slice(0, count)
}

// Transform flashcards into quiz questions
function generateQuizQuestions(module: FlashcardModule, allAnswers: string[]): QuizQuestion[] {
  return module.cards.map(card => {
    const wrongOptions = generateWrongOptions(card.answer, allAnswers, 3)
    const options = shuffleArray([card.answer, ...wrongOptions])

    return {
      id: card.id,
      question: card.task,
      correctAnswer: card.answer,
      options,
      hint: card.whenToUse,
      explanation: card.description,
    }
  })
}

export async function GET(
  request: Request,
  context: { params: Promise<{ setId: string }> }
) {
  try {
    const { setId } = await context.params
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)

    const moduleData = moduleMap[setId]

    if (!moduleData) {
      return NextResponse.json({ error: 'Quiz set not found' }, { status: 404 })
    }

    const allAnswers = getAllAnswers()
    let questions = generateQuizQuestions(moduleData, allAnswers)

    // Shuffle and limit questions
    questions = shuffleArray(questions).slice(0, Math.min(limit, questions.length))

    return NextResponse.json({
      questions,
      metadata: {
        setId,
        title: moduleData.title,
        totalQuestions: questions.length,
        totalAvailable: moduleData.cards.length,
      }
    })
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
