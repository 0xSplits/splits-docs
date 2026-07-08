// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages } from 'waku/router'

// prettier-ignore
type Page =
  | { path: '/about/mission-and-vision'; render: 'static' }
  | { path: '/about/values-and-culture'; render: 'static' }
  | { path: '/about/writing-culture'; render: 'static' }
  | { path: '/accounting'; render: 'static' }
  | { path: '/accounting/spam'; render: 'static' }
  | { path: '/accounts/earn'; render: 'static' }
  | { path: '/accounts'; render: 'static' }
  | { path: '/accounts/modules'; render: 'static' }
  | { path: '/accounts/recovery'; render: 'static' }
  | { path: '/accounts/signers'; render: 'static' }
  | { path: '/accounts/thresholds'; render: 'static' }
  | { path: '/banking'; render: 'static' }
  | { path: '/banking/paying-vendors'; render: 'static' }
  | { path: '/faqs/change-recovery-signers'; render: 'static' }
  | { path: '/faqs/import-existing-account'; render: 'static' }
  | { path: '/faqs/onramp-jurisdictions'; render: 'static' }
  | { path: '/faqs/passkey-not-opening'; render: 'static' }
  | { path: '/faqs/refer-friends'; render: 'static' }
  | { path: '/faqs/sponsored-fees'; render: 'static' }
  | { path: '/faqs/verify-on-farcaster'; render: 'static' }
  | { path: '/'; render: 'static' }
  | { path: '/introduction/agents'; render: 'static' }
  | { path: '/introduction/core-concepts'; render: 'static' }
  | { path: '/introduction/extension'; render: 'static' }
  | { path: '/introduction/networks-and-assets'; render: 'static' }
  | { path: '/introduction/personal-usage'; render: 'static' }
  | { path: '/invoicing'; render: 'static' }
  | { path: '/invoicing/paying'; render: 'static' }
  | { path: '/invoicing/recurring'; render: 'static' }
  | { path: '/invoicing/tracking'; render: 'static' }
  | { path: '/outlook/contract-security'; render: 'static' }
  | { path: '/outlook/how-we-got-here'; render: 'static' }
  | { path: '/outlook/how-we-make-money'; render: 'static' }
  | { path: '/outlook/how-we-secure-our-assets'; render: 'static' }
  | { path: '/outlook/our-stack'; render: 'static' }
  | { path: '/outlook/who-has-control'; render: 'static' }
  | { path: '/outlook/why-recovery-matters'; render: 'static' }
  | { path: '/resources/brand-assets'; render: 'static' }
  | { path: '/teams'; render: 'static' }
  | { path: '/teams/members'; render: 'static' }
  | { path: '/teams/permissions'; render: 'static' }
  | { path: '/teams/settings'; render: 'static' }
  | { path: '/transactions/batch'; render: 'static' }
  | { path: '/transactions/custom'; render: 'static' }
  | { path: '/transactions'; render: 'static' }
  | { path: '/transactions/memos'; render: 'static' }
  | { path: '/transactions/schedules'; render: 'static' }
  | { path: '/transactions/sends'; render: 'static' }
  | { path: '/transactions/swaps'; render: 'static' }
  | { path: '/workflows/auto-withhold-for-taxes'; render: 'static' }
  | { path: '/workflows/automating-custom-transactions'; render: 'static' }
  | { path: '/workflows/automating-token-transfers'; render: 'static' }
  | { path: '/workflows/batch-swapping-long-tail-tokens'; render: 'static' }
  | { path: '/workflows/escrow-an-otc-deal'; render: 'static' }
  | { path: '/workflows/incorporating-and-banking-in-the-us'; render: 'static' }
  | { path: '/workflows/manage-a-farcaster-account'; render: 'static' }
  | { path: '/workflows/raising-capital-onchain'; render: 'static' }
  | { path: '/workflows/receiving-investor-funding-onchain'; render: 'static' }
  | { path: '/workflows/recover-assets-from-unsupported-networks'; render: 'static' }
  | { path: '/workflows/repaying-loans-from-clanker-fees'; render: 'static' }
  | { path: '/workflows/suggested-security-settings'; render: 'static' }
  | { path: '/workflows/transforming-appcoins-into-working-capital'; render: 'static' }
  | { path: '/workflows/use-an-ens-name'; render: 'static' }
  | { path: '/workflows/using-corporate-cards'; render: 'static' }
  | { path: '/workflows/using-splits-with-splitter-contracts'; render: 'static' }
  | { path: '/workflows/viewing-and-claiming-lp-rewards'; render: 'static' }
  | { path: '/workflows/viewing-and-claiming-vesting-tokens'; render: 'static' }

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>
  }
  interface CreatePagesConfig {
    pages: Page
  }
}
