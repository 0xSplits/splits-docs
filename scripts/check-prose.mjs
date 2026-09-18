#!/usr/bin/env node
// Prose linter: flags marketing-jargon markers in docs pages.
// Warn-only — findings need judgment (feature names like "just-in-time" are fine).
// The underlying test: every sentence must be falsifiable. If a clause tells the
// reader how to feel about a fact instead of stating the fact, cut it.
//
// Usage: node scripts/check-prose.mjs [path...]  (defaults to src/pages)
//
// --strict adds the structural rules of ASD-STE100 (Simplified Technical English)
// and exits 1 on any hard finding; without it every finding stays a warning.
// --selftest checks the STE rules against fixed strings.
// The STE rules are ported from scripts/ste-lint.py in danyuchn/asd-ste100-skill
// (MIT) at 7d4a135; that skill, vendored under .claude/skills/asd-ste100, does the
// rewriting, and this file is the gate.

import assert from 'node:assert/strict'
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

// Em dashes: never allowed. Lists/definitions use a colon separator; prose uses a
// colon, period, comma, semicolon, or parentheses.
const EM_DASH = /—/

// Hard rules fail --strict. Advisory rules print and never fail: passive voice and
// compound tenses are often correct, and synonym rotation collides with product
// terms here (Verify signer, Remove, Confirm are UI labels).
const STE_RULES = [
  ['semicolon', 'hard', /;/g],
  ['em-dash', 'hard', /—/g],
  ['phrasal-verb', 'hard', /\b(spin(?:ning|s)? up|spun up|reach(?:ing|es|ed)? out|div(?:e|es|ing|ed) into|dove into|kick(?:ing|s|ed)? off|circl(?:e|es|ing|ed) back|touch(?:ing|es|ed)? base)\b/gi],
  ['marketing-adjective', 'hard', /\b(seamless(?:ly)?|robust(?:ly)?|cutting-edge|effortless(?:ly)?|blazing[- ]fast|world-class|state-of-the-art|game-chang(?:ing|er))\b/gi],
  ['nominalization', 'hard', /\b(perform|performs|performed|conduct|conducts|conducted|carry out|carries out|carried out)\s+(?:a|an|the)\s+\w+(?:tion|sion|ment|ance|ence|ysis)\b/gi],
  ['passive-voice', 'advisory', /\b(is|are|was|were|been|being)\s+(\w+ed|given|taken|made|done|found|seen|known|shown|written|built|sent|set|run|read|kept|held|left|put)\b(?!\s+(?:to|for|by)\s+\w+ing)/gi],
  // modal + perfect infinitive ("may have failed") is a hedge, and hedges are content
  ['compound-tense', 'advisory', /(?<!\bmay )(?<!\bmight )(?<!\bcould )(?<!\bshould )(?<!\bwould )(?<!\bmust )\b(has|have|had)\s+(?:been\s+)?\w+(?:ed|en)\b/gi],
]

const SYNONYM_GROUPS = [
  ['check', 'verify', 'confirm', 'validate'],
  ['delete', 'remove', 'erase'],
  ['start', 'launch', 'begin', 'initiate'],
  ['stop', 'halt', 'terminate'],
  ['show', 'display'],
  ['use', 'utilize', 'employ'],
  ['fix', 'repair', 'correct'],
  ['send', 'transmit'],
  ['get', 'retrieve', 'fetch', 'obtain'],
  ['change', 'modify', 'alter'],
]

const MAX_WORDS = 25 // the STE cap for descriptions; the 20-word cap for procedures needs a reader
const LIST_ITEM = /^ {0,3}(?:[-*+]|\d+[.)]) +/
const TABLE_SEPARATOR = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/

