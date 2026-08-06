#!/usr/bin/env node
// Deterministic ASD-STE100 checks for user-facing MDX prose.
//
// Usage:
//   node scripts/check-ste.mjs <path...>
//   node scripts/check-ste.mjs --changed <base-ref>
//
// This checker intentionally leaves vocabulary, noun clusters, voice, meaning,
// and one-action procedure review to a human. See STE-TERMS.md and CLAUDE.md.

import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const CONTRACTION = /\b(?:aren['’]t|can['’]t|couldn['’]t|didn['’]t|doesn['’]t|don['’]t|hasn['’]t|haven['’]t|isn['’]t|it['’]s|shouldn['’]t|that['’]s|there['’]s|they['’](?:re|ve|ll)|wasn['’]t|we['’](?:re|ve|ll)|weren['’]t|won['’]t|wouldn['’]t|you['’](?:re|ve|ll))\b/gi
const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' })

function walk(path, files = []) {
  if (!statSync(path).isDirectory()) return path.endsWith('.mdx') ? [...files, path] : files
  for (const entry of readdirSync(path)) {
    const item = join(path, entry)
    if (statSync(item).isDirectory()) walk(item, files)
    else if (item.endsWith('.mdx')) files.push(item)
  }
  return files
}

function changedFiles(base) {
  const output = execFileSync('git', ['diff', '--name-only', '--diff-filter=ACMR', `${base}...HEAD`], { encoding: 'utf8' })
  return output.split('\n').filter((path) => path.startsWith('src/pages/') && path.endsWith('.mdx'))
}

function cleanInline(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`[^`]+`/g, ' IDENTIFIER ')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, ' UI_LABEL ')
    .replace(/“[^”]*”|"[^"]*"/g, ' QUOTED_TEXT ')
    .replace(/\([^()]*\)/g, ' PARENTHETICAL_TEXT ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractBlocks(path) {
  const lines = readFileSync(path, 'utf8').split('\n')
  const blocks = []
  let paragraph = []
  let frontmatter = false
  let code = false

  function flush() {
    if (paragraph.length) {
      blocks.push({ type: 'descriptive', paragraph: true, line: paragraph[0].line, text: cleanInline(paragraph.map(({ text }) => text).join(' ')) })
    }
    paragraph = []
  }

  lines.forEach((raw, index) => {
    const line = index + 1
    const trimmed = raw.trim()
    if (line === 1 && trimmed === '---') { frontmatter = true; return }
    if (frontmatter) { if (trimmed === '---') frontmatter = false; return }
    if (/^\s*```/.test(raw)) { flush(); code = !code; return }
    if (code || /^\s*(?:import|export)\b/.test(raw)) return
    if (!trimmed || /^\s*#{1,6}\s/.test(raw) || /^\s*:::\w*/.test(raw) || /^\s*\|/.test(raw) || /^\s*<\/?[A-Z]/.test(raw)) {
      flush()
      return
    }

    const list = raw.match(/^\s*(?:[-+*]|\d+\.)\s+(.*)$/)
    if (list) {
      flush()
      blocks.push({
        type: /^\s*\d+\./.test(raw) ? 'procedural' : 'descriptive',
        vertical: true,
        line,
        text: cleanInline(list[1]),
      })
      return
    }
    paragraph.push({ line, text: trimmed })
  })
  flush()
  return blocks.filter(({ text }) => text)
}

function sentences(text, splitColon) {
  // Under STE Rule 8.4, a colon in a vertical list ends a sentence for word count.
  return [...sentenceSegmenter.segment(splitColon ? text.replaceAll(':', '.') : text)]
    .map(({ segment }) => segment.trim())
    .filter(Boolean)
}

function wordCount(text) {
  return (text.match(/\b[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*\b/gu) || []).length
}

function inspect(path) {
  const findings = []
  for (const block of extractBlocks(path)) {
    const parts = sentences(block.text, block.vertical)
    if (block.paragraph && parts.length > 6) {
      findings.push({ line: block.line, rule: '6.6', message: `paragraph has ${parts.length} sentences; maximum is 6`, source: block.text })
    }
    for (const sentence of parts) {
      const limit = block.type === 'procedural' ? 20 : 25
      const count = wordCount(sentence)
      if (count > limit) {
        const rule = block.type === 'procedural' ? '5.1' : '6.3'
        findings.push({ line: block.line, rule, message: `sentence has ${count} words; maximum is ${limit}`, source: sentence })
      }
      if (sentence.includes(';')) findings.push({ line: block.line, rule: '8.1', message: 'semicolon is not permitted', source: sentence })
      for (const match of sentence.matchAll(CONTRACTION)) {
        findings.push({ line: block.line, rule: '4.2', message: `contraction is not permitted: ${match[0]}`, source: sentence })
      }
    }
  }
  return findings
}

const args = process.argv.slice(2)
let files
if (args[0] === '--changed') {
  if (!args[1]) throw new Error('--changed requires a base ref')
  files = changedFiles(args[1])
} else {
  const targets = args.length ? args : ['src/pages']
  files = targets.flatMap((target) => walk(target))
}

const findings = []
for (const path of [...new Set(files)].sort()) {
  for (const finding of inspect(path)) {
    findings.push({ ...finding, path })
  }
}

for (const finding of findings) {
  console.error(`${finding.path}:${finding.line}: ASD-STE100 ${finding.rule}: ${finding.message}`)
}

if (findings.length) {
  console.error(`\n${findings.length} deterministic ASD-STE100 finding(s).`)
  process.exit(1)
}
console.log(`ASD-STE100 deterministic checks passed for ${new Set(files).size} file(s).`)
