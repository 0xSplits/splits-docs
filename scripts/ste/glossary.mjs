#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { terms, checkTerms } from './check.mjs'

const output = new URL('../../src/pages/resources/glossary.mdx', import.meta.url)
export function renderGlossary() {
  const intro = `---
title: Glossary
description: Technical terms used in the Splits docs
---

# Glossary [Technical terms used in the Splits docs]

This **glossary** defines technical terms in these docs. Each entry links to the page that describes the related product behavior.

`
  return intro + terms.map(entry => {
    const path = entry.home.split('#')[0]
    const base = new URL(`../../src/pages${path}`, import.meta.url)
    let source
    for (const suffix of ['.mdx', '/index.mdx']) {
      try { source = readFileSync(fileURLToPath(base) + suffix, 'utf8'); break } catch {}
    }
    const title = parseYaml(source.match(/^---\n([\s\S]*?)\n---/)[1]).title
    return `## ${entry.term}\n\n${entry.definition}\n\n[${title}](${entry.home}).\n`
  }).join('\n')
}
export function runGlossary(args = process.argv.slice(2)) {
const errors = checkTerms()
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else if (args.includes('--check')) {
  let current = ''
  try { current = readFileSync(output, 'utf8') } catch {}
  if (current !== renderGlossary()) {
    console.error('Glossary is outdated. Run pnpm glossary:generate.')
    process.exitCode = 1
  } else console.log('Glossary matches the term registry.')
} else {
  writeFileSync(output, renderGlossary())
  console.log('Generated src/pages/resources/glossary.mdx.')
}

}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runGlossary()
