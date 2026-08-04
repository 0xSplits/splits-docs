# Splits controlled terminology

This list controls Splits-specific words that appear in user-facing documentation. Use each term only with the part of speech and meaning shown here. The list supplements the ASD-STE100 Issue 9 dictionary. It does not replace that dictionary.

An unapproved word can be a technical noun, part of a technical noun, or an eligible technical verb. Do not use a product term as another part of speech. Add a term here before you introduce it in the docs.

## Product terms

| Term | Part of speech | Meaning and usage |
| --- | --- | --- |
| account | Technical noun | A Splits smart account that holds assets. Do not call it a wallet. |
| automation account | Technical noun | An account with a policy that processes deposits. Use the full term at first use. |
| EOA | Technical noun | An externally owned Ethereum account. Define the abbreviation at first use on each page. |
| external account | Technical noun | An address outside Splits that a team watches. It has no signing authority in Splits. |
| Member | Technical noun | The product role named Member. Capitalize it. |
| member | Technical noun | A person who belongs to a team. Lowercase it. |
| module | Technical noun | An onchain program that can execute approved calls from an account. |
| operating account | Technical noun | A general-purpose account that a team uses for transactions. |
| Owner | Technical noun | The product role named Owner. Capitalize it. |
| passkey | Technical noun | A type of signing key that is stored in a password manager. |
| proposal | Technical noun | A transaction request that waits for the required approvals. |
| recovery signer | Technical noun | An EOA that controls the Root at the recovery threshold. |
| Root | Technical noun | The self-owned account that recovery signers control. Write “the Root” in prose. |
| signer | Technical noun | A signing key that is in one account's signer set. Do not use this term for all signing keys. |
| signer set | Technical noun | The signing keys that can approve transactions for one account. |
| signing key | Technical noun | A passkey or EOA that belongs to a member. Use this term instead of “key” when precision is necessary. |
| smart account | Technical noun | An account implemented by a smart contract. Use this term instead of “smart wallet.” |
| team | Technical noun | The product unit that contains members, accounts, and one set of books. |
| threshold | Technical noun | The number of signer approvals that an account requires. |
| transaction | Technical noun | An onchain action from an account. |
| Treasury | Technical noun | The primary team account. Write “the Treasury” in prose. |

## Blockchain modifiers and verbs

| Term | Part of speech | Meaning and usage |
| --- | --- | --- |
| onchain | Technical-noun modifier | Use only in a technical noun such as “onchain state.” Otherwise write “on the blockchain.” |
| offchain | Technical-noun modifier | Use only in a technical noun such as “offchain metadata.” Otherwise write “outside the blockchain.” |
| crosschain | Technical-noun modifier | Use only in a technical noun such as “crosschain transaction.” Otherwise write “between networks.” |
| bridge | Technical verb | Transfer an asset between blockchain networks. Use only for this action. |
| offramp | Technical verb | Convert a crypto asset to fiat currency and send it to a bank account. |
| onramp | Technical verb | Convert fiat currency from a bank account to a crypto asset. |
| swap | Technical verb | Exchange one token for another token. |

## Do not use

| Avoid | Use |
| --- | --- |
| bootstrap | create, set up |
| finicky | does not operate correctly, or state the observed behavior |
| flip side | result, limitation |
| flops | fails |
| folks | people, members, team members |
| misbehaves | fails, disconnects, or state the observed behavior |
| smart wallet | smart account |
| workspace | team (until the product rename ships) |

## Human review

The deterministic checker cannot validate approved meanings, active voice, noun clusters, or technical-term eligibility. For each changed page, complete the human STE review in `CLAUDE.md` after the checker passes.
