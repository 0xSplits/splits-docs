'use client'

import * as amplitude from '@amplitude/analytics-browser'
import { useEffect } from 'react'

// Waku inlines WAKU_PUBLIC_* variables into the client bundle at build time. Empty turns the SDK off.
const AMPLITUDE_API_KEY = import.meta.env.WAKU_PUBLIC_AMPLITUDE_API_KEY

// Same key as splits.org: the docs share its origin, so one landing identify covers both. The attribution plugin records no landing page.
const INITIAL_LANDING_PAGE_RECORDED_KEY = 'splitsInitialLandingPageRecorded'

let isInitialized = false

const recordInitialLandingPage = () => {
  try {
    if (localStorage.getItem(INITIAL_LANDING_PAGE_RECORDED_KEY)) return
    localStorage.setItem(INITIAL_LANDING_PAGE_RECORDED_KEY, 'true')
  } catch {
    // Blocked storage must not stop tracking. setOnce is idempotent on the server, so sending it on every load only costs an event.
  }
  amplitude.identify(
    new amplitude.Identify().setOnce(
      'initialLandingPage',
      location.host + location.pathname,
    ),
  )
}

const initAnalytics = () => {
  if (!AMPLITUDE_API_KEY || isInitialized) return
  isInitialized = true

  amplitude.init(AMPLITUDE_API_KEY, {
    autocapture: {
      pageViews: true,
      sessions: true,
      attribution: true,
      elementInteractions: false,
      formInteractions: false,
      fileDownloads: false,
    },
  })
  recordInitialLandingPage()
}

/*
 * Starts the Amplitude browser SDK once per page load. The root layout renders
 * it, so every docs page view lands in the same Amplitude project as
 * splits.org and the app, under the device id their shared cookie carries.
 */
export function Analytics() {
  useEffect(initAnalytics, [])
  return null
}
