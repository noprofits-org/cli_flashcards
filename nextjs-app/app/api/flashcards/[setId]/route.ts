import { NextResponse } from 'next/server'
import { getModule } from '@/lib/data/modules'

export async function GET(
  request: Request,
  context: { params: Promise<{ setId: string }> }
) {
  try {
    const { setId } = await context.params
    const moduleData = getModule(setId)

    if (!moduleData) {
      return NextResponse.json({ error: 'Flashcard set not found' }, { status: 404 })
    }

    const flashcards = moduleData.cards.map((card, index) => ({
      id: card.id || `${setId}-${index}`,
      set_id: setId,
      task: card.task,
      answer: card.answer,
      description: card.description,
      when_to_use: card.whenToUse,
      scenarios: card.scenarios,
      order_index: index,
    }))

    return NextResponse.json({
      flashcards,
      metadata: {
        id: moduleData.id,
        title: moduleData.title,
        description: moduleData.description,
        difficulty: moduleData.difficulty,
        estimatedTime: moduleData.estimatedTime,
        totalCards: moduleData.cardCount,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
