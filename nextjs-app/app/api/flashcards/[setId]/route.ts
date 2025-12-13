import { NextResponse } from 'next/server'

// Import all module data statically for build-time optimization
import terminalBasics from '@/data/terminal-basics.json'
import terminalIntermediate from '@/data/terminal-intermediate.json'
import claspBasics from '@/data/clasp-basics.json'
import claspAdvanced from '@/data/clasp-advanced.json'
import claspScenarios from '@/data/clasp-scenarios.json'
import claspFundamentals from '@/data/clasp-fundamentals.json'
import claspTroubleshooting from '@/data/clasp-troubleshooting.json'
import gitBasics from '@/data/git-basics.json'
import gitBranching from '@/data/git-branching.json'
import gitTroubleshooting from '@/data/git-troubleshooting.json'

// Type for flashcard module data
interface FlashcardModule {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedTime: string
  cardCount: number
  cards: Array<{
    id: string
    task: string
    answer: string
    description: string
    whenToUse: string
    scenarios: string[]
  }>
}

// Map of available modules
const moduleMap: Record<string, FlashcardModule> = {
  'terminal-basics': terminalBasics as FlashcardModule,
  'terminal-intermediate': terminalIntermediate as FlashcardModule,
  'clasp-basics': claspBasics as FlashcardModule,
  'clasp-advanced': claspAdvanced as FlashcardModule,
  'clasp-scenarios': claspScenarios as FlashcardModule,
  'clasp-fundamentals': claspFundamentals as FlashcardModule,
  'clasp-troubleshooting': claspTroubleshooting as FlashcardModule,
  'git-basics': gitBasics as FlashcardModule,
  'git-branching': gitBranching as FlashcardModule,
  'git-troubleshooting': gitTroubleshooting as FlashcardModule,
}

export async function GET(
  request: Request,
  context: { params: Promise<{ setId: string }> }
) {
  try {
    const { setId } = await context.params

    // Get module data from the map
    const moduleData = moduleMap[setId]

    if (!moduleData) {
      return NextResponse.json({ error: 'Flashcard set not found' }, { status: 404 })
    }

    // Transform module data to match expected Flashcard interface
    const flashcards = moduleData.cards.map((card, index) => ({
      id: card.id || `${setId}-${index}`,
      set_id: setId,
      task: card.task,
      answer: card.answer,
      description: card.description,
      when_to_use: card.whenToUse,
      scenarios: card.scenarios,
      order_index: index
    }))

    return NextResponse.json({
      flashcards,
      metadata: {
        id: moduleData.id,
        title: moduleData.title,
        description: moduleData.description,
        difficulty: moduleData.difficulty,
        estimatedTime: moduleData.estimatedTime,
        totalCards: moduleData.cardCount
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
