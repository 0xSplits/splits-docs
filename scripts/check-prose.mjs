#!/usr/bin/env node
// Prose linter: flags marketing-jargon markers in docs pages.
// Warn-only — findings need judgment (feature names like "just-in-time" are fine).
// The underlying test: every sentence must be falsifiable. If a clause tells the
// reader how to feel about a fact instead of stating the fact, cut it.
//
// Usage: node scripts/check-prose.mjs [path...]  (defaults to src/pages)

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const PATTERNS = [
  // benefit-selling connectives
  /\bso you can\b/i,
  /\bwhich means you\b/i,
  /\bnever (have to )?worry\b/i,
  /\ball you (have to|need to) do\b/i,
  // emotional / metaphor abstractions in place of mechanisms
  /\bfriction(less)?\b/i,
  /\bpeace of mind\b/i,
  /\bseamless(ly)?\b/i,
  /\beffortless(ly)?\b/i,
  /\bdelight/i,
  /\bsupercharge/i,
  /\bunlock(s|ing)?\b/i,
  /\bempower/i,
  /\bstreamline/i,
  /\bgame.chang/i,
  // vague quality adjectives (state the mechanism instead)
  /\bpowerful\b/i,
  /\bflexible\b/i,
  /\brobust\b/i,
  /\bintuitive\b/i,
  /\bmagical?\b/i,
  /\bblazing/i,
  /\b(best|world).class\b/i,
  /\bbattle.tested\b/i,
  /\bcutting.edge\b/i,
  // hedges and softeners that dilute facts
  /\bjust (click|tap|call|toggle|paste)\b/i,
  /\bsimply\b/i,
  /\beasy|easily\b/i,
  /\bquick(ly)? and (easy|simple)/i,
  // rhetorical intensifiers
  /\bexactly when\b/i,
  /\bthe moment (you|when)\b/i,
  /, in some real sense,/i,
]

function walk(dir, files = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, files)
    else if (p.endsWith('.mdx') || p.endsWith('.md')) files.push(p)
  }
  return files
}

// Em dashes: allowed as list/table separators; flagged in prose (LLM-tell appositive tic).
const EM_DASH_PROSE = /—/
function isProseLine(line) {
  const t = line.trim()
  return t && !t.startsWith('-') && !t.startsWith('|') && !t.startsWith('#') && !/^\d+\./.test(t)
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : ['src/pages']
let count = 0
for (const target of targets) {
  const files = statSync(target).isDirectory() ? walk(target) : [target]
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      for (const re of PATTERNS) {
        const m = line.match(re)
        if (m) {
          console.log(`${file}:${i + 1}: [${m[0]}] ${line.trim().slice(0, 120)}`)
          count++
        }
      }
      if (isProseLine(line) && EM_DASH_PROSE.test(line)) {
        console.log(`${file}:${i + 1}: [em dash in prose] ${line.trim().slice(0, 120)}`)
        count++
      }
    })
  }
}
console.log(count ? `\n${count} finding(s) — apply judgment; not all are violations.` : 'clean')
process.exit(0)
