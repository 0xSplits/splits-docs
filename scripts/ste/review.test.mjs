import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

const workflow = parse(readFileSync(new URL('../../.github/workflows/ste-review.yml', import.meta.url), 'utf8'))
const script = workflow.jobs['editorial-review'].steps[0].with.script
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const review = (overrides = {}) => ({
  id: 1, state: 'APPROVED', commit_id: 'current', body: 'STE review complete',
  user: { login: 'reviewer', type: 'User' }, ...overrides,
})
async function run(reviews, permission = 'write') {
  const result = { errors: [], infos: [] }
  const github = {
    rest: {
      pulls: { get: async () => ({data: {head: {sha: 'current'}, user: {login: 'author'}}}), listReviews: Symbol() },
      repos: { getCollaboratorPermissionLevel: async () => ({data: {permission}}) },
    },
    paginate: async () => reviews,
  }
  await new AsyncFunction('github', 'context', 'core', script)(github,
    {repo: {owner: 'org', repo: 'docs'}, payload: {pull_request: {number: 1}}},
    {info: text => result.infos.push(text), setFailed: text => result.errors.push(text)})
  return result
}

test('accepts explicit approval by a maintainer on the current commit', async () => {
  assert.equal((await run([review()])).errors.length, 0)
})
test('requires a review, approval state, and explicit statement', async () => {
  for (const reviews of [[], [review({state: 'COMMENTED'})], [review({body: 'Looks good'})]]) {
    assert.equal((await run(reviews)).errors.length, 1)
  }
})
test('rejects old commits, the author, bots, and readers', async () => {
  for (const overrides of [
    {commit_id: 'old'}, {user: {login: 'author', type: 'User'}},
    {user: {login: 'review-bot', type: 'Bot'}},
  ]) assert.equal((await run([review(overrides)])).errors.length, 1)
  assert.equal((await run([review()], 'read')).errors.length, 1)
})
test('a later change request or dismissal invalidates approval', async () => {
  for (const state of ['CHANGES_REQUESTED', 'DISMISSED']) {
    assert.equal((await run([review(), review({id: 2, state})])).errors.length, 1)
  }
})
test('a later comment does not cancel approval', async () => {
  assert.equal((await run([review(), review({id: 2, state: 'COMMENTED', body: 'Thanks'})])).errors.length, 0)
})
test('a later approval can resolve an earlier request for changes', async () => {
  assert.equal((await run([review({state: 'CHANGES_REQUESTED'}), review({id: 2})])).errors.length, 0)
})
test('does not execute PR code or interpolate PR content as JavaScript', () => {
  assert.equal(workflow.jobs['editorial-review'].steps.length, 1)
  assert.ok(!script.includes('${{'))
  assert.equal(workflow.permissions['pull-requests'], 'read')
  assert.ok(!workflow.on.pull_request_target)
})
