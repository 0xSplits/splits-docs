import type * as React from 'react'

/*
 * Root layout wrapping every page: injects Vercel Web Analytics. React
 * hoists async scripts into <head>; the script itself patches pushState,
 * so client-side navigations count as pageviews. Served by Vercel on the
 * deployment domain (404s harmlessly in local dev).
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script async src="/_vercel/insights/script.js" />
      {children}
    </>
  )
}
