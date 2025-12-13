import { NextResponse } from 'next/server'

import claspBasicsGuide from '@/data/guides/clasp-basics-guide.json'
import claspAdvancedGuide from '@/data/guides/clasp-advanced-guide.json'
import claspScenariosGuide from '@/data/guides/clasp-scenarios-guide.json'
import claspFundamentalsGuide from '@/data/guides/clasp-fundamentals-guide.json'
import claspTroubleshootingGuide from '@/data/guides/clasp-troubleshooting-guide.json'
import gitBasicsGuide from '@/data/guides/git-basics-guide.json'
import gitBranchingGuide from '@/data/guides/git-branching-guide.json'
import gitTroubleshootingGuide from '@/data/guides/git-troubleshooting-guide.json'

const guideMap: Record<string, any> = {
  'clasp-basics': claspBasicsGuide,
  'clasp-advanced': claspAdvancedGuide,
  'clasp-scenarios': claspScenariosGuide,
  'clasp-fundamentals': claspFundamentalsGuide,
  'clasp-troubleshooting': claspTroubleshootingGuide,
  'git-basics': gitBasicsGuide,
  'git-branching': gitBranchingGuide,
  'git-troubleshooting': gitTroubleshootingGuide,
}

export async function GET(
  request: Request,
  context: { params: Promise<{ setId: string }> }
) {
  try {
    const { setId } = await context.params
    const guide = guideMap[setId]

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
    }

    return NextResponse.json({ guide })
  } catch (error) {
    console.error('Unexpected error fetching guide:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