// Yields the prose of a page as { line, text, listItem } segments: no code, link
// targets, entities, emphasis markers, JSX, directives, or frontmatter other than
// `description`. Table rows yield one segment per cell.
// ponytail: leading-pipe tables and single-line list items only, which is all the docs use.
const proseSegments = (source) => {
  const segments = []
  let fence = false
  let frontmatter = false
  source.split('\n').forEach((raw, i) => {
    const trimmed = raw.trim()
    if (i === 0 && trimmed === '---') return void (frontmatter = true)
    if (frontmatter) {
      if (trimmed === '---') frontmatter = false
      const description = trimmed.match(/^description:\s*["']?(.*?)["']?$/)
      if (description) segments.push({ line: i + 1, text: description[1], listItem: false })
      return
    }
    if (/^(```|~~~)/.test(trimmed)) return void (fence = !fence)
    if (fence || !trimmed || /^(<|import |export |:::)/.test(trimmed) || TABLE_SEPARATOR.test(trimmed)) return
    const clean = (text) =>
      text
        .replace(/`[^`]*`/g, ' ')
        .replace(/\]\([^)]*\)/g, ']')
        .replace(/&\w+;/g, ' ')
        .replace(/\*\*|__|(?<!\w)[*_]|[*_](?!\w)/g, '')
    const listItem = LIST_ITEM.test(raw)
    const body = raw.replace(LIST_ITEM, '').replace(/^\s*(#+|>)\s*/, '')
    const cells = trimmed.startsWith('|') ? trimmed.slice(1).split(/(?<!\\)\|/) : [body]
    cells.forEach((cell) => {
      const text = clean(cell).trim()
      if (text) segments.push({ line: i + 1, text, listItem })
    })
  })
  return segments
}

const lintSte = (source) => {
  const findings = []
  const firstSeen = new Map()
  for (const { line, text, listItem } of proseSegments(source)) {
    for (const [rule, level, re] of STE_RULES)
      for (const m of text.matchAll(re)) findings.push({ line, rule, level, match: m[0] })
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      const words = sentence.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length
      if (words > MAX_WORDS) findings.push({ line, rule: 'long-sentence', level: 'hard', match: `${words} words` })
    }
    if (listItem && /\b(?:and|or)\s*$/i.test(text))
      findings.push({ line, rule: 'dangling-conjunction', level: 'hard', match: text.slice(-20) })
    SYNONYM_GROUPS.forEach((group, g) => {
      for (const base of group) {
        const key = `${g}:${base}`
        if (!firstSeen.has(key) && new RegExp(`\\b${base}(?:s|es|ed|d|ing)?\\b`, 'i').test(text))
          firstSeen.set(key, { line, base })
      }
    })
  }
  SYNONYM_GROUPS.forEach((group, g) => {
    const present = group.flatMap((base) => firstSeen.get(`${g}:${base}`) ?? []).sort((a, b) => a.line - b.line)
    for (const { line, base } of present.slice(1))
      findings.push({ line, rule: 'synonym-rotation', level: 'advisory', match: `${base} / ${present[0].base}` })
  })
  return findings.sort((a, b) => a.line - b.line)
}

const selftest = () => {
  const rules = (text) => lintSte(text).map((f) => f.rule)
  const hard = (text) => lintSte(text).filter((f) => f.level === 'hard').map((f) => f.rule)
  const bad = rules('The panel is removed; spin up the job. Perform an analysis of the seamless log. We have received the report.')
  for (const rule of ['semicolon', 'phrasal-verb', 'nominalization', 'marketing-adjective', 'passive-voice', 'compound-tense'])
    assert.ok(bad.includes(rule), rule)
  assert.deepEqual(rules('The request may have failed. It could be a timeout. The disk might have filled.'), [])
  assert.deepEqual(rules('```\nx = a; y = b\n```\nRun `a; b` from [the page](/x;y).'), [])
  assert.deepEqual(hard(`${'word '.repeat(26).trim()}.`), ['long-sentence'])
  // a bold lead is its own sentence
  assert.deepEqual(hard(`- **${'lead '.repeat(12).trim()}.** ${'word '.repeat(20).trim()}.`), [])
  // table cells are separate segments
  const cell = 'term '.repeat(20).trim()
  assert.deepEqual(hard(`| A | B |\n| --- | --- |\n| ${cell} | ${cell} |`), [])
  assert.deepEqual(hard('- Confirm the target and\n- Close the panel'), ['dangling-conjunction'])
  assert.deepEqual(hard('The process may include steps and'), [])
  assert.deepEqual(hard('---\ntitle: a; b\ndescription: "One; two."\n---\n'), ['semicolon'])
  assert.deepEqual(rules('Check the config. Then verify the output.'), ['synonym-rotation'])
  console.log('selftest OK')
}

const flags = process.argv.slice(2).filter((a) => a.startsWith('--'))
const paths = process.argv.slice(2).filter((a) => !a.startsWith('--'))
if (flags.includes('--selftest')) {
  selftest()
  process.exit(0)
}
const strict = flags.includes('--strict')
const targets = paths.length ? paths : ['src/pages']
let count = 0
let hardCount = 0
for (const target of targets) {
  const files = statSync(target).isDirectory() ? walk(target) : [target]
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    const lines = source.split('\n')
    lines.forEach((line, i) => {
      for (const re of PATTERNS) {
        const m = line.match(re)
        if (m) {
          console.log(`${file}:${i + 1}: [${m[0]}] ${line.trim().slice(0, 120)}`)
          count++
        }
      }
      if (!strict && EM_DASH.test(line)) {
        console.log(`${file}:${i + 1}: [em dash] ${line.trim().slice(0, 120)}`)
        count++
      }
    })
    if (strict)
      for (const f of lintSte(source)) {
        console.log(`${file}:${f.line}: ${f.level === 'hard' ? 'error' : 'advisory'} ${f.rule} [${f.match}] ${lines[f.line - 1].trim().slice(0, 100)}`)
        count++
        if (f.level === 'hard') hardCount++
      }
  }
}
if (strict) console.log(`\n${hardCount} hard STE finding(s); ${count - hardCount} warning(s) need judgment.`)
else console.log(count ? `\n${count} finding(s) — apply judgment; not all are violations.` : 'clean')
process.exit(strict && hardCount ? 1 : 0)
