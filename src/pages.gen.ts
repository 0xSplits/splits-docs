// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages } from 'waku/router'

// prettier-ignore
type Page =
  | { path: '/about/mission-and-vision'; render: 'static' }
  | { path: '/about/values-and-culture'; render: 'static' }
  | { path: '/about/writing-culture'; render: 'static' }
  | { path: '/faqs/change-recovery-signers'; render: 'static' }
  | { path: '/faqs/import-existing-account'; render: 'static' }
  | { path: '/faqs/onramp-jurisdictions'; render: 'static' }
  | { path: '/faqs/passkey-not-opening'; render: 'static' }
  | { path: '/faqs/refer-friends'; render: 'static' }
  | { path: '/faqs/sponsored-fees'; render: 'static' }
  | { path: '/faqs/verify-on-farcaster'; render: 'static' }
  | { path: '/getting-started/accounting'; render: 'static' }
  | { path: '/getting-started/adding-signers'; render: 'static' }
  | { path: '/getting-started/adding-teammates-as-signers'; render: 'static' }
  | { path: '/getting-started/asset-support'; render: 'static' }
  | { path: '/getting-started/automations'; render: 'static' }
  | { path: '/getting-started/batch-transactions'; render: 'static' }
  | { path: '/getting-started/connecting-to-other-apps'; render: 'static' }
  | { path: '/getting-started/creating-a-team'; render: 'static' }
  | { path: '/getting-started/custom-transactions'; render: 'static' }
  | { path: '/getting-started/earning-interest'; render: 'static' }
  | { path: '/getting-started/invoicing'; render: 'static' }
  | { path: '/getting-started/network-support'; render: 'static' }
  | { path: '/getting-started/on-offramping'; render: 'static' }
  | { path: '/getting-started/schedules'; render: 'static' }
  | { path: '/getting-started/showing-hiding-tokens'; render: 'static' }
  | { path: '/getting-started/splits-cli'; render: 'static' }
  | { path: '/getting-started/splits-for-teams-of-one'; render: 'static' }
  | { path: '/getting-started/swapping'; render: 'static' }
  | { path: '/getting-started/the-basics'; render: 'static' }
  | { path: '/getting-started/verifying-signers'; render: 'static' }
  | { path: '/'; render: 'static' }
  | { path: '/outlook/contract-security'; render: 'static' }
  | { path: '/outlook/how-we-got-here'; render: 'static' }
  | { path: '/outlook/how-we-make-money'; render: 'static' }
  | { path: '/outlook/how-we-secure-our-assets'; render: 'static' }
  | { path: '/outlook/our-stack'; render: 'static' }
  | { path: '/outlook/who-has-control'; render: 'static' }
  | { path: '/outlook/why-recovery-matters'; render: 'static' }
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
  | { path: '/workflows/recovering-your-accounts'; render: 'static' }
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
