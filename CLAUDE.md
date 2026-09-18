# splits-docs authoring rules

User-facing docs for Splits (app.splits.org), built with Vocs. Pages serve **two audiences equally**: humans reading HTML and agents reading the auto-generated `.md` twins / `llms.txt` / `llms-full.txt`. Template page: `src/pages/members/index.mdx`.

## The standard job: update docs for a product PR

Any agent should be able to take a product PR and update these docs without a human review pass. The checklist:

1. Read the PR's **code diff**, not its description, and list each user-visible behavior that changed.
2. Find each fact's canonical page (map below, plus `git grep`). Edit only that page; update other pages' links if the fact moved, never restate it.
3. Verify every claim you write against the code (rules below). PR descriptions and existing docs prose are not sources.
4. If a file or heading moves: grep for the old path and old `#anchor`, retarget every inbound link, and update the sidebar in `vocs.config.ts` (URLs derive from file paths under `src/pages/`).
5. Check your work: `node scripts/check-prose.mjs <paths>` (findings are warnings needing judgment, not automatic failures), `pnpm build` (validates every internal link), and read the `.md` twin (`curl localhost:5173/<path>.md`); the twin is what agents consume.
6. Never commit without explicit approval from the human in the session.

## Accuracy

1. **Code is the source of truth.** Verify every behavioral claim against product source before writing it. The sources, by surface:
   - `0xSplits/splits` (private): the backend; authoritative for enforcement, automations, earn, banking
   - `../splits-teams`: the web client; UI flows, role gating (e.g. `types/index.ts`, `components/settings/utils.tsx`)
   - `0xSplits/splits-cli`: CLI/MCP commands, flags, scopes
   - `0xSplits/splits-connect`: the browser extension
   - `0xSplits/splits-contracts-monorepo` (`packages/smart-vaults`): the onchain account/module contracts
   Legacy docs prose is not a reliable source; it has known errors.
2. **Never extrapolate product facts.** If the code can't answer it, flag the claim for a human instead of guessing. Client code alone can also mislead (e.g. signing enforced in the backend); re-verify surprising conclusions in the primary source.
3. **Signers ≠ passkeys.** Signing authority belongs to a member's signing keys: passkeys or CLI-registered EOAs. Never describe signing as passkey-only.

## Canonical homes

**Every fact has exactly one canonical home.** Everywhere else links to it; never restate. Restated copies drift independently; this is how the docs' known errors happened. The load-bearing homes (headings and anchors are API; verify they still exist before linking):

| Fact | Canonical home |
| --- | --- |
| Team definition, creating a team, setup steps | `/teams` |
| Roles, capability matrix, settings visibility, API key scopes, read-only members | `/teams/roles` |
| Recovery, recovery signers, verifying them | `/teams/recovery` |
| Settings map (each section, who sees it) | `/teams/settings` |
| Member (the person), signing up, inviting, roles-are-per-team pointer, removal | `/members` |
| Signing keys: passkeys, password managers, EOAs, verifying access, troubleshooting | `/members/keys` |
| Account types, ownership chain (Root → Treasury → sub-accounts) | `/accounts` |
| Signer definition, signers-vs-membership boundary | `/accounts/signers` |
| Thresholds, choosing one | `/accounts/thresholds` |
| Renaming, changing signers and thresholds, resetting signers via the owner | `/accounts/editing` |
| Proposal model, transaction types, gas sponsorship | `/transactions` |
| API overview, CLI/MCP setup, API key scopes model, headless signing | `/introduction/agents` |
| Experiment definition, prototype caveats | `/experiments` |
| PACT: raise mechanics, contract guarantees, limitations | `/experiments/pact` |

If a change moves a fact's canonical home, update this table in the same PR.

## Structure

4. **One page, one job.** Each page serves a single job-to-be-done. Sections mirror product surfaces and use cases (Teams, Members, Accounts, Transactions, …), not doc genres.
5. **Definition first.** Open with a technical definition of the thing. State only facts this page owns.
   - Every H1 carries a subtitle via Vocs' `# Title [subtitle]` syntax: a one-line grounding summary. Frontmatter descriptions are stripped from the `.md` twin, so the subtitle is the only in-page summary agents see.
