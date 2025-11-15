'use client'

import { FlashcardSet } from '@/lib/types/flashcard'
import { cn } from '@/lib/utils/cn'

interface ModeSelectorProps {
  sets: FlashcardSet[]
  selectedSetId: string | null
  onSelectSet: (setId: string) => void
}

// Helper to format set name (e.g., "clasp-basics" → "Clasp - Basic")
const formatSetName = (name: string) => {
  const [tool, level] = name.split('-')
  const toolName = tool.charAt(0).toUpperCase() + tool.slice(1)
  const levelName = level === 'basics' ? 'Basic' : 'Advanced'
  return `${toolName} - ${levelName}`
}

// Helper to group sets by tool
const groupSetsByTool = (sets: FlashcardSet[]) => {
  const tools = ['clasp', 'git', 'vercel', 'supabase', 'linux', 'freebsd']
  return tools.map(tool => ({
    tool: tool.charAt(0).toUpperCase() + tool.slice(1),
    sets: sets.filter(set => set.name.startsWith(tool)).sort((a, b) => {
      // Sort: basics before advanced
      if (a.name.includes('basics')) return -1
      if (b.name.includes('basics')) return 1
      return 0
    })
  })).filter(group => group.sets.length > 0)
}

export function ModeSelector({ sets, selectedSetId, onSelectSet }: ModeSelectorProps) {
  const groupedSets = groupSetsByTool(sets)

  return (
    <div className="w-full max-w-4xl space-y-8">
      {groupedSets.map((group) => (
        <div key={group.tool} className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">{group.tool}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.sets.map((set) => {
              const isComingSoon = set.card_count === 0
              return (
                <button
                  key={set.id}
                  onClick={() => !isComingSoon && onSelectSet(set.id)}
                  disabled={isComingSoon}
                  className={cn(
                    'bg-card border-2 border-border rounded-xl p-4 text-left transition-all relative',
                    !isComingSoon && 'hover:border-primary hover:-translate-y-0.5 hover:shadow-lg cursor-pointer',
                    isComingSoon && 'opacity-60 cursor-not-allowed',
                    'flex flex-col gap-1',
                    selectedSetId === set.id && !isComingSoon && 'border-primary bg-primary/10'
                  )}
                >
                  {isComingSoon && (
                    <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 bg-muted text-muted-foreground rounded">
                      Coming Soon
                    </span>
                  )}
                  <div className="text-lg font-semibold text-foreground">{formatSetName(set.name)}</div>
                  <div className="text-sm text-muted-foreground">{set.description}</div>
                  {!isComingSoon && (
                    <div className="text-xs text-primary font-semibold mt-1">{set.card_count} cards</div>
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
