// Renders one static OG card per page into public/og/<path>.webp before
// `vocs build`. X's card fetcher gives up before a cold Vercel function can
// load the takumi wasm and render, so the cards are prebuilt and served as
// static files instead of generated on request.
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'
import { ImageResponse } from '@takumi-rs/image-response/wasm'
import { OG_HEIGHT, OG_WIDTH, OgCard } from '../src/og-card'

const require = createRequire(import.meta.url)
const PAGES = 'src/pages'
const OUT = 'public/og'

const wasm = readFile(require.resolve('@takumi-rs/wasm/takumi_wasm_bg.wasm'))
// Same font vocs's Handler.og loads, so build and dev cards match.
const font = readFile(join(dirname(require.resolve('vocs/server')), 'fonts/geist.woff2'))

async function* mdxFiles(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* mdxFiles(full)
    else if (entry.name.endsWith('.mdx')) yield full
  }
}

function routePath(file: string): string {
  const path = '/' + relative(PAGES, file).replace(/\.mdx$/, '').replace(/(^|\/)index$/, '')
  return path === '' ? '/' : path.replace(/\/$/, '') || '/'
}

function frontmatterTitle(source: string): string {
  const title = source.match(/^---\n[\s\S]*?^title:\s*(.+?)\s*$[\s\S]*?^---/m)?.[1]
  if (!title) throw new Error('page has no frontmatter title')
  return title.replace(/^(['"])(.*)\1$/, '$2')
}

async function render(title: string, path: string): Promise<Buffer> {
  const response = new ImageResponse(<OgCard title={title} path={path} />, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    module: await wasm,
    fonts: [{ name: 'Inter', data: await font }],
  })
  return Buffer.from(await response.arrayBuffer())
}

let count = 0
for await (const file of mdxFiles(PAGES)) {
  const path = routePath(file)
  const title = frontmatterTitle(await readFile(file, 'utf8'))
  const out = join(OUT, path === '/' ? 'index.webp' : `${path}.webp`)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, await render(title, path))
  count++
}
console.log(`[og-images] ${count} cards written to ${OUT}`)
