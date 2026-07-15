import { Handler } from 'vocs/server'

// OG card: wavy-lines generative background seeded by page path, title in
// Geist Medium, logo + wordmark bottom-left. Tuned via scripts/og-preview.html;
// keep these values in sync with the settings JSON chosen there.
const W = 1200
const H = 630
const PAD = 80
const BG = '#131316'
const SEED_VARIANT = ':v1'

const FONT_SIZE = 88
const FONT_WEIGHT = 500
const TRACKING = '-1.5px'
const LOGO_H = 64
const WORDMARK_SIZE = 40

const LINE_STEP = 10
const LINE_AMP = 1.2
const LINE_WIDTH = 3
const NOISE_SCALE = 5.5 * 0.001
const INTENSITY = 0.75
const SCRIM_LEFT = 1
const SCRIM_TOP = 1

// --- deterministic RNG -------------------------------------------------------
function xmur3(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}
function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const seeded = (key: string) => mulberry32(xmur3(key)())

// Seeded 2D value noise with 3-octave fBm.
function makeNoise(rand: () => number) {
  const perm = [...Array(256).keys()]
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[perm[i], perm[j]] = [perm[j], perm[i]]
  }
  const p = new Uint8Array(512)
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255]
  const vals = new Float64Array(256)
  for (let i = 0; i < 256; i++) vals[i] = rand()
  const v = (ix: number, iy: number) => vals[p[(ix & 255) + p[iy & 255]]]
  const smooth = (t: number) => t * t * (3 - 2 * t)
  function noise2(x: number, y: number) {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const fx = x - ix
    const fy = y - iy
    const a = v(ix, iy)
    const b = v(ix + 1, iy)
    const c = v(ix, iy + 1)
    const d = v(ix + 1, iy + 1)
    const u = smooth(fx)
    const w = smooth(fy)
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w
  }
  return (x: number, y: number) => {
    let t = 0
    let amp = 0.5
    let f = 1
    for (let o = 0; o < 3; o++) {
      t += amp * noise2(x * f, y * f)
      amp *= 0.5
      f *= 2
    }
    return t / 0.875
  }
}

