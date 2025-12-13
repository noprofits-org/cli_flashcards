'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, ChevronLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectSidebar } from '@/components/projects/project-sidebar'
import { StepContentRenderer } from '@/components/projects/step-content'
import type { Project } from '@/lib/types/project'

export default function ProjectViewerPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [project, setProject] = React.useState<Project | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [completedSteps, setCompletedSteps] = React.useState<Set<string>>(new Set())

  // Load project data
  React.useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.project) {
          setProject(data.project)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load project:', err)
        setLoading(false)
      })
  }, [projectId])

  // Handle step completion
  const handleStepComplete = React.useCallback(() => {
    if (!project) return
    const currentStep = project.steps[currentStepIndex]
    setCompletedSteps((prev) => new Set([...prev, currentStep.id]))
  }, [project, currentStepIndex])

  // Navigation
  const goToStep = (index: number) => {
    if (!project) return
    if (index >= 0 && index < project.steps.length) {
      setCurrentStepIndex(index)
      // Scroll to top of content
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToNextStep = () => {
    goToStep(currentStepIndex + 1)
  }

  const goToPrevStep = () => {
    goToStep(currentStepIndex - 1)
  }

  const goToNextProject = () => {
    if (project?.nextProject) {
      router.push(`/projects/${project.nextProject}`)
    } else {
      router.push('/projects')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    )
  }

  // Error state
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-500">Project not found</div>
        <Button variant="outline" onClick={() => router.push('/projects')}>
          Back to Projects
        </Button>
      </div>
    )
  }

  const currentStep = project.steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === project.steps.length - 1
  const isCurrentStepComplete = completedSteps.has(currentStep.id)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/projects')}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              All Projects
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {project.steps.length}
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
        </div>
      </header>

      {/* Main content with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <ProjectSidebar
            steps={project.steps}
            currentStepIndex={currentStepIndex}
            completedSteps={completedSteps}
            onStepClick={goToStep}
            projectTitle={project.title}
          />
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Step header */}
            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-1">
                Step {currentStepIndex + 1}
                {currentStep.estimatedTime && ` · ${currentStep.estimatedTime}`}
              </div>
              <h1 className="text-2xl font-bold mb-2">{currentStep.title}</h1>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>

            {/* Step content */}
            <div className="mb-8">
              <StepContentRenderer
                content={currentStep.content}
                onCheckpointComplete={handleStepComplete}
                isStepComplete={isCurrentStepComplete}
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t border-border pt-6">
              <Button
                variant="outline"
                onClick={goToPrevStep}
                disabled={isFirstStep}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {isLastStep ? (
                <Button onClick={goToNextProject}>
                  {project.nextProject ? 'Next Project' : 'Back to Projects'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={goToNextStep}>
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile step indicator */}
      <div className="md:hidden border-t border-border bg-card p-4">
        <div className="flex items-center justify-center gap-1">
          {project.steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStepIndex
                  ? 'w-6 bg-primary'
                  : completedSteps.has(step.id)
                  ? 'w-2 bg-green-500'
                  : 'w-2 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