6. **State negative invariants explicitly**, in bold (e.g. "membership confers **no onchain authority**"). Agents need the boundaries, not just the capabilities.
7. **Tables for matrix-shaped facts** (capabilities, comparisons, support grids). **Numbered steps for procedures**, with a `Prerequisites:` line first when there are any.
8. **Single H1 per page**, proper H2/H3 hierarchy. Section anchors are API: grep for inbound `#anchor` links before renaming any heading.
9. **Section landing pages**: each sidebar section's title links to an index page (`src/pages/<section>/index.mdx`) that defines the noun and covers its primary flow (e.g. Teams includes "Creating a team"). No "Overview"/"Creating"-style child pages.

## Terminology

- **Core concepts are Team, Member, Account** (not "Person" or "User"; those nouns don't name product entities in the docs).
- **The product is "the app"** at app.splits.org (teams.splits.org is deprecated). Write "onchain", "offchain", and "crosschain" (no hyphens). No marketing jargon: be explicit and precise about what things are.
- **Capitalization: product-named entities are proper nouns; generic concepts are lowercase.** Capitalize roles (Owner, Member), named accounts (Root, Treasury), and feature names (Earn, Automated Earn, Splits Connect, Recovery-the-settings-surface). Lowercase concepts: signer, signing key, passkey, threshold, account, team, member-the-person, module, automation, invoice, memo. The pair this enables: "member" = a person in a team; "Member" = the role.
- **"Signing key", not bare "key"**, whenever precision matters (definitions, invariants, table cells). Bare "key" is fine once the page has established context (e.g. within `/members/keys`). A **signer** is always account-relative: a signing key added to an account's signer set. Don't use "signer" for a key that isn't on an account.
- **"the Root" / "the Treasury" in prose; bare "Root" / "Treasury" in table cells.** Table cells carry no leading articles and no explanations; explanations live in surrounding prose.
- **"Wallet" means an external EOA wallet** (recovery wallets, MetaMask, hardware wallets), never a Splits account.
- **Em dashes: never, anywhere.** List items and definition lists use a colon separator (`` `command`: description ``); in prose, a colon, period, comma, semicolon, or parentheses replaces the em dash. The prose linter flags every em dash.
- **"Email support"** (no address) is the phrasing for manual/support-gated processes.
- **"Team" → "workspace" rename is planned** in the product. Docs keep saying "team" until the product ships the rename, then migrate in one pass (prose + `/teams/` URLs + section name).

## Voice & formatting

- **Facts in declarative present tense; procedures in second person** ("you must be an Owner", "go to…").
- **UI elements in italics**: button and control labels (*Invite member*, *Reset signers*, *Require memos*). **Settings paths with `>`**: Settings > Members. **In-page click chains with `→`**: three dots → *Verify signer*.
- **Bold** for: the term a page defines (first use), negative invariants, and scope names in command lists (**Read** scope).
- **Callouts**: `:::note` sparingly. Beta features get exactly: "This feature is in beta. Email support to enable it for your team."
- **Page titles ≤ 2 words** where possible; sidebar labels match titles.
- **No screenshots** until there's a system for generating them automatically. **No "Last updated" lines.**
- **Cut anything that can be removed without losing meaning.** No welcome fluff, no roadmap promises, no restating what a link target already says. Answer first.
- **Every sentence must be falsifiable.** If a clause tells the reader how to feel about a fact instead of stating the fact ("seamlessly", "so you can…"), cut it or replace it with the mechanism. Test: delete the clause; if only persuasion is lost, it was jargon.

## Links

- **First mention links, later mentions stay plain.** The first mention of another page's concept links to its canonical home; repeat mentions on the same page and mentions inside table cells stay plain (except a table's designated link column, e.g. "Learn more").
- **Settings deep links**: the first actionable mention of a settings surface on a page links to its app URL (e.g. `[Settings > Banks](https://app.splits.org/settings/team/banks/)`); later mentions stay plain and italic.
- **Link text names the target**: use the target page or section's own name where natural ("see [Editing](/accounts/editing)"), not "click here" or invented labels.
- **External links only for third-party-owned facts** (Bridge jurisdictions, passkey explainers, contract source on GitHub). Don't restate third-party details we can't verify; link them.

## Programmatic access

