import { NextResponse } from 'next/server'
import { allUniqueAnswers, FlashcardModule, getModule } from '@/lib/data/modules'
import { shuffleArray } from '@/lib/utils/flashcard'

interface QuizQuestion {
  id: string
  question: string
  correctAnswer: string
  options: string[]
  hint?: string
  explanation?: string
}

function pickWrongOptions(correctAnswer: string, count: number): string[] {
  // Filter out correct answer, then shuffle and take `count`. Source pool is
  // already deduplicated at module load (lib/data/modules.ts).
  const pool = allUniqueAnswers.filter(a => a !== correctAnswer)
  return shuffleArray(pool).slice(0, count)
}

function generateQuizQuestions(module: FlashcardModule): QuizQuestion[] {
  return module.cards.map(card => {
    const wrongOptions = pickWrongOptions(card.answer, 3)
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
    const rawLimit = parseInt(url.searchParams.get('limit') || '10', 10)
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 50) : 10

    const moduleData = getModule(setId)
    if (!moduleData) {
      return NextResponse.json({ error: 'Quiz set not found' }, { status: 404 })
    }

    const questions = shuffleArray(generateQuizQuestions(moduleData))
      .slice(0, Math.min(limit, moduleData.cards.length))

    return NextResponse.json({
      questions,
      metadata: {
        setId,
        title: moduleData.title,
        totalQuestions: questions.length,
        totalAvailable: moduleData.cards.length,
      },
    })
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
