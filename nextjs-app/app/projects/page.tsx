'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  Download,
  Table,
  FileText,
  Globe,
  Link,
  Mail,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProjectSummary, ProjectSuite } from '@/lib/types/project'

const iconMap: Record<string, React.ElementType> = {
  download: Download,
  table: Table,
  'file-text': FileText,
  globe: Globe,
  link: Link,
  mail: Mail,
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export default function ProjectsPage() {
  const router = useRouter()
  const [data, setData] = React.useState<{
    projects: ProjectSummary[]
    suites: ProjectSuite[]
  } | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load projects:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Failed to load projects</div>
      </div>
    )
  }

  const suite = data.suites[0] // Mail List Manager suite
  const projectsInOrder = suite.projects
    .map((id) => data.projects.find((p) => p.id === id))
    .filter(Boolean) as ProjectSummary[]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Suite header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: suite.color + '20' }}
            >
              <Mail className="h-6 w-6" style={{ color: suite.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{suite.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{suite.estimatedTime}</span>
                <span className="text-border">|</span>
                <span>{projectsInOrder.length} projects</span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">{suite.description}</p>
        </div>

        {/* What you'll build */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">What You&apos;ll Build</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Table className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Contact Sheet</div>
                  <div className="text-sm text-muted-foreground">
                    Custom dropdowns & sidebar form
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Email Template</div>
                  <div className="text-sm text-muted-foreground">
                    Reusable template with placeholders
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <div className="font-medium">Web App</div>
                  <div className="text-sm text-muted-foreground">
                    View contacts & send emails
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Link className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <div className="font-medium">Integration</div>
                  <div className="text-sm text-muted-foreground">
                    Newsletter feature tying it all together
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects list */}
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="space-y-3">
          {projectsInOrder.map((project, index) => {
            const Icon = iconMap[project.icon] || Download

            return (
              <button
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="w-full text-left"
              >
                <Card className="hover:border-primary/50 hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Number */}
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-lg shrink-0">
                        {index}
                      </div>

                      {/* Icon */}
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: project.color + '20' }}
                      >
                        <Icon className="h-5 w-5" style={{ color: project.color }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">{project.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {project.description}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            difficultyColors[project.difficulty]
                          }`}
                        >
                          {project.difficulty}
                        </span>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {project.estimatedTime}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>

        {/* Start button */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={() => router.push(`/projects/${projectsInOrder[0].id}`)}
            className="gap-2"
          >
            Start from the Beginning
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  )
}
