import { NextResponse } from 'next/server'
import type { Project } from '@/lib/types/project'
import setupInstallation from '@/data/projects/setup-installation.json'
import contactListSheet from '@/data/projects/contact-list-sheet.json'
import emailTemplateDoc from '@/data/projects/email-template-doc.json'
import mailManagerWebapp from '@/data/projects/mail-manager-webapp.json'
import integrationSuite from '@/data/projects/integration-suite.json'

// Use unknown to avoid strict JSON type inference issues
const projectMap: Record<string, unknown> = {
  'setup-installation': setupInstallation,
  'contact-list-sheet': contactListSheet,
  'email-template-doc': emailTemplateDoc,
  'mail-manager-webapp': mailManagerWebapp,
  'integration-suite': integrationSuite,
}

export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params
  const project = projectMap[projectId]

  if (!project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ project })
}
