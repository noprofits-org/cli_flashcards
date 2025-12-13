'use client'

import * as React from 'react'
import { Check, Circle, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ProjectStep } from '@/lib/types/project'

interface ProjectSidebarProps {
  steps: ProjectStep[]
  currentStepIndex: number
  completedSteps: Set<string>
  onStepClick: (index: number) => void
  projectTitle: string
}

export function ProjectSidebar({
  steps,
  currentStepIndex,
  completedSteps,
  onStepClick,
  projectTitle,
}: ProjectSidebarProps) {
  return (
    <div className="w-72 shrink-0 border-r border-border bg-card overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg truncate">{projectTitle}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {completedSteps.size} of {steps.length} steps completed
        </p>
      </div>
      <nav className="p-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = index === currentStepIndex

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(index)}
              className={cn(
                'w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-colors',
                isCurrent && 'bg-primary/10',
                !isCurrent && 'hover:bg-muted'
              )}
            >
              {/* Step indicator */}
              <div className="shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                    <ChevronRight className="h-3 w-3 text-primary" />
                  </div>
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/50" />
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    'text-sm font-medium truncate',
                    isCurrent && 'text-primary',
                    isCompleted && !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </div>
                {step.estimatedTime && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {step.estimatedTime}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
