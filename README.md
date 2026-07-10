# Splits docs

User-facing docs for [Splits](https://app.splits.org), built with [Vocs](https://vocs.dev). Every page serves two audiences: humans reading the HTML, and agents reading the auto-generated markdown twins (append `.md` to any URL, or fetch `/llms.txt` / `/llms-full.txt`).

## Local development

```bash
pnpm install
pnpm dev       # dev server
pnpm build     # production build; validates every internal link
pnpm preview   # preview the build
```

## Rules

The full authoring ruleset lives in [CLAUDE.md](CLAUDE.md). The load-bearing ones:

- **Code is the source of truth.** Verify every behavioral claim against product source before writing it: `0xSplits/splits` (backend), `splits-teams` (web client), `splits-cli`, `splits-connect`, and `splits-contracts-monorepo`. Never extrapolate a product fact; if the code can't answer it, flag it for a human instead of guessing.
- **Every fact has exactly one canonical home.** Everywhere else links to it. Restated copies drift independently; that's how doc errors happen.
- **Definition first.** One H1 per page with a `# Title [subtitle]` summary, sections that mirror product surfaces, negative invariants stated explicitly, tables for matrix-shaped facts, numbered steps only where order matters.
- **No screenshots, no "Last updated" prose, no em dashes, no marketing jargon.** Every sentence must be falsifiable: cut anything that can be removed without losing meaning.

## Process

How these docs get updated, by humans or agents:

1. **Verify with subagents.** Fan out read-only agents per feature area against the source repos, requiring file:line evidence and an explicit "cannot verify" for anything the code doesn't answer.
2. **Act as the single final approver.** Re-check any surprising claim yourself in the primary source before writing it.
3. **Check the output.** Run `node scripts/check-prose.mjs <paths>` on touched prose, `pnpm build` for link validation, and read the `.md` twin (`curl localhost:5173/<path>.md`); the twin is what agents consume.
4. **Mind the URLs.** The sidebar lives in `vocs.config.ts` and URLs derive from file paths under `src/pages/`, so moving a file means grepping for inbound links first.
