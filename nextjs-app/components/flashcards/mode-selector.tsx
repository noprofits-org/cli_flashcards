'use client'

import { FlashcardSet } from '@/lib/types/flashcard'
import { cn } from '@/lib/utils/cn'

interface ModeSelectorProps {
  sets: FlashcardSet[]
  selectedSetId: string | null
  onSelectSet: (setId: string) => void
}

export function ModeSelector({ sets, selectedSetId, onSelectSet }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      {sets.map((set) => (
        <button
          key={set.id}
          onClick={() => onSelectSet(set.id)}
          className={cn(
            'bg-card border-2 border-border rounded-xl p-4 text-left transition-all',
            'hover:border-primary hover:-translate-y-0.5 hover:shadow-lg',
            'flex flex-col gap-1',
            selectedSetId === set.id && 'border-primary bg-primary/10'
          )}
        >
          <div className="text-lg font-semibold text-foreground">{set.name.charAt(0).toUpperCase() + set.name.slice(1)} Commands</div>
          <div className="text-sm text-muted-foreground">{set.description}</div>
          <div className="text-xs text-primary font-semibold mt-1">{set.card_count} cards</div>
        </button>
      ))}
    </div>
  )
}
