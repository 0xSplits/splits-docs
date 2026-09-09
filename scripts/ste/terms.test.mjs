import test from 'node:test'
import assert from 'node:assert/strict'
import { checkTerms } from './check.mjs'

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
