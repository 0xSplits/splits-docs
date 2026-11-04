import type * as React from 'react'

import { Analytics } from '../components/Analytics'

/*
 * Root layout wrapping every page: mounts the Amplitude SDK so docs page
 * views land in the same Amplitude project as splits.org and the app.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  )
}
