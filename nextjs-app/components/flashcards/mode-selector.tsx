'use client'

import { FlashcardSet } from '@/lib/types/flashcard'
import { cn } from '@/lib/utils/cn'
import { SquareTerminal, Terminal, GitBranch } from 'lucide-react'

interface ModeSelectorProps {
  sets: FlashcardSet[]
  selectedSetId: string | null
  selectedCategory: string | null
  onSelectSet: (setId: string) => void
  onSelectCategory: (category: string | null) => void
}

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  terminal: { label: 'Terminal', icon: <SquareTerminal className="w-4 h-4" />, color: '#10b981' },
  clasp: { label: 'CLASP', icon: <Terminal className="w-4 h-4" />, color: '#4285f4' },
  git: { label: 'Git', icon: <GitBranch className="w-4 h-4" />, color: '#f44336' },
}

const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }

// Group sets by category (fallback to prefix of id/name)
const groupSets = (sets: FlashcardSet[]) => {
  const groups = new Map<string, { label: string; color?: string; sets: FlashcardSet[] }>()

  sets.forEach((set) => {
    const categoryKey = (set.category || set.id.split('-')[0] || 'other').toLowerCase()
    const label = set.categoryLabel || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)

    if (!groups.has(categoryKey)) {
      groups.set(categoryKey, { label, color: set.color, sets: [] })
    }
    groups.get(categoryKey)!.sets.push(set)
  })

  return Array.from(groups.entries())
    .map(([key, group]) => ({
      key,
      label: group.label,
      color: group.color,
      sets: group.sets.sort((a, b) => {
        const difficultyCompare =
          (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] ?? 99) -
          (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] ?? 99)
        if (difficultyCompare !== 0) return difficultyCompare
        return a.name.localeCompare(b.name)
      })
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function ModeSelector({ sets, selectedSetId, selectedCategory, onSelectSet, onSelectCategory }: ModeSelectorProps) {
  const groupedSets = groupSets(sets)

  // Get unique categories from the sets
  const categories = groupedSets.map(g => g.key)

  // Filter sets by selected category
  const filteredGroups = selectedCategory
    ? groupedSets.filter(g => g.key === selectedCategory)
    : groupedSets

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {['terminal', 'clasp', 'git'].map((cat) => {
          const config = categoryConfig[cat]
          if (!config) return null
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
                selectedCategory === cat
                  ? 'text-white shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
              style={selectedCategory === cat ? { backgroundColor: config.color } : undefined}
            >
              {config.icon}
              {config.label}
            </button>
          )
        })}
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
            selectedCategory === null
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          All
        </button>
      </div>

      {/* Sets Grid */}
      {filteredGroups.map((group) => (
        <div key={group.key} className="space-y-3">
          {!selectedCategory && (
            <h2 className="text-2xl font-bold text-foreground">{group.label}</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.sets.map((set) => {
              const isComingSoon = set.card_count === 0
              const difficultyLabel = set.difficulty
                ? set.difficulty.charAt(0).toUpperCase() + set.difficulty.slice(1)
                : null

              return (
                <button
                  key={set.id}
                  onClick={() => {
                    if (isComingSoon) return
                    onSelectSet(set.id)
                  }}
                  disabled={isComingSoon}
                  className={cn(
                    'bg-card border-2 border-border rounded-xl p-4 text-left transition-all relative',
                    !isComingSoon && 'hover:border-primary hover:-translate-y-0.5 hover:shadow-lg cursor-pointer',
                    isComingSoon && 'opacity-60 cursor-not-allowed',
                    'flex flex-col gap-2',
                    selectedSetId === set.id && !isComingSoon && 'border-primary bg-primary/15 ring-4 ring-primary/25 shadow-xl'
                  )}
                >
                  {isComingSoon && (
                    <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 bg-muted text-muted-foreground rounded">
                      Coming Soon
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-lg font-semibold text-foreground">{set.name}</div>
                    {difficultyLabel && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded bg-muted text-muted-foreground">
                        {difficultyLabel}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground leading-snug">{set.description}</div>
                  {!isComingSoon && (
                    <div className="text-xs text-muted-foreground flex items-center gap-3">
                      <span className="font-semibold text-primary">{set.card_count} cards</span>
                      {set.estimatedTime && <span>≈ {set.estimatedTime}</span>}
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-primary/10 text-primary font-semibold">
                        Press Enter to start
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
