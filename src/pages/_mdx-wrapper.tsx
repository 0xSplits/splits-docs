'use client'

import * as React from 'react'
import { Layout, MdxPageContext, useConfig, useRouter } from 'vocs'

const SITE = 'https://splits.org'
const DOCS_URL = `${SITE}/docs/`
const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Splits',
  url: `${SITE}/`,
}

/*
 * One JSON-LD graph per page (TechArticle + BreadcrumbList): an entity signal
 * for AI answer engines, no Google rich result expected. Rendered in the body
 * rather than vocs' Head so no new vocs.patch hunk is needed; body placement
 * is valid JSON-LD. The breadcrumb section comes from the sidebar config, so
 * a new section needs no change here; a section without a link (Resources)
 * gets no section crumb, because Google requires a URL on every crumb but the
 * last.
 */
function JsonLd() {
  const { path } = useRouter()
  const { frontmatter } = MdxPageContext.use()
  const config = useConfig()

  const route = path.replace(/\/$/, '')
  const canonicalOf = (link: string) => `${DOCS_URL}${link.replace(/^\//, '')}/`
  const url = route ? canonicalOf(route) : DOCS_URL
  const title = frontmatter?.title ?? config.title

  // Array.isArray narrows a readonly array to any[]; the annotation restores the item type.
  const sections: Extract<typeof config.sidebar, readonly unknown[]> = Array.isArray(config.sidebar)
    ? config.sidebar
    : []
  const section = sections.find(
    (item) => item.link === route || item.items?.some((child) => child.link === route),
  )
  const crumbs = [
    { name: 'Docs', item: DOCS_URL },
    ...(section?.link && section.link !== route
      ? [{ name: section.text, item: canonicalOf(section.link) }]
      : []),
    { name: title, item: url },
  ]

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': url,
        headline: title,
        description: frontmatter?.description ?? config.description,
        url,
        dateModified: frontmatter?.lastModified,
        publisher: ORGANIZATION,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${DOCS_URL}#website`,
          name: 'Splits docs',
          url: DOCS_URL,
          publisher: ORGANIZATION,
        },
      },
      ...(route
        ? [
            {
              '@type': 'BreadcrumbList',
              itemListElement: crumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                ...crumb,
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <script
      type="application/ld+json"
      // `<` escaped so a title containing `</script>` cannot break out.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/*
 * Rendered at the end of every page's copy, above the prev/next links:
 * last-updated on the left (replacing the built-in line, hidden in _root.css)
 * and the support email on the right, so pages don't need to call out the
 * address in prose. Clicking the email copies it instead of opening a mail
 * app.
 */
function PageFooter() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const [copied, setCopied] = React.useState(false)
  const copyEmail = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText('support@splits.org')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('Failed to copy support email:', error)
    }
  }, [])

  const { frontmatter } = MdxPageContext.use()
  const lastModified = frontmatter?.lastModified as string | undefined

  let formatted: string | null = null
  if (mounted && lastModified) {
    const date = new Date(lastModified)
    const day = String(date.getDate()).padStart(2, '0')
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    formatted = `${day} ${month} ${date.getFullYear()}`
  }

  return (
    <div className="page-footer-row">
      <span>{formatted ? `Last updated: ${formatted}` : ''}</span>
      <button onClick={copyEmail} type="button">
        {copied ? 'Email copied' : 'support@splits.org'}
      </button>
    </div>
  )
}

export default function MdxWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <JsonLd />
      {children}
      <PageFooter />
    </Layout>
  )
}
