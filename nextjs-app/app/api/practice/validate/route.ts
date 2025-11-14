import { NextResponse } from 'next/server'
import { isAnswerCorrect } from '@/lib/utils/flashcard'

export async function POST(request: Request) {
  try {
    const { userAnswer, correctAnswer } = await request.json()

    if (!userAnswer || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const isCorrect = isAnswerCorrect(userAnswer, correctAnswer)

    return NextResponse.json({ isCorrect })
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
