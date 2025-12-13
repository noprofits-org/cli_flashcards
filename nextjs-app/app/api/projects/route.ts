import { NextResponse } from 'next/server'
import mailListSuite from '@/data/projects/mail-list-suite.json'
import setupInstallation from '@/data/projects/setup-installation.json'
import contactListSheet from '@/data/projects/contact-list-sheet.json'
import emailTemplateDoc from '@/data/projects/email-template-doc.json'
import mailManagerWebapp from '@/data/projects/mail-manager-webapp.json'
import integrationSuite from '@/data/projects/integration-suite.json'
import type { ProjectSummary, ProjectSuite } from '@/lib/types/project'

// Define a flexible type for JSON imports
interface ProjectJson {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedTime: string
  icon: string
  color: string
  category: string
  stepCount: number
  prerequisites?: string[]
  nextProject?: string
  steps: unknown[]
}

// All projects
const projects: ProjectJson[] = [
  setupInstallation as ProjectJson,
  contactListSheet as ProjectJson,
  emailTemplateDoc as ProjectJson,
  mailManagerWebapp as ProjectJson,
  integrationSuite as ProjectJson,
]

// Project suites
const suites: ProjectSuite[] = [mailListSuite as ProjectSuite]

// Convert full project to summary (without steps)
function toSummary(project: ProjectJson): ProjectSummary {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    difficulty: project.difficulty as 'beginner' | 'intermediate' | 'advanced',
    estimatedTime: project.estimatedTime,
    icon: project.icon,
    color: project.color,
    category: project.category,
    stepCount: project.stepCount,
    prerequisites: project.prerequisites,
    nextProject: project.nextProject,
  }
}

export async function GET() {
  const projectSummaries = projects.map(toSummary)

  return NextResponse.json({
    projects: projectSummaries,
    suites,
  })
}
