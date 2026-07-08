import { defineConfig } from 'vocs/config'

export default defineConfig({
  title: 'Splits',
  description: 'Guides, workflows, and FAQs for using Splits.',
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
      ],
    },
    {
      text: 'Workflows',
      collapsed: true,
      items: [
        { text: 'Using Splits to escrow an OTC deal', link: '/workflows/escrow-an-otc-deal' },
        { text: 'Use an ENS name with Splits', link: '/workflows/use-an-ens-name' },
        { text: 'Incorporating and banking in the US', link: '/workflows/incorporating-and-banking-in-the-us' },
        { text: 'Receiving investor funding onchain', link: '/workflows/receiving-investor-funding-onchain' },
        { text: 'Viewing and claiming vesting tokens', link: '/workflows/viewing-and-claiming-vesting-tokens' },
        { text: 'Viewing and claiming liquidity position (LP) rewards', link: '/workflows/viewing-and-claiming-lp-rewards' },
        { text: 'Using Splits with splitter contracts', link: '/workflows/using-splits-with-splitter-contracts' },
        { text: 'Batch swapping long-tail tokens', link: '/workflows/batch-swapping-long-tail-tokens' },
        { text: 'Auto-withhold for taxes in USDC', link: '/workflows/auto-withhold-for-taxes' },
        { text: 'Automating token transfers', link: '/workflows/automating-token-transfers' },
        { text: 'Automating custom transactions', link: '/workflows/automating-custom-transactions' },
        { text: 'Transforming appcoins into working capital', link: '/workflows/transforming-appcoins-into-working-capital' },
        { text: 'Repaying loans from Clanker fees', link: '/workflows/repaying-loans-from-clanker-fees' },
        { text: 'Raising capital onchain', link: '/workflows/raising-capital-onchain' },
        { text: 'Recover assets from unsupported networks', link: '/workflows/recover-assets-from-unsupported-networks' },
        { text: 'Using corporate cards with Splits', link: '/workflows/using-corporate-cards' },
        { text: 'Manage a Farcaster account', link: '/workflows/manage-a-farcaster-account' },
        { text: 'Suggested security settings based on team size', link: '/workflows/suggested-security-settings' },
      ],
    },
    {
      text: 'FAQs',
      collapsed: true,
      items: [
        { text: 'Can I refer my friends?', link: '/faqs/refer-friends' },
        { text: 'What jurisdictions are supported for on/offramps?', link: '/faqs/onramp-jurisdictions' },
        { text: 'What transaction fees are sponsored?', link: '/faqs/sponsored-fees' },
        { text: 'How can I verify my Splits account on Farcaster?', link: '/faqs/verify-on-farcaster' },
        { text: 'Can I import an existing account?', link: '/faqs/import-existing-account' },
        { text: 'Why isn’t my passkey opening?', link: '/faqs/passkey-not-opening' },
        { text: 'Can I change Recovery signers?', link: '/faqs/change-recovery-signers' },
      ],
    },
    {
      text: 'Our outlook & usage patterns',
      collapsed: true,
      items: [
        { text: 'Our stack', link: '/outlook/our-stack' },
        { text: 'How we think about contract security', link: '/outlook/contract-security' },
        { text: 'How we secure our assets', link: '/outlook/how-we-secure-our-assets' },
        { text: 'How we make money', link: '/outlook/how-we-make-money' },
        { text: 'Why recovery matters', link: '/outlook/why-recovery-matters' },
        { text: 'How we got here', link: '/outlook/how-we-got-here' },
        { text: 'Who has control', link: '/outlook/who-has-control' },
      ],
    },
    {
      text: 'About us',
      collapsed: true,
      items: [
        { text: 'Mission & vision', link: '/about/mission-and-vision' },
        { text: 'Values & culture', link: '/about/values-and-culture' },
        { text: 'Writing culture', link: '/about/writing-culture' },
      ],
    },
    {
      text: 'Resources',
      collapsed: true,
      items: [
        { text: 'Brand assets', link: '/resources/brand-assets' },
        { text: 'Audit reports', link: 'https://github.com/0xSplits/splits-contracts-monorepo/tree/main/audits' },
        { text: 'Technical overview', link: 'https://www.notion.so/49f2fbf6196f4a2b95513a9819736212' },
      ],
    },
  ],
})
