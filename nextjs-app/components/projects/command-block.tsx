'use client'

import * as React from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CommandBlockProps {
  command: string
  className?: string
}

export function CommandBlock({ command, className }: CommandBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-lg border-2 border-border bg-zinc-900 dark:bg-zinc-950 px-4 py-3',
        className
      )}
    >
      <div className="flex items-center gap-3 overflow-x-auto">
        <Terminal className="h-4 w-4 text-green-400 shrink-0" />
        <code className="text-sm font-mono text-green-400 whitespace-pre">{command}</code>
      </div>
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors shrink-0"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-500" />
            <span className="text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  )
}
