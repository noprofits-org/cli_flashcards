import { NextResponse } from 'next/server'
import flashcardsData from '@/data/flashcards.json'

export async function GET() {
  try {
    // Create flashcard sets from the JSON data structure
    const sets = Object.keys(flashcardsData).map(setId => {
      let description = ''
      if (setId === 'clasp-basics') {
        description = 'Essential clasp commands for getting started'
      } else if (setId === 'clasp-advanced') {
        description = 'Advanced clasp commands and workflows'
      } else if (setId === 'clasp-scenarios') {
        description = 'Real-world nonprofit scenarios with specific commands'
      } else {
        description = setId
      }

      return {
        id: setId,
        name: setId,
        description,
        card_count: flashcardsData[setId as keyof typeof flashcardsData].length
      }
    })

    // Sort by name
    sets.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ sets })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
