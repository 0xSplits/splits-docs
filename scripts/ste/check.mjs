import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkDirective from 'remark-directive'
import { parse as parseYaml } from 'yaml'

export const root = fileURLToPath(new URL('../../', import.meta.url))
const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkFrontmatter).use(remarkDirective)
export const terms = JSON.parse(readFileSync(new URL('./terms.json', import.meta.url), 'utf8'))
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const segmenter = new Intl.Segmenter('en-US', { granularity: 'sentence' })

// This is a project checker, not the ASD dictionary or a compliance certificate.
// Never make a blanket exemption for a technical term: only exact occurrences
// are protected from alias checks. Their surrounding sentences are still checked.
const replacements = [
  ['utilize', 'use'], ['utilizes', 'uses'], ['utilizing', 'use'],
  ['prior to', 'before'], ['subsequent to', 'after'], ['in order to', 'to'],
  ['via', 'through'], ['e.g.', 'for example'], ['i.e.', 'that is'],
  ['etc.', 'give the complete list or state its limits'],
  ['simply', 'remove this word'], ['seamless', 'describe the function'],
  ['seamlessly', 'describe the function'], ['effortlessly', 'describe the function'],
  ['easy', 'describe the procedure'], ['easily', 'describe the procedure'],
  ['powerful', 'describe the capability'], ['robust', 'describe the tested property'],
  ['backstop', 'describe the recovery method'], ['under the hood', 'describe the mechanism'],
  ['best-in-class', 'describe the measured property'], ['peace of mind', 'describe the protection'],
  ['leverage', 'use'], ['leverages', 'uses'], ['click here', 'name the link target'],
  ['hit', 'select'], ['pick', 'select'], ['whilst', 'while'], ['amongst', 'among'],
  ['labelled', 'labeled'], ['behaviour', 'behavior'], ['colour', 'color'],
  ['on-chain', 'onchain'], ['off-chain', 'offchain'], ['cross-chain', 'crosschain'],
  ['keypair', 'key pair'], ['stables', 'stablecoins'], ['invoicee', 'payer'],
]
const patterns = replacements.map(([word, hint]) => ({
  re: new RegExp(`(?<![\\w-])${escape(word)}(?![\\w-])`, 'gi'), rule: 'vocabulary', hint,
}))
patterns.push(
  { re: /[;；]/g, rule: 'punctuation', hint: 'Use a period or separate list items.' },
  { re: /—/g, rule: 'punctuation', hint: 'Use a period, comma, colon, or parentheses.' },
  { re: /\b(?:can['’]t|won['’]t|shan['’]t|[a-z]+n['’]t|[a-z]+['’](?:re|ve|ll|d)|(?:it|that|there|what|who|here)['’]s)\b/gi,
    rule: 'contraction', hint: 'Write the full words.' },
  { re: /\b(?:am|is|are|was|were|be|been)\s+(?!nothing\b|something\b|anything\b|everything\b)\w+ing\b/gi,
    rule: 'progressive-verb', hint: 'Use a simple verb form.' },
  { re: /\b(?:has|have|had)\s+(?!limited\s+(?:testing|access|support)\b)(?:been|become|done|made|seen|taken|given|\w+ed)\b/gi,
    rule: 'complex-verb', hint: 'Use a simple tense.' },
  { re: /\b(?:by|before|after|when|while|without)\s+(?:using|adding|removing|selecting|sending|creating|signing|connecting|paying|saving|submitting)\b/gi,
    rule: 'verb-form', hint: 'Use a clause with a subject and a simple verb.' },
  { re: /\b(?:is|are|was|were|be|been)\s+(?:automatically\s+)?(?:created|generated|stored|shown|displayed|sent|added|removed|required|rejected|approved|signed|executed|enabled|disabled|deducted|charged|included|marked|attached|verified|paid|held|controlled|owned)\b/gi,
    rule: 'passive-voice', hint: 'Name the actor and use active voice. Review state adjectives separately.' },
)

export function filesUnder(target) {
  if (!statSync(target).isDirectory()) return /\.mdx?$/.test(target) ? [target] : []
  return readdirSync(target).sort().flatMap(name => filesUnder(resolve(target, name)))
}

