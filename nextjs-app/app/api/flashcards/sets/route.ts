import { NextResponse } from 'next/server'
import flashcardsData from '@/data/flashcards.json'

export async function GET() {
  try {
    // Create flashcard sets from the JSON data structure
    const sets = Object.keys(flashcardsData).map(setId => ({
      id: setId,
      name: setId,
      description: setId === 'clasp-basics'
        ? 'Essential clasp commands for getting started'
        : 'Advanced clasp commands and workflows',
      card_count: flashcardsData[setId as keyof typeof flashcardsData].length
    }))

    // Sort by name
    sets.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ sets })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
