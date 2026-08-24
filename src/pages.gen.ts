// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages } from 'waku/router'

// prettier-ignore
type Page =
  | { path: '/_api/api/og'; render: 'static' }
  | { path: '/_mdx-wrapper'; render: 'static' }
  | { path: '/_slots'; render: 'static' }
  | { path: '/accounting'; render: 'static' }
  | { path: '/accounting/spam'; render: 'static' }
  | { path: '/accounts/earn'; render: 'static' }
  | { path: '/accounts/editing'; render: 'static' }
  | { path: '/accounts'; render: 'static' }
  | { path: '/accounts/modules'; render: 'static' }
  | { path: '/accounts/signers'; render: 'static' }
  | { path: '/accounts/thresholds'; render: 'static' }
  | { path: '/banking'; render: 'static' }
  | { path: '/banking/offramping'; render: 'static' }
  | { path: '/banking/onramping'; render: 'static' }
  | { path: '/banking/paying-vendors'; render: 'static' }
  | { path: '/contacts/compliance'; render: 'static' }
  | { path: '/contacts'; render: 'static' }
  | { path: '/experiments'; render: 'static' }
  | { path: '/experiments/pact'; render: 'static' }
  | { path: '/'; render: 'static' }
  | { path: '/integrations/bankr'; render: 'static' }
  | { path: '/integrations/clanker'; render: 'static' }
  | { path: '/integrations/ens'; render: 'static' }
  | { path: '/integrations/farcaster'; render: 'static' }
  | { path: '/integrations/hedgey'; render: 'static' }
  | { path: '/integrations'; render: 'static' }
  | { path: '/integrations/rain'; render: 'static' }
  | { path: '/integrations/sablier'; render: 'static' }
  | { path: '/integrations/uniswap'; render: 'static' }
  | { path: '/integrations/walletconnect'; render: 'static' }
  | { path: '/introduction/agents'; render: 'static' }
  | { path: '/introduction/core-concepts'; render: 'static' }
  | { path: '/introduction/extension'; render: 'static' }
  | { path: '/introduction/networks-and-assets'; render: 'static' }
  | { path: '/introduction/personal-usage'; render: 'static' }
  | { path: '/invoicing'; render: 'static' }
  | { path: '/invoicing/paying'; render: 'static' }
  | { path: '/invoicing/recurring'; render: 'static' }
  | { path: '/invoicing/tracking'; render: 'static' }
  | { path: '/members'; render: 'static' }
  | { path: '/members/keys'; render: 'static' }
  | { path: '/resources/brand-assets'; render: 'static' }
  | { path: '/resources/how-we-work'; render: 'static' }
  | { path: '/resources/incorporating-and-raising-capital'; render: 'static' }
  | { path: '/resources/security'; render: 'static' }
  | { path: '/teams'; render: 'static' }
  | { path: '/teams/recovery'; render: 'static' }
  | { path: '/teams/roles'; render: 'static' }
  | { path: '/teams/settings'; render: 'static' }
  | { path: '/transactions/batch'; render: 'static' }
  | { path: '/transactions/custom'; render: 'static' }
  | { path: '/transactions'; render: 'static' }
  | { path: '/transactions/memos'; render: 'static' }
  | { path: '/transactions/schedules'; render: 'static' }
  | { path: '/transactions/sends'; render: 'static' }
  | { path: '/transactions/swaps'; render: 'static' }

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>
  }
  interface CreatePagesConfig {
    pages: Page
  }
}
