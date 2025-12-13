'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils/cn'

interface GuideSection {
  title: string
  content: string[]
}

interface GuideWorkflow {
  name: string
  steps: string[]
  tips?: string[]
}

interface GuideExample {
  title: string
  commands: string[]
  explanation: string
}

interface GuideData {
  id: string
  setId: string
  title: string
  summary: string
  mentalModel?: string
  sections?: GuideSection[]
  commonWorkflows?: GuideWorkflow[]
  memoryHooks?: string[]
  examples?: GuideExample[]
  troubleshooting?: string[]
  recap?: string[]
}

export default function GuidePage() {
  const router = useRouter()
  const params = useParams<{ setId: string }>()
  const [guide, setGuide] = useState<GuideData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await fetch(`/api/guides/${params.setId}`)
        if (!res.ok) throw new Error('Guide not found')
        const data = await res.json()
        setGuide(data.guide)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGuide()
  }, [params.setId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading guide...</div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg text-muted-foreground">Guide not found</div>
          <Button onClick={() => router.push('/')}>Go home</Button>
        </div>
      </div>
    )
  }

  const { title, summary, mentalModel } = guide

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="w-full mb-4">
        <Progress value={100} />
      </div>

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-5xl space-y-8">
          <div className="space-y-3">
            <Button variant="ghost" onClick={() => router.push('/')} className="px-0 text-sm text-primary hover:underline">
              ← Back to home
            </Button>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h1>
                <p className="text-muted-foreground mt-2">{summary}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold">
                📘 Reading Mode
              </div>
            </div>
            {mentalModel && (
              <div className="p-4 rounded-lg bg-muted border text-sm leading-relaxed">
                <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">Mental model</div>
                {mentalModel}
              </div>
            )}
          </div>

          {guide.sections && guide.sections.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Core sections</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {guide.sections.map((section, idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-card shadow-sm">
                    <div className="text-sm font-semibold mb-2">{section.title}</div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {section.content.map((line, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {guide.commonWorkflows && guide.commonWorkflows.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Common workflows</h2>
              <div className="space-y-4">
                {guide.commonWorkflows.map((flow, idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-card shadow-sm space-y-3">
                    <div className="text-sm font-semibold">{flow.name}</div>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      {flow.steps.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary font-semibold">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    {flow.tips && flow.tips.length > 0 && (
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        <div className="font-semibold text-foreground mb-1">Tips</div>
                        <ul className="space-y-1">
                          {flow.tips.map((tip, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary">→</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {guide.memoryHooks && guide.memoryHooks.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Memory hooks</h2>
              <ul className="grid gap-3 md:grid-cols-2 text-sm text-muted-foreground">
                {guide.memoryHooks.map((hook, idx) => (
                  <li key={idx} className="p-3 rounded-lg border bg-card shadow-sm flex gap-2">
                    <span className="text-primary">★</span>
                    <span>{hook}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {guide.examples && guide.examples.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Examples</h2>
              <div className="space-y-4">
                {guide.examples.map((example, idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-card shadow-sm space-y-3">
                    <div className="text-sm font-semibold">{example.title}</div>
                    <pre className="text-xs md:text-sm bg-muted p-3 rounded-lg overflow-x-auto">{example.commands.join('\n')}</pre>
                    <div className="text-sm text-muted-foreground">{example.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {guide.troubleshooting && guide.troubleshooting.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Troubleshooting</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {guide.troubleshooting.map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {guide.recap && guide.recap.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Quick recap</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {guide.recap.map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
