import { defineConfig } from 'vocs/config'

export default defineConfig({
  title: 'Splits',
  description: 'Guides, integrations, and resources for using Splits.',
  iconUrl: {
    light: '/splits_compressed.svg',
    dark: '/splits_compressed_dark.svg',
  },
  topNav: [
    { text: 'splits.org', link: 'https://splits.org' },
    { text: 'Changelog', link: 'https://splits.org/changelog' },
  ],
  socials: [
    { icon: 'github', link: 'https://github.com/0xSplits' },
    { icon: 'x', link: 'https://x.com/0xSplits' },
  ],
  sidebar: [
    {
      text: 'Introduction',
      link: '/',
      collapsed: false,
      items: [
        { text: 'Core concepts', link: '/introduction/core-concepts' },
        { text: 'Agents', link: '/introduction/agents' },
        { text: 'Browser extension', link: '/introduction/extension' },
        { text: 'Networks & assets', link: '/introduction/networks-and-assets' },
        { text: 'Personal usage', link: '/introduction/personal-usage' },
      ],
    },
    {
      text: 'Teams',
      link: '/teams',
      collapsed: true,
      items: [
        { text: 'Members', link: '/teams/members' },
        { text: 'Permissions', link: '/teams/permissions' },
        { text: 'Settings', link: '/teams/settings' },
      ],
    },
    {
      text: 'Accounts',
      link: '/accounts',
      collapsed: true,
      items: [
        { text: 'Signers', link: '/accounts/signers' },
        { text: 'Thresholds', link: '/accounts/thresholds' },
        { text: 'Modules', link: '/accounts/modules' },
        { text: 'Recovery', link: '/accounts/recovery' },
        { text: 'Earn', link: '/accounts/earn' },
      ],
    },
    {
      text: 'Transactions',
      link: '/transactions',
      collapsed: true,
      items: [
        { text: 'Sends', link: '/transactions/sends' },
        { text: 'Swaps', link: '/transactions/swaps' },
        { text: 'Custom', link: '/transactions/custom' },
        { text: 'Batch', link: '/transactions/batch' },
        { text: 'Schedules', link: '/transactions/schedules' },
        { text: 'Memos', link: '/transactions/memos' },
      ],
    },
    {
      text: 'Accounting',
      link: '/accounting',
      collapsed: true,
      items: [
        { text: 'Spam & tokens', link: '/accounting/spam' },
      ],
    },
    {
      text: 'Invoicing',
      link: '/invoicing',
      collapsed: true,
      items: [
        { text: 'Recurring', link: '/invoicing/recurring' },
        { text: 'Paying', link: '/invoicing/paying' },
        { text: 'Tracking', link: '/invoicing/tracking' },
      ],
    },
    {
      text: 'Banking',
      link: '/banking',
      collapsed: true,
      items: [
        { text: 'Paying vendors', link: '/banking/paying-vendors' },
        { text: 'Compliance', link: '/banking/compliance' },
      ],
    },
    {
      text: 'Integrations',
      link: '/integrations',
      collapsed: true,
      items: [
        { text: 'WalletConnect', link: '/integrations/walletconnect' },
        { text: 'Farcaster', link: '/integrations/farcaster' },
        { text: 'Bankr', link: '/integrations/bankr' },
        { text: 'ENS', link: '/integrations/ens' },
        { text: 'Rain', link: '/integrations/rain' },
        { text: 'Hedgey', link: '/integrations/hedgey' },
        { text: 'Sablier', link: '/integrations/sablier' },
        { text: 'Uniswap', link: '/integrations/uniswap' },
        { text: 'Clanker', link: '/integrations/clanker' },
      ],
    },
    {
      text: 'Resources',
      collapsed: true,
      items: [
        { text: 'Our workspace setup', link: '/resources/workspace-setup' },
        { text: 'Our ops stack', link: '/resources/ops-stack' },
        { text: 'Raising capital onchain', link: '/resources/raising-capital' },
        { text: 'Incorporating', link: '/resources/incorporating' },
        { text: 'Bug bounty', link: '/resources/bug-bounty' },
        { text: 'Brand assets', link: '/resources/brand-assets' },
        { text: 'Audit reports', link: 'https://github.com/0xSplits/splits-contracts-monorepo/tree/main/audits' },
        { text: 'Technical overview', link: 'https://www.notion.so/49f2fbf6196f4a2b95513a9819736212' },
      ],
    },
  ],
})
