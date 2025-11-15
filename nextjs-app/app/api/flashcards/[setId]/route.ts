import { NextResponse } from 'next/server'
import flashcardsData from '@/data/flashcards.json'

export async function GET(
  request: Request,
  context: { params: Promise<{ setId: string }> }
) {
  try {
    const { setId } = await context.params

    // Get flashcards for the specified set
    const setCards = flashcardsData[setId as keyof typeof flashcardsData]

    if (!setCards) {
      return NextResponse.json({ error: 'Flashcard set not found' }, { status: 404 })
    }

    // Transform JSON data to match expected Flashcard interface
    const flashcards = setCards.map((card, index) => ({
      id: `${setId}-${index}`,
      set_id: setId,
      task: card.task,
      answer: card.answer,
      description: card.description,
      when_to_use: card.whenToUse,
      scenarios: card.scenarios,
      order_index: index
    }))

    return NextResponse.json({ flashcards })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
