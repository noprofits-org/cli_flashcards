export interface ProjectStepContent {
  type: 'text' | 'code' | 'command' | 'tip' | 'warning' | 'checkpoint'
  content: string
  language?: string  // for code blocks (javascript, html, json, etc.)
  filename?: string  // optional filename header for code blocks
}

export interface ProjectStep {
  id: string
  title: string
  description: string
  content: ProjectStepContent[]
  estimatedTime?: string
}

export interface Project {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  icon: string
  color: string
  category: string
  stepCount: number
  prerequisites?: string[]
  steps: ProjectStep[]
  nextProject?: string
}

export interface ProjectSuite {
  id: string
  title: string
  description: string
  icon: string
  color: string
  estimatedTime: string
  projects: string[]  // ordered list of project IDs
}

// Lightweight project metadata for list views
export interface ProjectSummary {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  icon: string
  color: string
  category: string
  stepCount: number
  prerequisites?: string[]
  nextProject?: string
}
