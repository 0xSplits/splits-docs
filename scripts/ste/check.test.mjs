import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkSource, sentences, wordCount, root } from './check.mjs'

const page = body => `---\ntitle: Test\ndescription: Test page\n---\n\n# Test [Test page]\n\n${body}\n`
const rules = body => checkSource(page(body)).map(f => f.rule)
const long = 'The account shows the selected token balance for each active network and each configured account in the current team today only.'

test('reads visible prose while ignoring commands, URLs, imports, and styles', () => {
  assert.deepEqual(rules(`import Thing from 'package;name'\n\nUse [the app](https://example.org/seamlessly?q=can't;a=b).\n\n\`splits --memo "can't; simply"\`\n\n\`\`\`sh\ncan't; simply\n\`\`\`\n\n<img src="/not;prose" alt="Token logo" style={{display: 'inline-block'}} />`), [])
})
test('checks inline and reference link labels', () => {
  assert.ok(rules('[Simply select](https://example.org).').includes('vocabulary'))
  assert.ok(rules('[Simply select][target].\n\n[target]: https://example.org').includes('vocabulary'))
})
test('checks prose beside inline code', () => {
  assert.ok(rules('Run `command;` simply.').includes('vocabulary'))
})
test('checks sentences across physical line breaks', () => {
  const findings = checkSource(page(long.replace('token balance', 'token\nbalance')))
  assert.ok(findings.some(f => f.rule === 'sentence-length' && f.line === 8))
})
test('checks numbered and bulleted instructions with the same limit', () => {
  assert.ok(rules(`1. ${long}`).includes('sentence-length'))
  assert.ok(rules(`- ${long}`).includes('sentence-length'))
})
test('checks metadata and Vocs subtitles', () => {
  assert.ok(checkSource(page('Text.').replace('description: Test page', 'description: "Simply select it."')).some(f => f.rule === 'vocabulary'))
  assert.ok(checkSource(page('Text.').replace('# Test [Test page]', `# Test [${long}]`)).some(f => f.rule === 'sentence-length'))
})
test('checks Markdown table cells', () => {
  assert.ok(rules(`| Name | Description |\n| --- | --- |\n| Token | ${long} |`).includes('sentence-length'))
})
test('checks callouts and block quotes', () => {
  assert.ok(rules(':::note\nIt is automatically created.\n:::').includes('passive-voice'))
  assert.ok(rules('> You can’t continue.').includes('contraction'))
})
test('checks image alt text and JSX accessibility labels', () => {
  assert.ok(rules('![Simply select](image.png)').includes('vocabulary'))
  assert.ok(rules('<img alt="Simply select" />').includes('vocabulary'))
  assert.ok(rules('<button aria-label="Simply select">Select</button>').includes('vocabulary'))
})
test('checks raw JSX prose and literal expressions', () => {
  assert.ok(rules('<p>Simply select the account.</p>').includes('vocabulary'))
  assert.ok(rules('Text {"simply"}.').includes('vocabulary'))
  assert.ok(rules('{"simply"}').includes('vocabulary'))
})
test('rejects unchecked dynamic prose without flagging comments', () => {
  assert.ok(rules('{getProse()}').includes('dynamic-prose'))
  assert.deepEqual(rules('{/* author comment */}\n\nSelect the account.'), [])
  assert.ok(rules('<img alt={getAlt()} />').includes('dynamic-prose'))
})
test('checks apostrophes without rejecting possession', () => {
  assert.ok(rules("You can't continue.").includes('contraction'))
  assert.ok(rules('You can’t continue.').includes('contraction'))
  assert.deepEqual(rules("The member's signing key is available."), [])
})
test('checks decoded punctuation', () => {
  assert.ok(rules('Select the account&#59; open its settings.').includes('punctuation'))
  assert.ok(rules('Select the account—open its settings.').includes('punctuation'))
})
test('limits paragraphs to six sentences', () => {
  assert.ok(rules('Select the account. '.repeat(7)).includes('paragraph-length'))
  assert.deepEqual(rules('Select the account. '.repeat(6)), [])
})
test('does not split decimals, identifiers, or common abbreviations', () => {
  assert.equal(sentences('The fee is 0.25%. The file is config.json.').length, 2)
  assert.equal(sentences('The U.S. team has a balance.').length, 1)
})
test('counts protected labels, quoted text, parentheses, and hyphenated words', () => {
  assert.equal(wordCount('Select "Create a team" (the first option).'), 3)
  assert.equal(wordCount('Automated Earn has a 3-day timelock.'), 5)
  assert.equal(wordCount('Wait 5 minutes.'), 2)
})
test('does not exempt a sentence because it contains a technical term', () => {
  assert.ok(rules('The API key is automatically created.').includes('passive-voice'))
})
test('enforces page metadata, one H1, and the subtitle', () => {
  assert.ok(checkSource('# Page\n\nText.').some(f => f.rule === 'metadata'))
  assert.ok(rules('# Second [Title]').includes('page-title'))
  assert.ok(checkSource(page('Text.').replace('# Test [Test page]', '# Test')).some(f => f.rule === 'page-title'))
})
test('fails closed on invalid MDX and invalid YAML', () => {
  assert.ok(rules('<Card>').includes('parse'))
  assert.ok(checkSource(page('Text.').replace('title: Test', 'title: [')).some(f => f.rule === 'metadata'))
})
test('CLI discovers future Markdown and MDX pages recursively and fails on findings', () => {
  const directory = mkdtempSync(join(tmpdir(), 'splits-ste-'))
  try {
    writeFileSync(join(directory, 'new.mdx'), page('Select the account.'))
    let result = spawnSync(process.execPath, ['scripts/check-prose.mjs', directory], {cwd: root, encoding: 'utf8'})
    assert.equal(result.status, 0, result.stderr)
    writeFileSync(join(directory, 'future.md'), 'Simply select the account.')
    result = spawnSync(process.execPath, ['scripts/check-prose.mjs', directory], {cwd: root, encoding: 'utf8'})
    assert.equal(result.status, 1)
    assert.match(result.stderr, /future\.md:1: \[vocabulary\]/)
    result = spawnSync(process.execPath, ['scripts/check-prose.mjs', join(directory, 'missing')], {cwd: root, encoding: 'utf8'})
    assert.equal(result.status, 1)
  } finally { rmSync(directory, {recursive: true, force: true}) }
})

test('checks visible text in custom components and their text attributes', () => {
  assert.ok(rules('<Card>Simply select the account.</Card>').includes('vocabulary'))
  assert.ok(rules('<Card label="Simply select" />').includes('vocabulary'))
})
test('ignores literal JSX code without exempting nearby prose', () => {
  assert.deepEqual(rules('<code>simply;</code>'), [])
  assert.ok(rules('Simply use <code>some;code</code>.').includes('vocabulary'))
})
test('state descriptions and ordinary nouns do not imply complex verbs', () => {
  assert.deepEqual(rules('There is nothing to claim. The experiments have limited testing.'), [])
  assert.ok(rules('The team has configured an account.').includes('complex-verb'))
})
