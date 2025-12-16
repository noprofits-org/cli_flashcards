import { NextResponse } from 'next/server'
import indexData from '@/data/index.json'

export async function GET() {
  try {
    const categoryMap = (indexData.categories || []).reduce((acc: Record<string, { name: string; color?: string; icon?: string }>, category) => {
      acc[category.id] = { name: category.name, color: category.color, icon: category.icon }
      return acc
    }, {})

    // Get flashcard sets from the index file
    const sets = indexData.modules.flashcards
      .map(module => ({
        id: module.id,
        name: module.title,
        description: module.description,
        category: module.category,
        categoryLabel: categoryMap[module.category]?.name || module.category,
        card_count: module.cardCount ?? 0,
        difficulty: module.difficulty,
        estimatedTime: module.estimatedTime,
        icon: module.icon || categoryMap[module.category]?.icon,
        color: module.color || categoryMap[module.category]?.color
      }))

    // Sort by difficulty order: beginner, intermediate, advanced
    const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }
    sets.sort((a, b) => {
      const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] ?? 1
      const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] ?? 1
      return orderA - orderB
    })

    return NextResponse.json({
      sets,
      stats: indexData.stats,
      learningPaths: indexData.learningPaths
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
