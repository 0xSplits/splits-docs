import { defineConfig } from 'vocs/config'

export default defineConfig({
  title: 'Splits',
  description: 'Guides, integrations, and resources for using Splits.',
  accentColor: 'light-dark(#2143FA, #5B78FF)',
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
        { text: 'Networks & assets', link: '/introduction/networks-and-assets' },
        { text: 'Browser extension', link: '/introduction/extension' },
        { text: 'Agents', link: '/introduction/agents' },
        { text: 'Personal usage', link: '/introduction/personal-usage' },
      ],
    },
    {
      text: 'Teams',
      link: '/teams',
      collapsed: true,
      items: [
        { text: 'Roles', link: '/teams/roles' },
        { text: 'Recovery', link: '/teams/recovery' },
        { text: 'Settings', link: '/teams/settings' },
      ],
    },
    {
      text: 'Members',
      link: '/members',
      collapsed: true,
      items: [
        { text: 'Signing keys', link: '/members/keys' },
      ],
    },
    {
      text: 'Accounts',
      link: '/accounts',
      collapsed: true,
      items: [
        { text: 'Signers', link: '/accounts/signers' },
        { text: 'Thresholds', link: '/accounts/thresholds' },
        { text: 'Editing', link: '/accounts/editing' },
        { text: 'Modules', link: '/accounts/modules' },
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
        { text: 'Batch', link: '/transactions/batch' },
        { text: 'Schedules', link: '/transactions/schedules' },
        { text: 'Custom', link: '/transactions/custom' },
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
      text: 'Contacts',
      link: '/contacts',
      collapsed: true,
      items: [
        { text: 'Compliance', link: '/contacts/compliance' },
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
        { text: 'Onramping', link: '/banking/onramping' },
        { text: 'Offramping', link: '/banking/offramping' },
        { text: 'Paying vendors', link: '/banking/paying-vendors' },
      ],
    },
    {
      text: 'Integrations',
      link: '/integrations',
      collapsed: true,
      items: [
        { text: 'Bankr', link: '/integrations/bankr' },
        { text: 'Clanker', link: '/integrations/clanker' },
        { text: 'ENS', link: '/integrations/ens' },
        { text: 'Farcaster', link: '/integrations/farcaster' },
        { text: 'Hedgey', link: '/integrations/hedgey' },
        { text: 'Rain', link: '/integrations/rain' },
        { text: 'Sablier', link: '/integrations/sablier' },
        { text: 'Uniswap', link: '/integrations/uniswap' },
        { text: 'WalletConnect', link: '/integrations/walletconnect' },
      ],
    },
    {
      text: 'Resources',
      collapsed: true,
      items: [
        { text: 'How we work', link: '/resources/how-we-work' },
        { text: 'Incorporating & raising capital', link: '/resources/incorporating-and-raising-capital' },
        { text: 'Security & bug bounty', link: '/resources/security' },
        { text: 'Brand assets', link: '/resources/brand-assets' },
      ],
    },
  ],
})
