'use client'

import * as React from 'react'
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { CodeBlock } from './code-block'
import { CommandBlock } from './command-block'
import { Button } from '@/components/ui/button'
import type { ProjectStepContent } from '@/lib/types/project'

interface StepContentRendererProps {
  content: ProjectStepContent[]
  onCheckpointComplete?: () => void
  isStepComplete?: boolean
}

export function StepContentRenderer({
  content,
  onCheckpointComplete,
  isStepComplete,
}: StepContentRendererProps) {
  return (
    <div className="space-y-4">
      {content.map((item, index) => (
        <ContentBlock
          key={index}
          item={item}
          onCheckpointComplete={onCheckpointComplete}
          isStepComplete={isStepComplete}
        />
      ))}
    </div>
  )
}

interface ContentBlockProps {
  item: ProjectStepContent
  onCheckpointComplete?: () => void
  isStepComplete?: boolean
}

function ContentBlock({ item, onCheckpointComplete, isStepComplete }: ContentBlockProps) {
  switch (item.type) {
    case 'text':
      return <TextContent content={item.content} />

    case 'code':
      return (
        <CodeBlock
          code={item.content}
          language={item.language}
          filename={item.filename}
        />
      )

    case 'command':
      return <CommandBlock command={item.content} />

    case 'tip':
      return <TipBox content={item.content} />

    case 'warning':
      return <WarningBox content={item.content} />

    case 'checkpoint':
      return (
        <CheckpointButton
          label={item.content}
          onComplete={onCheckpointComplete}
          isComplete={isStepComplete}
        />
      )

    default:
      return null
  }
}

function TextContent({ content }: { content: string }) {
  // Simple markdown-like rendering for **bold** and `code`
  const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g)

  return (
    <p className="text-foreground leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part === '\n') {
          return <br key={i} />
        }
        return part
      })}
    </p>
  )
}

function TipBox({ content }: { content: string }) {
  return (
    <div className="flex gap-3 rounded-lg border-2 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50 p-4">
      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
      <div className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
}

function WarningBox({ content }: { content: string }) {
  return (
    <div className="flex gap-3 rounded-lg border-2 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50 p-4">
      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
}

interface CheckpointButtonProps {
  label: string
  onComplete?: () => void
  isComplete?: boolean
}

function CheckpointButton({ label, onComplete, isComplete }: CheckpointButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="h-px w-full bg-border" />
      {isComplete ? (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Completed!</span>
        </div>
      ) : (
        <Button
          onClick={onComplete}
          variant="outline"
          className={cn(
            'gap-2 border-green-300 text-green-700 hover:bg-green-50',
            'dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950'
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          {label}
        </Button>
      )}
      <div className="h-px w-full bg-border" />
    </div>
  )
}
