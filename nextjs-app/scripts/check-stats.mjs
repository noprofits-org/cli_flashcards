// Asserts that the hand-maintained `stats` block in data/index.json matches the
// real data it summarizes. Module card content is the source of truth; the
// rolled-up totals are derived here and compared so they can't silently drift.
//
// Run: `npm run check:stats` (also runs in CI).

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')
const readJson = (name) => JSON.parse(readFileSync(join(dataDir, name), 'utf8'))

const index = readJson('index.json')
const modules = index.modules.flashcards

// Derive the real aggregates from each module's actual cards[] array.
let totalCards = 0
const difficulties = { beginner: 0, intermediate: 0, advanced: 0 }
const cardCountMismatches = []

for (const mod of modules) {
  const data = readJson(`${mod.id}.json`)
  const realCount = data.cards.length

  if (realCount !== mod.cardCount) {
    cardCountMismatches.push(
      `  ${mod.id}: index.cardCount=${mod.cardCount} but cards[]=${realCount}`
    )
  }

  totalCards += realCount
  if (mod.difficulty in difficulties) difficulties[mod.difficulty]++
}

const errors = []

if (cardCountMismatches.length) {
  errors.push('Per-module cardCount drift:\n' + cardCountMismatches.join('\n'))
}

const s = index.stats
if (s.totalCards !== totalCards) {
  errors.push(`stats.totalCards=${s.totalCards} but real total is ${totalCards}`)
}
if (s.totalModules !== modules.length) {
  errors.push(`stats.totalModules=${s.totalModules} but there are ${modules.length} modules`)
}
for (const level of Object.keys(difficulties)) {
  if ((s.difficulties?.[level] ?? 0) !== difficulties[level]) {
    errors.push(
      `stats.difficulties.${level}=${s.difficulties?.[level] ?? 0} but real count is ${difficulties[level]}`
    )
  }
}

if (errors.length) {
  console.error('✗ data/index.json stats are out of sync:\n')
  console.error(errors.join('\n'))
  console.error('\nUpdate the `stats` block in data/index.json to match the data above.')
  process.exit(1)
}

console.log(
  `✓ stats in sync — ${totalCards} cards across ${modules.length} modules ` +
    `(beginner ${difficulties.beginner}, intermediate ${difficulties.intermediate}, advanced ${difficulties.advanced})`
)