// --- background SVG: wavy lines + both scrims --------------------------------
function wavesSvg(path: string) {
  const rand = seeded(path + SEED_VARIANT)
  const noise = makeNoise(rand)
  const nRows = Math.ceil(H / LINE_STEP) + 4
  const nPts = 96
  const alpha = 0.55 * INTENSITY

  const lines: string[] = []
  for (let i = 0; i < nRows; i++) {
    const y0 = i * LINE_STEP
    const amp = i * LINE_AMP
    // Brand hue, muted: matches patternHSL(brand) in the preview.
    const h = 224 + rand() * 10
    const l = 25 + rand() * 30
    const pts: string[] = []
    for (let k = 0; k <= nPts; k++) {
      const x = (k / nPts) * W
      let y = y0
      if (k > 0 && k < nPts) {
        const n = noise(x * NOISE_SCALE, y0 * NOISE_SCALE)
        y += (n * 2 - 1) * amp
      }
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    lines.push(
      `<polyline points="${pts.join(' ')}" fill="none" stroke="hsla(${h.toFixed(1)}, 40%, ${l.toFixed(1)}%, ${alpha})" stroke-width="${LINE_WIDTH}" stroke-linejoin="round"/>`,
    )
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<linearGradient id="sl" x1="0" y1="0" x2="${W * 0.7}" y2="0" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="${BG}" stop-opacity="${SCRIM_LEFT}"/>
<stop offset="1" stop-color="${BG}" stop-opacity="0"/>
</linearGradient>
<linearGradient id="st" x1="0" y1="0" x2="0" y2="${H * 0.85}" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="${BG}" stop-opacity="${SCRIM_TOP}"/>
<stop offset="1" stop-color="${BG}" stop-opacity="0"/>
</linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="${BG}"/>
${lines.join('\n')}
<rect width="${W}" height="${H}" fill="url(#sl)"/>
<rect width="${W}" height="${H}" fill="url(#st)"/>
</svg>`
}

const LOGO_SVG = `<svg width="138" height="126" viewBox="0 0 138 126" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.9798 78.7428C36.8052 78.7428 43.9595 71.5884 43.9595 62.763C43.9595 53.9376 36.8052 46.7832 27.9798 46.7832C19.1544 46.7832 12 53.9376 12 62.763C12 71.5884 19.1544 78.7428 27.9798 78.7428Z" fill="white"/>
<path d="M71.4027 75.9231C78.6707 75.9231 84.5626 70.0313 84.5626 62.7633C84.5626 55.4954 78.6707 49.6035 71.4027 49.6035C64.1348 49.6035 58.2429 55.4954 58.2429 62.7633C58.2429 70.0313 64.1348 75.9231 71.4027 75.9231Z" fill="white"/>
<path d="M114.822 73.103C120.532 73.103 125.162 68.4737 125.162 62.7632C125.162 57.0526 120.532 52.4233 114.822 52.4233C109.111 52.4233 104.482 57.0526 104.482 62.7632C104.482 68.4737 109.111 73.103 114.822 73.103Z" fill="white"/>
<path d="M49.693 113.526C56.961 113.526 62.8529 107.634 62.8529 100.366C62.8529 93.0984 56.961 87.2065 49.693 87.2065C42.4251 87.2065 36.5332 93.0984 36.5332 100.366C36.5332 107.634 42.4251 113.526 49.693 113.526Z" fill="white"/>
<path d="M93.1123 110.706C98.8229 110.706 103.452 106.077 103.452 100.366C103.452 94.6557 98.8229 90.0264 93.1123 90.0264C87.4018 90.0264 82.7725 94.6557 82.7725 100.366C82.7725 106.077 87.4018 110.706 93.1123 110.706Z" fill="white"/>
<path d="M49.693 38.3196C56.961 38.3196 62.8529 32.4278 62.8529 25.1598C62.8529 17.8918 56.961 12 49.693 12C42.4251 12 36.5332 17.8918 36.5332 25.1598C36.5332 32.4278 42.4251 38.3196 49.693 38.3196Z" fill="white"/>
<path d="M93.1123 35.5C98.8229 35.5 103.452 30.8707 103.452 25.1602C103.452 19.4496 98.8229 14.8203 93.1123 14.8203C87.4018 14.8203 82.7725 19.4496 82.7725 25.1602C82.7725 30.8707 87.4018 35.5 93.1123 35.5Z" fill="white"/>
</svg>`

const svgUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`

export default async function handler(request: Request) {
  const url = new URL(request.url)
  const pagePath = url.searchParams.get('path') ?? '/'
  const response = await Handler.og(({ title }) => (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: BG,
        alignItems: 'center',
        fontFamily: 'Inter',
      }}
    >
      <img
        src={svgUri(wavesSvg(pagePath))}
        width={W}
        height={H}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <div
        style={{
          display: 'flex',
          marginLeft: PAD,
          maxWidth: W - PAD * 2 - 80,
          color: '#ffffff',
          fontSize: FONT_SIZE,
          fontWeight: FONT_WEIGHT,
          letterSpacing: TRACKING,
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: PAD - LOGO_H * 0.09,
          bottom: PAD,
          alignItems: 'center',
        }}
      >
        <img src={svgUri(LOGO_SVG)} width={LOGO_H * (138 / 126)} height={LOGO_H} />
        <div
          style={{
            display: 'flex',
            color: '#ffffff',
            fontSize: WORDMARK_SIZE,
            fontWeight: 600,
            letterSpacing: '-0.5px',
            marginLeft: LOGO_H * 0.18,
          }}
        >
          Splits
        </div>
      </div>
    </div>
  )).fetch(request)
  if (response.status !== 200) return response
  // Cards are deterministic per (title, path); let Vercel's edge cache serve
  // them so scrapers never wait on a cold render.
  const headers = new Headers(response.headers)
  headers.set('cache-control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000')
  return new Response(response.body, { status: response.status, headers })
}