- Every page whose surface the CLI/MCP covers **ends** with an H2 named exactly "Programmatic access".
- It opens with exactly: `Via the [Splits CLI / MCP](/introduction/agents):`
- Commands are bullets in the form `` `splits <command> <args>` ``: description (**Scope** scope).
- If the surface has no CLI coverage and a user might expect it, say so: "X is web-only today."
- **CLI commands appear nowhere else on a page.** Body prose describes the app flow; conceptual links to `/introduction/agents` (e.g. "registered via the CLI") are fine, inline command names are not.
- Don't document the full command surface: the CLI is self-describing (`npx @splits/splits-cli@latest --llms`), and `/introduction/agents` owns setup, scopes, and headless signing.

## Adding a solution

A **solution page** (`src/pages/solutions/`) maps one use case onto the product's building blocks. It owns no product fact: each fact it states links the page that owns it, inline on the words that name the fact (never a trailing link in parentheses), and adds no detail the home lacks. Numbers (fees) and procedures (step lists, command flags) link rather than restate. This is the one written exception to "never restate", and it applies only under `src/pages/solutions/`.

Two shapes, chosen from the brief's target query and recorded here, not in frontmatter:

| | Task page | Category page |
| --- | --- | --- |
| Question the page answers | How do I make Splits do this? | Why Splits instead of what I use now? |
| Query shape | A task | A product category |
| Pages | AI agents, revenue automation | Business banking, passkey wallet |

Every solution page fills these slots in this order. Slots 1, 3, 5, 6, and 7 use these literal headings; slots 2 and 4 carry page-specific H2s. Slot 2 is optional: include it only when there is a real incumbent to compare against (revenue automation skips it).

| # | Slot | Task page | Category page |
| --- | --- | --- | --- |
| 1 | Definition paragraph, bold term first | Same | Same |
| 2 | Problem section (optional), page-specific H2, as a table | Why not the naive way (share a key, do it by hand) | Comparison against the incumbent (a crypto-friendly bank, a seed-phrase wallet) |
| 3 | `## How it works`, bold-led invariants | Same | Same |
| 4 | Procedure in `::::steps`, page-specific H2, `Prerequisites:` line first | Setting the job up | Opening the account or migrating |
| 5 | `## Limits` | What Splits does not enforce | What the incumbent has that Splits lacks |
| 6 | `## Next steps`, plain Markdown links, app link first | Same | Same |
| 7 | `## Programmatic access` | Same | Same |

- **Frontmatter is `title` and `description` only.** `title` is the search title without a ` | Splits` suffix (Vocs appends ` – Splits`); it drives `<title>`, the OG card, and the JSON-LD headline and crumb. The H1 and the sidebar label in `vocs.config.ts` stay two words: the recorded deviation from "sidebar labels match titles". The H1 subtitle is the one-line definition.
- **Calls to action are plain links**, the app link first under `## Next steps`. No `HomePage.Buttons`, no button block at the top.
- **CLI commands only under `## Programmatic access`**; steps stay prose with links. Pages other than AI agents list only their surface's commands, and say "web-only today" where there are none.
- **The index** (`src/pages/solutions/index.mdx`) is the H1 with its subtitle and a Markdown list inside `<div className="solutions-grid">`, one `[**Title**: one line](/solutions/<slug>)` item per page, the whole item the link, nothing below the grid.

- **Solutions pages are written in Simplified Technical English (ASD-STE100).** Write and revise them with the `asd-ste100` skill (`.claude/skills/asd-ste100`) in Strict mode. `pnpm lint:prose` is the gate. It runs before every build and as the `Lint prose` GitHub Action on every PR. It fails on a semicolon, a sentence over 25 words, a phrasal verb, a nominalization, or a list item that ends in "and" or "or". Passive voice, compound tenses, and synonym rotation print as advisories. The skill's rules the gate cannot check (20-word procedure sentences, one instruction per sentence, no dropped words, hedges kept) are checked in review. The frontmatter `title` is search copy and is exempt.

To add a page: create `src/pages/solutions/<slug>.mdx` on the spine, add its item to the index list, add the sidebar entry under Solutions in `vocs.config.ts`, then run the standard checks. No build check enforces the spine. `pnpm lint:prose`, `pnpm build`, and human review are the gates.
