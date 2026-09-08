#!/usr/bin/env node
// Kept as the existing author/agent entry point. Findings now fail the command.
import { run } from './ste/check.mjs'
process.exitCode = run(process.argv.slice(2))
