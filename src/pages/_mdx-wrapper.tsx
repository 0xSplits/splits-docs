'use client'

import * as React from 'react'
import { Layout, MdxPageContext } from 'vocs'

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
      {children}
      <PageFooter />
    </Layout>
  )
}
