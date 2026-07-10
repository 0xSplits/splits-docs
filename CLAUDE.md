# splits-docs authoring rules

User-facing docs for Splits (app.splits.org), built with Vocs. Pages serve **two audiences equally**: humans reading HTML and agents reading the auto-generated `.md` twins / `llms.txt` / `llms-full.txt`. Template page: `src/pages/teams/members.mdx`.

## Accuracy

1. **Code is the source of truth.** Verify every behavioral claim against product source before writing it. The sources, by surface:
   - `0xSplits/splits` (private) — the backend; authoritative for enforcement, automations, earn, banking
   - `../splits-teams` — the web client; UI flows, role gating (e.g. `types/index.ts`, `components/settings/utils.tsx`, `hooks/useTransactions.ts`)
   - `0xSplits/splits-cli` — CLI/MCP commands, flags, scopes
   - `0xSplits/splits-connect` — the browser extension
   - `0xSplits/splits-contracts-monorepo` (`packages/smart-vaults`) — the onchain account/module contracts
   Legacy docs prose is not a reliable source; it has known errors.
2. **Never extrapolate product facts.** If the code can't answer it, flag the claim for a human instead of guessing.
3. **Signers ≠ passkeys.** Signing authority belongs to a member's *signers*: passkeys or CLI-registered EOAs. Never describe signing as passkey-only.

## Structure

4. **One page, one job.** Each page serves a single job-to-be-done. Sections mirror product surfaces and use cases (Teams, Accounts, Transactions, …), not doc genres.
5. **Definition first.** Open with a technical definition of the thing. State only facts this page owns.
   - Every H1 carries a subtitle via Vocs' `# Title [subtitle]` syntax: a one-line grounding summary. It renders as a styled subtitle for humans and stays inline in the `.md` twin for agents (frontmatter descriptions are stripped from `.md`, so the subtitle is the only in-page summary agents see).
6. **State negative invariants explicitly** (e.g. "membership confers no onchain authority"). Agents need the boundaries, not just the capabilities.
7. **Every fact has exactly one canonical home.** Everywhere else links to it; never restate. Restated copies drift independently; this is how the docs' known errors happened.
8. **Tables for matrix-shaped facts** (capabilities, comparisons, support grids). **Numbered steps for procedures**, with prerequisites stated first.
9. **Single H1 per page**, proper H2/H3 hierarchy. Section anchors are API: other pages link to them.
10. **Add a "Programmatic access" section** wherever the CLI/MCP covers the feature, with commands and required scopes.

## Naming & terminology

- **Core concepts are Team, Member, Account** (not "Person"; that entity doesn't exist in the product; `OrgMember` does).
- **Section landing pages**: each feature section's title links to an index page (`src/pages/<section>/index.mdx`) that defines the noun and covers its primary flow (e.g. Teams landing includes "Creating a team"). No "Overview"/"Creating"-style child pages.
- **The product is "the app"** at app.splits.org (teams.splits.org is deprecated). Write "onchain" (no hyphen). No marketing jargon: be explicit and precise about what things are.
- **Capitalization: product-named entities are proper nouns; generic concepts are lowercase.** Capitalize roles (Owner, Member), named accounts (Root, Treasury), and feature names (Earn, Automated Earn, Splits Connect, Recovery-the-settings-surface). Lowercase concepts: signer, passkey, threshold, account, team, module, automation, invoice, memo. Note the pair this enables: "member" = a person in a team; "Member" = the role.
- **Em dashes**: never, anywhere. List items and definition lists use a colon separator (`` `command`: description ``); in prose, a colon, period, comma, semicolon, or parentheses replaces the em dash. The prose linter flags every em dash.
- **"Team" → "workspace" rename is planned** in the product. Docs keep saying "team" until the product ships the rename, then migrate in one pass (prose + `/teams/` URLs + section name).

## Style

11. **No screenshots** until there is a system for generating and updating them automatically (e.g. Playwright against a seeded demo team). The app UI changes too often to maintain them by hand.
12. **No "Last updated" lines** on reworked pages.
13. **Page titles ≤ 2 words** where possible; sidebar labels match.
14. **Cut anything that can be removed without losing meaning.** No welcome fluff, no "we plan to make this easier", no restating what a link target already says. Answer first.
15. **Every sentence must be falsifiable.** If a clause tells the reader how to feel about a fact instead of stating the fact ("seamlessly", "intentional friction when mistakes are most expensive", "so you can…"), cut it or replace it with the mechanism. Test: delete the clause; if only persuasion is lost, it was jargon. Run `node scripts/check-prose.mjs <paths>` after editing prose; findings are warnings that need judgment, not automatic failures.

## Mechanics

- Never commit without explicit approval.
- **Settings deep links**: the first actionable mention of a settings surface on a page links to its app URL (e.g. `[Settings > Banks](https://app.splits.org/settings/team/banks/)`); later mentions on the same page and table cells stay plain.
- Sidebar lives in `vocs.config.ts`; URLs derive from file paths under `src/pages/`; moving a file changes its URL, so update inbound links (grep for the old path).
- Verify with `pnpm build` (validates all internal links) and check the `.md` twin (e.g. `curl localhost:5173/teams/members.md`); that is what agents consume.
