import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, cpSync, symlinkSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { root, checkTerms } from './check.mjs'

const entry = {
  term: 'account', kind: 'noun', category: 'computing',
  definition: 'An account holds assets.', home: '/accounts', usage: 'Use as a noun.',
}
test('validates registry structure, definitions, homes, and technical verb forms', () => {
  assert.deepEqual(checkTerms([entry]), [])
  for (const entries of [[], {}, [null], [entry, entry], [{...entry, definition: ''}],
    [{...entry, kind: 'adjective'}], [{...entry, home: '/missing-page'}],
    [{...entry, kind: 'verb'}], [{...entry, avoid: 'anything'}]]) {
    assert.ok(checkTerms(entries).length > 0)
  }
})
test('glossary check fails for missing, stale, and manually edited output', () => {
  const directory = mkdtempSync(join(tmpdir(), 'splits-glossary-'))
  try {
    mkdirSync(join(directory, 'src/pages/resources'), {recursive:true})
    mkdirSync(join(directory, 'scripts'), {recursive:true})
    cpSync(join(root, 'scripts/ste'), join(directory, 'scripts/ste'), {recursive:true})
    symlinkSync(join(root, 'node_modules'), join(directory, 'node_modules'), 'dir')
    const registry = join(directory, 'scripts/ste/terms.json')
    writeFileSync(registry, JSON.stringify([entry]))
    writeFileSync(join(directory, 'src/pages/accounts.mdx'), '---\ntitle: Accounts\ndescription: Account records\n---\n\n# Accounts [Account records]\n')
    const run = (...args) => spawnSync(process.execPath, ['scripts/ste/glossary.mjs', ...args], {cwd: directory, encoding:'utf8'})
    assert.equal(run('--check').status, 1)
    assert.equal(run().status, 0)
    assert.equal(run('--check').status, 0)
    writeFileSync(registry, JSON.stringify([{...entry, definition: 'An account contains assets.'}]))
    assert.equal(run('--check').status, 1)
    assert.equal(run().status, 0)
    const output = join(directory, 'src/pages/resources/glossary.mdx')
    writeFileSync(output, readFileSync(output, 'utf8') + '\nManual edit.\n')
    assert.equal(run('--check').status, 1)
  } finally { rmSync(directory, {recursive:true, force:true}) }
})