function textOf(node, protect = false) {
  if (node.type === 'inlineCode' || ['code', 'pre'].includes(node.name)) return protect ? 'CODE' : ''
  if (node.type === 'image') return node.alt ?? ''
  if (node.type === 'mdxTextExpression') {
    const expression = node.data?.estree?.body?.[0]?.expression
    return expression?.type === 'Literal' && typeof expression.value === 'string' ? expression.value : ''
  }
  if (node.type === 'text') return node.value
  return (node.children ?? []).map(child => textOf(child, protect)).join('')
}

export function sentences(text) {
  // Periods inside common abbreviations, identifiers, and decimals are not stops.
  const normalized = text.replace(/\s+/g, ' ').replace(/\b(?:e\.g\.|i\.e\.|U\.S\.|U\.K\.)/gi, x => x.replaceAll('.', '∙'))
    .replace(/(?<=\w)\.(?=\w)/g, '∙')
  return [...segmenter.segment(normalized)].map(x => x.segment.trim()).filter(Boolean)
}

export function wordCount(text) {
  let value = text.replace(/\([^()]*\)/g, ' PAREN ')
    .replace(/"[^"\n]+"|“[^”\n]+”/g, ' QUOTE ')
  for (const entry of terms.filter(t => ['name', 'label', 'abbreviation'].includes(t.kind)).sort((a,b) => b.term.length-a.term.length)) {
    value = value.replace(new RegExp(`(?<![\\w-])${escape(entry.term)}(?![\\w-])`, 'g'), 'NAME')
  }
  value = value.replace(/\b\d+(?:[.,]\d+)*\s+(?:USD|EUR|USDC|EURC|ETH|wei|seconds?|minutes?|hours?|days?|bytes?|characters?|%)\b/g, 'MEASURE')
  return (value.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu) ?? []).length
}

export function checkSource(source, file = 'page.mdx') {
  const findings = []
  const add = (node, rule, message) => findings.push({file, line: node.position?.start.line ?? 1, rule, message})
  let tree
  try { tree = parser.parse(source) } catch (error) {
    return [{file, line: error.line ?? 1, rule: 'parse', message: error.reason ?? error.message}]
  }
  const isPage = extname(file) === '.mdx'
  const headings = tree.children.filter(n => n.type === 'heading' && n.depth === 1)
  if (isPage && (headings.length !== 1 || !/\[[^\]]+\]$/.test(textOf(headings[0] ?? {})))) {
    add(tree, 'page-title', 'Use one H1 with a [subtitle].')
  }
  const prose = (node, text, limit = 20, count = text) => {
    for (const {re, rule, hint} of patterns) {
      re.lastIndex = 0
      for (const match of text.matchAll(re)) add(node, rule, `“${match[0]}”: ${hint}`)
    }
    for (const entry of terms) for (const alias of entry.avoid ?? []) {
      if (new RegExp(`(?<![\\w-])${escape(alias)}(?![\\w-])`, 'i').test(text)) {
        add(node, 'term', `Use “${entry.term}” instead of “${alias}”.`)
      }
    }
    // Twenty words everywhere is an intentionally stricter project policy.
    // It also covers instructions outside numbered lists without guessing genre.
    for (const sentence of sentences(count)) {
      const words = wordCount(sentence)
      if (words > limit) add(node, 'sentence-length', `${words} words (maximum ${limit}): ${sentence}`)
    }
    if (node.type === 'paragraph' && sentences(count).length > 6) add(node, 'paragraph-length', 'Split this paragraph: maximum six sentences.')
  }
  const visit = node => {
    if (node.type === 'yaml') {
      try {
        const data = parseYaml(node.value, {uniqueKeys: true})
        if (isPage && (!data?.title || !data?.description)) add(node, 'metadata', 'Supply title and description.')
        for (const key of ['title', 'description']) if (data?.[key]) {
          if (typeof data[key] !== 'string') add(node, 'metadata', `${key} must be a string.`)
          else prose(node, data[key])
        }
      } catch (error) { add(node, 'metadata', error.message) }
      return
    }
    if (['code', 'mdxjsEsm'].includes(node.type) || ['code', 'pre'].includes(node.name)) return
    if (['paragraph', 'heading', 'tableCell'].includes(node.type)) {
      let count = textOf(node, true)
      // Vocs subtitles are separate text from the title.
      if (node.type === 'heading') count = count.replace(/\s+\[([^\]]+)\]$/, '. $1')
      prose(node, textOf(node), 20, count)
    }
    if (['mdxJsxFlowElement', 'mdxJsxTextElement'].includes(node.type)) {
      for (const attr of node.attributes ?? []) {
        if (['alt', 'title', 'aria-label', 'description', 'label', 'text'].includes(attr.name)) {
          if (typeof attr.value === 'string') prose(node, attr.value)
          else add(node, 'dynamic-prose', `Use literal text for ${attr.name} so it can be checked.`)
        }
      }
      // HTML paragraphs and headings have no mdast paragraph child.
      if ((node.children ?? []).some(c => ['text', 'mdxTextExpression'].includes(c.type)) &&
          !(node.children ?? []).some(c => c.type === 'paragraph')) prose(node, textOf(node), 20, textOf(node, true))
    }
    if (['mdxFlowExpression','mdxTextExpression'].includes(node.type)) {
      const expression = node.data?.estree?.body?.[0]?.expression
      const isComment = !expression && !node.value.replace(/\/\*[\s\S]*?\*\//g, '').trim()
      if (node.type === 'mdxFlowExpression' && expression?.type === 'Literal' && typeof expression.value === 'string') {
        prose(node, expression.value)
      }
      if (!isComment && !(expression?.type === 'Literal' && typeof expression.value === 'string')) {
        add(node, 'dynamic-prose', 'Keep page prose literal so the checker can read it.')
      }
    }
    for (const child of node.children ?? []) visit(child)
  }
  visit(tree)
  if (isPage && !tree.children.some(n => n.type === 'yaml')) add(tree, 'metadata', 'Supply YAML title and description.')
  return findings
}

