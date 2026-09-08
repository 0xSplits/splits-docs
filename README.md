# Splits docs

User-facing docs for [Splits](https://app.splits.org), built with [Vocs](https://vocs.dev). Every page serves two audiences: humans reading the HTML, and agents reading the auto-generated markdown twins (append `.md` to any URL, or fetch `/llms.txt` / `/llms-full.txt`).

## Where these are served

These pages are published at [splits.org/docs](https://splits.org/docs). The website ([0xSplits/website](https://github.com/0xSplits/website)) reverse-proxies `/docs` and everything under it to this deployment, so splits.org serves them same-origin. This project's own Vercel domains are the proxy origin, not the public URL.

The build sets `basePath: '/docs'`, so every route lives under that prefix on this deployment too, previews included. To view a pull request's changes, open `<preview-url>/docs`: the preview root is not a page and 404s.

## Local development

```bash
pnpm install
pnpm dev       # dev server, at localhost:5173/docs
pnpm build     # production build; validates every internal link
pnpm preview   # preview the build
```

## Rules

The authoring rules are in [CLAUDE.md](CLAUDE.md). [STE.md](STE.md) defines the ASD-STE100 Issue 9 writing, terminology, and review process. The load-bearing ones:

- **Code is the source of truth.** Verify every behavioral claim against product source before writing it: `0xSplits/splits` (backend), `splits-teams` (web client), `splits-cli`, `splits-connect`, and `splits-contracts-monorepo`. Never extrapolate a product fact; if the code can't answer it, flag it for a human instead of guessing.
- **Every fact has exactly one canonical home.** Everywhere else links to it. Restated copies drift independently; that's how doc errors happen.
- **Definition first.** One H1 per page with a `# Title [subtitle]` summary, sections that mirror product surfaces, negative invariants stated explicitly, tables for matrix-shaped facts, numbered steps only where order matters.
- **No screenshots, no "Last updated" prose, no em dashes, no marketing jargon.** Every sentence must be falsifiable: cut anything that can be removed without losing meaning.

## Process

How these docs get updated, by humans or agents:

1. **Verify with subagents.** Fan out read-only agents per feature area against the source repos, requiring file:line evidence and an explicit "cannot verify" for anything the code doesn't answer.
2. **Check source evidence.** Re-check surprising claims in the primary source before writing them. A separate maintainer must complete STE editorial review before merge.
3. **Check the output.** Run `pnpm build` for mandatory prose checks, glossary verification, checker tests, and link validation, and read the `.md` twin (`curl localhost:5173/docs/<path>.md`); the twin is what agents consume. Twins, `llms.txt`, and `llms-full.txt` all live under the base path, locally and in production.
4. **Mind the URLs.** The sidebar lives in `vocs.config.ts` and URLs derive from file paths under `src/pages/`, so moving a file means grepping for inbound links first.

## STE checks

```sh
pnpm check:docs        # scan all public Markdown and MDX
pnpm glossary:generate # update the glossary after term registry changes
pnpm test:prose        # test the checker and editorial review gate
pnpm build            # run all checks and build the site
```

Edit technical terms in [scripts/ste/terms.json](scripts/ste/terms.json). The generated glossary is available in both HTML and Markdown. The checker reports file and line locations and fails on findings. New pages enter the scan automatically.

The checker covers a defined subset of STE rules. A qualified editorial review must check vocabulary, meanings, grammar, and instructions against the official standard. The reviewer approves the current commit with `STE review complete` in the review body.

CI provides `Docs checks` and `STE editorial review`. After the initial merge, an administrator must require both checks and one approval in the existing branch ruleset. See [repository enforcement](STE.md#repository-enforcement). Until that setting changes, GitHub can permit a merge with failed checks.
