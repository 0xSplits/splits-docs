# Simplified Technical English

Splits documentation targets **ASD-STE100 Simplified Technical English (STE), Issue 9, dated January 15, 2025**. ASD is the standards organization. STE is a controlled form of English for technical documentation. The [official standard](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) is the authority for its writing rules and general dictionary. The [official downloads page](https://asd-ste100.org/STE_downloads.html) provides access to the standard and later releases.

This policy covers all public Markdown and MDX under `src/pages`, including new pages, titles, descriptions, tables, callouts, links, and image descriptions. It also covers rendered component text. README and contributor instructions explain the process. They are not product documentation.

## Terms

An **approved general word** is a word in the standard's dictionary, used with its specified meaning, part of speech, and form. A **technical noun** names an item in the subject field. A **technical verb** names a permitted technical action. A **project term** is a technical term selected for these docs. Project registration does not approve a general word or an unrelated use of a technical term.

The [term registry](scripts/ste/terms.json) contains original project definitions, categories, usage restrictions, and links to canonical pages. It supplements the official dictionary. It is not a copy of that dictionary or an independent STE dictionary. Product names, abbreviations, and exact interface labels have separate classifications in the registry.

To introduce a term:

1. Check whether an existing term has the intended meaning.
2. Check the standard's dictionary and technical terminology categories.
3. Add an entry with its definition, category, permitted use, and canonical page. For a technical verb, specify its permitted forms.
4. Define or expand the term at first substantive use on its canonical page. Link to that page at first use elsewhere.
5. Run `pnpm glossary:generate`. Do not edit the generated [glossary](src/pages/resources/glossary.mdx) directly.
6. Request terminology review with the content change.

Ordinary synonyms do not qualify as technical terms merely to pass a check. A noun entry never permits its use as a verb. For example, the account *threshold* is a number of approvals. An API key *scope* is a permission. A *member* is a person, while *Member* names a role. An *account owner* is an onchain account, while *Owner* names a role. The registry and canonical pages keep these meanings separate.

## Writing and review

These are working instructions, not a replacement for the standard:

- Use the dictionary's permitted meanings and parts of speech (section 1). Define necessary technical terminology.
- Keep noun groups short and clear (section 2).
- Prefer active sentences and simple verb forms. Restrict verb forms ending in `-ing` to permitted technical noun uses (section 3).
- Keep one topic per sentence. Supply articles and make references unambiguous (section 4).
- Write procedures as commands, with one instruction per sentence and necessary conditions first. Keep instructions out of notes (section 5).
- Group related descriptions in paragraphs of at most six sentences (section 6).
- State the risk before the protective instruction when a warning is necessary (section 7).
- Use standard punctuation without semicolons. Apply the standard's counting conventions (section 8).
- Review both meaning and technical correctness (section 9).

The standard permits 20 words per procedural sentence and 25 per descriptive sentence. **This repository uses a stricter limit of 20 for all checked sentences.** This avoids uncertain automatic classification of procedures. Technical identifiers, labels, proper names, measurements, and parenthetical text have special counting treatment. The checker uses conservative approximations. A reviewer must still check unusually structured sentences and parenthetical text.

Preserve literal commands, flags, addresses, and interface labels. Rewrite their explanations. A code span is for executable or literal technical text, not a way to hide prose from checks. Keep content literal in MDX. Computed prose fails the check because the checker cannot inspect its rendered value.

## Local checks

```sh
pnpm install --frozen-lockfile
pnpm glossary:generate             # after a term change
pnpm check:docs                    # all public prose and glossary consistency
node scripts/check-prose.mjs src/pages/accounts  # optional focused check
pnpm test:prose                    # checker and review-gate regression tests
pnpm build                        # all checks, then production and link validation
```

Findings fail the command. There is no warning-only mode, baseline of ignored pages, or inline suppression mechanism. New `.md` and `.mdx` files enter the scan automatically. The build uses the same checks as CI. A term change also invalidates an outdated generated glossary.

The checker parses Markdown and MDX. It checks sentence and paragraph limits, selected vocabulary and term variants, contractions, semicolons, em dashes, and common verb problems. It reads prose in metadata, table cells, callouts, link labels, and image descriptions. It excludes code, imports, link destinations, and non-prose component attributes.

**A passing check is not proof of ASD-STE100 compliance.** The checker does not contain the full general dictionary. It cannot reliably determine every part of speech, approved meaning, passive construction, instruction boundary, or factual claim. The [standard's guidance on software](https://asd-ste100.org/STEsoftware.html) explains the role and limits of checkers.

## Editorial approval

A maintainer who understands Issue 9 must review each pull request against the official standard, including text generated by an agent. This review is separate from the author's rewrite and the automated check.

The reviewer must check:

- General vocabulary, approved meanings, parts of speech, and technical term eligibility.
- One instruction per sentence, conditions before actions, and informational notes.
- Active voice, permitted verb forms, clear noun groups, and unambiguous references.
- Preservation of product behavior, limitations, exact commands, UI labels, and URLs.
- The rendered page and its `.md` twin, including tables, definitions, and warnings.

After completing this review, the maintainer must **approve the current commit** and include this line in the review body:

```text
STE review complete
```

The `STE editorial review` workflow requires this statement from a human with write, maintain, or admin permission. It rejects the author's own approval, bot approvals, old commit approvals, dismissed reviews, and later requests for changes. A comment alone is not approval. A new commit requires a new approval. The workflow reads GitHub metadata and does not run pull request code.

Do not approve language that you cannot verify against the standard. Identify the unresolved wording and obtain a qualified review. An automated rewrite must not label itself certified or fully compliant.

## Repository enforcement

After these workflows reach `main`, a repository administrator must update the existing **Default branch protection** ruleset:

1. Require the `Docs checks` and `STE editorial review` status checks.
2. Require one pull request approval and dismiss approvals after new commits.
3. Require approval after the latest push and resolution of review threads.
4. Keep force pushes, branch deletion, and direct changes to `main` restricted. Do not grant routine bypasses.

The existing ruleset requires pull requests but currently requires zero approvals and no status checks. Workflow files alone cannot change those remote settings. Activate the checks after the initial merge so subsequent pull requests inherit both workflows. This rollout order avoids blocking other open pull requests that do not yet contain the new workflows. The review status can be required on pull requests. If a merge queue is introduced, add a queue-aware editorial check before requiring that status on merge groups.

When ASD publishes a new issue, review its changes before updating this policy. Change the registry, checker, tests, and affected pages together. Do not silently change the target issue.
