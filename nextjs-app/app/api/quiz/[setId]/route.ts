import { NextResponse } from 'next/server'

// Import all module data statically for build-time optimization
// Terminal modules
import terminalNavigation from '@/data/terminal-navigation.json'
import terminalFiles from '@/data/terminal-files.json'
import terminalViewing from '@/data/terminal-viewing.json'
import terminalSearch from '@/data/terminal-search.json'
import terminalNano from '@/data/terminal-nano.json'
import terminalPipes from '@/data/terminal-pipes.json'

// Git modules
import gitSetup from '@/data/git-setup.json'
import gitDaily from '@/data/git-daily.json'
import gitBranches from '@/data/git-branches.json'
import gitStash from '@/data/git-stash.json'
import gitUndo from '@/data/git-undo.json'
import gitHistory from '@/data/git-history.json'

// CLASP modules
import claspSetup from '@/data/clasp-setup.json'
import claspProjects from '@/data/clasp-projects.json'
import claspWorkflow from '@/data/clasp-workflow.json'
import claspDeploy from '@/data/clasp-deploy.json'
import claspLogs from '@/data/clasp-logs.json'
import claspApis from '@/data/clasp-apis.json'
import claspScenarios from '@/data/clasp-scenarios.json'

// Firebase modules
import firebaseSetup from '@/data/firebase-setup.json'
import firebaseDeploy from '@/data/firebase-deploy.json'
import firebaseEmulators from '@/data/firebase-emulators.json'
import firebaseServices from '@/data/firebase-services.json'

// Google Cloud modules
import gcloudSetup from '@/data/gcloud-setup.json'
import gcloudProjects from '@/data/gcloud-projects.json'
import gcloudCompute from '@/data/gcloud-compute.json'
import gcloudDeploy from '@/data/gcloud-deploy.json'

interface FlashcardModule {
  id: string
  title: string
  cards: Array<{
    id: string
    task: string
    answer: string
    description: string
    whenToUse: string
    scenarios: string[]
  }>
}

interface QuizQuestion {
  id: string
  question: string
  correctAnswer: string
  options: string[]
  hint?: string
  explanation?: string
}

const moduleMap: Record<string, FlashcardModule> = {
  // Terminal
  'terminal-navigation': terminalNavigation as FlashcardModule,
  'terminal-files': terminalFiles as FlashcardModule,
  'terminal-viewing': terminalViewing as FlashcardModule,
  'terminal-search': terminalSearch as FlashcardModule,
  'terminal-nano': terminalNano as FlashcardModule,
  'terminal-pipes': terminalPipes as FlashcardModule,
  // Git
  'git-setup': gitSetup as FlashcardModule,
  'git-daily': gitDaily as FlashcardModule,
  'git-branches': gitBranches as FlashcardModule,
  'git-stash': gitStash as FlashcardModule,
  'git-undo': gitUndo as FlashcardModule,
  'git-history': gitHistory as FlashcardModule,
  // CLASP
  'clasp-setup': claspSetup as FlashcardModule,
  'clasp-projects': claspProjects as FlashcardModule,
  'clasp-workflow': claspWorkflow as FlashcardModule,
  'clasp-deploy': claspDeploy as FlashcardModule,
  'clasp-logs': claspLogs as FlashcardModule,
  'clasp-apis': claspApis as FlashcardModule,
  'clasp-scenarios': claspScenarios as FlashcardModule,
  // Firebase
  'firebase-setup': firebaseSetup as FlashcardModule,
  'firebase-deploy': firebaseDeploy as FlashcardModule,
  'firebase-emulators': firebaseEmulators as FlashcardModule,
  'firebase-services': firebaseServices as FlashcardModule,
  // Google Cloud
  'gcloud-setup': gcloudSetup as FlashcardModule,
  'gcloud-projects': gcloudProjects as FlashcardModule,
  'gcloud-compute': gcloudCompute as FlashcardModule,
  'gcloud-deploy': gcloudDeploy as FlashcardModule,
}

// Get all answers from all modules for generating wrong options
function getAllAnswers(): string[] {
  const answers: string[] = []
  Object.values(moduleMap).forEach(module => {
    module.cards.forEach(card => {
      answers.push(card.answer)
    })
  })
  return answers
}

// Shuffle array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Generate wrong answers that are plausible (from same category or similar commands)
function generateWrongOptions(
  correctAnswer: string,
  allAnswers: string[],
  count: number = 3
): string[] {
  // Filter out the correct answer and get unique wrong options
  const wrongOptions = allAnswers
    .filter(a => a !== correctAnswer)
    .filter((a, i, arr) => arr.indexOf(a) === i) // unique

  // Shuffle and pick the first 'count' options
  return shuffleArray(wrongOptions).slice(0, count)
}

// Transform flashcards into quiz questions
function generateQuizQuestions(module: FlashcardModule, allAnswers: string[]): QuizQuestion[] {
  return module.cards.map(card => {
    const wrongOptions = generateWrongOptions(card.answer, allAnswers, 3)
    const options = shuffleArray([card.answer, ...wrongOptions])

    return {
      id: card.id,
      question: card.task,
      correctAnswer: card.answer,
      options,
      hint: card.whenToUse,
      explanation: card.description,
    }
  })
}

export async function GET(
  request: Request,
  context: { params: Promise<{ setId: string }> }
) {
  try {
    const { setId } = await context.params
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)

    const moduleData = moduleMap[setId]

    if (!moduleData) {
      return NextResponse.json({ error: 'Quiz set not found' }, { status: 404 })
    }

    const allAnswers = getAllAnswers()
    let questions = generateQuizQuestions(moduleData, allAnswers)

    // Shuffle and limit questions
    questions = shuffleArray(questions).slice(0, Math.min(limit, questions.length))

    return NextResponse.json({
      questions,
      metadata: {
        setId,
        title: moduleData.title,
        totalQuestions: questions.length,
        totalAvailable: moduleData.cards.length,
      }
    })
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
