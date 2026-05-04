// Single source of truth for flashcard module data.
// Imports are static so Next.js can tree-shake / bundle JSON at build time.

import terminalNavigation from '@/data/terminal-navigation.json'
import terminalFiles from '@/data/terminal-files.json'
import terminalViewing from '@/data/terminal-viewing.json'
import terminalSearch from '@/data/terminal-search.json'
import terminalNano from '@/data/terminal-nano.json'
import terminalPipes from '@/data/terminal-pipes.json'

import gitSetup from '@/data/git-setup.json'
import gitDaily from '@/data/git-daily.json'
import gitBranches from '@/data/git-branches.json'
import gitStash from '@/data/git-stash.json'
import gitUndo from '@/data/git-undo.json'
import gitHistory from '@/data/git-history.json'

import claspSetup from '@/data/clasp-setup.json'
import claspProjects from '@/data/clasp-projects.json'
import claspWorkflow from '@/data/clasp-workflow.json'
import claspDeploy from '@/data/clasp-deploy.json'
import claspLogs from '@/data/clasp-logs.json'
import claspApis from '@/data/clasp-apis.json'
import claspScenarios from '@/data/clasp-scenarios.json'

import firebaseSetup from '@/data/firebase-setup.json'
import firebaseDeploy from '@/data/firebase-deploy.json'
import firebaseEmulators from '@/data/firebase-emulators.json'
import firebaseServices from '@/data/firebase-services.json'

import gcloudSetup from '@/data/gcloud-setup.json'
import gcloudProjects from '@/data/gcloud-projects.json'
import gcloudCompute from '@/data/gcloud-compute.json'
import gcloudDeploy from '@/data/gcloud-deploy.json'

export interface FlashcardModuleCard {
  id: string
  task: string
  answer: string
  description: string
  whenToUse: string
  scenarios: string[]
}

export interface FlashcardModule {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedTime: string
  cardCount: number
  cards: FlashcardModuleCard[]
}

export const moduleMap: Record<string, FlashcardModule> = {
  'terminal-navigation': terminalNavigation as FlashcardModule,
  'terminal-files': terminalFiles as FlashcardModule,
  'terminal-viewing': terminalViewing as FlashcardModule,
  'terminal-search': terminalSearch as FlashcardModule,
  'terminal-nano': terminalNano as FlashcardModule,
  'terminal-pipes': terminalPipes as FlashcardModule,

  'git-setup': gitSetup as FlashcardModule,
  'git-daily': gitDaily as FlashcardModule,
  'git-branches': gitBranches as FlashcardModule,
  'git-stash': gitStash as FlashcardModule,
  'git-undo': gitUndo as FlashcardModule,
  'git-history': gitHistory as FlashcardModule,

  'clasp-setup': claspSetup as FlashcardModule,
  'clasp-projects': claspProjects as FlashcardModule,
  'clasp-workflow': claspWorkflow as FlashcardModule,
  'clasp-deploy': claspDeploy as FlashcardModule,
  'clasp-logs': claspLogs as FlashcardModule,
  'clasp-apis': claspApis as FlashcardModule,
  'clasp-scenarios': claspScenarios as FlashcardModule,

  'firebase-setup': firebaseSetup as FlashcardModule,
  'firebase-deploy': firebaseDeploy as FlashcardModule,
  'firebase-emulators': firebaseEmulators as FlashcardModule,
  'firebase-services': firebaseServices as FlashcardModule,

  'gcloud-setup': gcloudSetup as FlashcardModule,
  'gcloud-projects': gcloudProjects as FlashcardModule,
  'gcloud-compute': gcloudCompute as FlashcardModule,
  'gcloud-deploy': gcloudDeploy as FlashcardModule,
}

export function getModule(setId: string): FlashcardModule | undefined {
  return moduleMap[setId]
}

// Precomputed pool of unique answers across all modules — used to generate
// quiz distractors. Computed once at module load instead of on every request.
export const allUniqueAnswers: string[] = (() => {
  const set = new Set<string>()
  for (const mod of Object.values(moduleMap)) {
    for (const card of mod.cards) set.add(card.answer)
  }
  return [...set]
})()