export function checkTerms(entries = terms) {
  const errors = []
  if (!Array.isArray(entries) || !entries.length) return ['The term registry must be a nonempty array.']
  const seen = new Set()
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object' || !['term', 'definition', 'home', 'category', 'usage'].every(key => typeof entry[key] === 'string' && entry[key].trim()) || !['noun', 'verb', 'name', 'label', 'abbreviation'].includes(entry.kind)) {
      errors.push(`Incomplete term: ${JSON.stringify(entry)}`)
      continue
    }
    if (seen.has(entry.term)) errors.push(`Duplicate term: ${entry.term}`)
    seen.add(entry.term)
    if (!entry.category || !entry.usage) errors.push(`Term needs category and usage: ${entry.term}`)
    if (!entry.home.startsWith('/')) errors.push(`Term needs an internal canonical home: ${entry.term}`)
    const path = entry.home.split('#')[0]
    if (!['.mdx', '/index.mdx'].some(suffix => {
      try { return statSync(resolve(root, `src/pages${path}${suffix}`)).isFile() } catch { return false }
    })) errors.push(`Missing canonical home for ${entry.term}: ${entry.home}`)
    if (entry.kind === 'verb' && (!Array.isArray(entry.forms) || !entry.forms.length || entry.forms.some(f => typeof f !== 'string' || !f.trim()))) errors.push(`Technical verb needs forms: ${entry.term}`)
    if (entry.avoid && (!Array.isArray(entry.avoid) || entry.avoid.some(a => typeof a !== 'string' || !a.trim()))) errors.push(`Invalid term variants: ${entry.term}`)
  }
  return errors
}

export function run(targets = []) {
  const paths = targets.length ? targets.map(p => resolve(p)) : [resolve(root, 'src/pages')]
  let allFiles
  try { allFiles = [...new Set(paths.flatMap(filesUnder))] } catch (error) {
    console.error(error.message)
    return 1
  }
  if (!allFiles.length) { console.error('No Markdown or MDX files found.'); return 1 }
  const errors = checkTerms()
  for (const error of errors) console.error(`scripts/ste/terms.json:1: [term-registry] ${error}`)
  if (errors.length) return 1
  let total = 0
  for (const file of allFiles) {
    const findings = checkSource(readFileSync(file, 'utf8'), relative(root, file))
    for (const {file: name, line, rule, message} of findings) console.error(`${name}:${line}: [${rule}] ${message}`)
    total += findings.length
  }
  console.log(`${allFiles.length} files checked. ${total} findings. Editorial STE review is also required.`)
  return total ? 1 : 0
}
