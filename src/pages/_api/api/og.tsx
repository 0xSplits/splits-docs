import { Handler } from 'vocs/server'

import { OgCard } from '../../../og-card'

// Live renderer for previewing card design changes in `pnpm dev`:
// /docs/api/og?title=<title>&path=<page path>. Production pages point at the
// static images built by scripts/og-images.tsx.
export default async function handler(request: Request) {
  const path = new URL(request.url).searchParams.get('path') ?? '/'
  return Handler.og(({ title }) => <OgCard title={title} path={path} />).fetch(request)
}
