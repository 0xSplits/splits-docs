import { Handler } from 'vocs/server'

// OG card: wavy-lines generative background seeded by page path, title in
// Geist Medium, logo + wordmark top-left. Tuned via scripts/og-preview.html;
// keep these values in sync with the settings JSON chosen there.
const W = 1200
const H = 630
const PAD = 80
const BG = '#131316'
const SEED_VARIANT = ':v1'

const FONT_SIZE = 88
const FONT_WEIGHT = 500
const TRACKING = '-1.5px'
const EYEBROW_SIZE = 36
const EYEBROW_OPACITY = 0.55
const LOGO_H = 35
const WORDMARK_SIZE = 32

const LINE_STEP = 10
const LINE_AMP = 1.2
const LINE_WIDTH = 3
const NOISE_SCALE = 5.5 * 0.001
const INTENSITY = 0.8
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
    const l = 30 + rand() * 40
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

// Takumi renders SVG <img> sources at intrinsic size, ignoring width/height
// props on the element, so the size lives in the SVG's own attributes.
// Full brand mark (0xSplits/brand logos/splits_dark.svg); the viewBox is
// cropped to the artwork bounds so LOGO_H is the mark's visual height.
const LOGO_W = Math.round(LOGO_H * (200 / 176.73))
const LOGO_SVG = `<svg width="${LOGO_W}" height="${LOGO_H}" viewBox="28 40 200 176.73" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M46.7997 147.166C57.1825 147.166 65.5995 138.749 65.5995 128.367C65.5995 117.984 57.1825 109.567 46.7997 109.567C36.4169 109.567 28 117.984 28 128.367C28 138.749 36.4169 147.166 46.7997 147.166Z" fill="white"/>
<path d="M90.2188 144.346C99.0442 144.346 106.199 137.192 106.199 128.366C106.199 119.541 99.0442 112.386 90.2188 112.386C81.3934 112.386 74.239 119.541 74.239 128.366C74.239 137.192 81.3934 144.346 90.2188 144.346Z" fill="white"/>
<path d="M133.642 141.526C140.91 141.526 146.802 135.634 146.802 128.366C146.802 121.098 140.91 115.207 133.642 115.207C126.374 115.207 120.482 121.098 120.482 128.366C120.482 135.634 126.374 141.526 133.642 141.526Z" fill="white"/>
<path d="M177.061 138.706C182.772 138.706 187.401 134.077 187.401 128.366C187.401 122.656 182.772 118.027 177.061 118.027C171.35 118.027 166.721 122.656 166.721 128.366C166.721 134.077 171.35 138.706 177.061 138.706Z" fill="white"/>
<path d="M220.48 135.886C224.633 135.886 228 132.519 228 128.366C228 124.213 224.633 120.846 220.48 120.846C216.327 120.846 212.96 124.213 212.96 128.366C212.96 132.519 216.327 135.886 220.48 135.886Z" fill="white"/>
<path d="M68.5093 181.949C77.3347 181.949 84.4891 174.795 84.4891 165.97C84.4891 157.144 77.3347 149.99 68.5093 149.99C59.6839 149.99 52.5295 157.144 52.5295 165.97C52.5295 174.795 59.6839 181.949 68.5093 181.949Z" fill="white"/>
<path d="M111.932 179.129C119.2 179.129 125.092 173.237 125.092 165.969C125.092 158.701 119.2 152.81 111.932 152.81C104.664 152.81 98.7725 158.701 98.7725 165.969C98.7725 173.237 104.664 179.129 111.932 179.129Z" fill="white"/>
<path d="M155.351 176.309C161.062 176.309 165.691 171.68 165.691 165.969C165.691 160.259 161.062 155.629 155.351 155.629C149.641 155.629 145.011 160.259 145.011 165.969C145.011 171.68 149.641 176.309 155.351 176.309Z" fill="white"/>
<path d="M198.771 173.49C202.924 173.49 206.291 170.123 206.291 165.97C206.291 161.816 202.924 158.45 198.771 158.45C194.617 158.45 191.251 161.816 191.251 165.97C191.251 170.123 194.617 173.49 198.771 173.49Z" fill="white"/>
<path d="M90.2189 216.729C97.4869 216.729 103.379 210.837 103.379 203.569C103.379 196.301 97.4869 190.409 90.2189 190.409C82.9509 190.409 77.0591 196.301 77.0591 203.569C77.0591 210.837 82.9509 216.729 90.2189 216.729Z" fill="white"/>
<path d="M133.642 213.909C139.352 213.909 143.982 209.28 143.982 203.569C143.982 197.859 139.352 193.229 133.642 193.229C127.931 193.229 123.302 197.859 123.302 203.569C123.302 209.28 127.931 213.909 133.642 213.909Z" fill="white"/>
<path d="M177.061 211.089C181.214 211.089 184.581 207.722 184.581 203.569C184.581 199.416 181.214 196.049 177.061 196.049C172.908 196.049 169.541 199.416 169.541 203.569C169.541 207.722 172.908 211.089 177.061 211.089Z" fill="white"/>
<path d="M68.5093 106.743C77.3347 106.743 84.4891 99.5884 84.4891 90.763C84.4891 81.9376 77.3347 74.7832 68.5093 74.7832C59.6839 74.7832 52.5295 81.9376 52.5295 90.763C52.5295 99.5884 59.6839 106.743 68.5093 106.743Z" fill="white"/>
<path d="M111.932 103.923C119.2 103.923 125.092 98.0308 125.092 90.7628C125.092 83.4949 119.2 77.603 111.932 77.603C104.664 77.603 98.7725 83.4949 98.7725 90.7628C98.7725 98.0308 104.664 103.923 111.932 103.923Z" fill="white"/>
<path d="M155.351 101.103C161.062 101.103 165.691 96.4737 165.691 90.7632C165.691 85.0526 161.062 80.4233 155.351 80.4233C149.641 80.4233 145.011 85.0526 145.011 90.7632C145.011 96.4737 149.641 101.103 155.351 101.103Z" fill="white"/>
<path d="M198.771 98.2827C202.924 98.2827 206.291 94.9159 206.291 90.7628C206.291 86.6097 202.924 83.2429 198.771 83.2429C194.617 83.2429 191.251 86.6097 191.251 90.7628C191.251 94.9159 194.617 98.2827 198.771 98.2827Z" fill="white"/>
<path d="M90.2189 66.3196C97.4869 66.3196 103.379 60.4278 103.379 53.1598C103.379 45.8919 97.4869 40 90.2189 40C82.9509 40 77.0591 45.8919 77.0591 53.1598C77.0591 60.4278 82.9509 66.3196 90.2189 66.3196Z" fill="white"/>
<path d="M133.642 63.4995C139.352 63.4995 143.982 58.8702 143.982 53.1597C143.982 47.4491 139.352 42.8198 133.642 42.8198C127.931 42.8198 123.302 47.4491 123.302 53.1597C123.302 58.8702 127.931 63.4995 133.642 63.4995Z" fill="white"/>
<path d="M177.061 60.6797C181.214 60.6797 184.581 57.3129 184.581 53.1598C184.581 49.0067 181.214 45.6399 177.061 45.6399C172.908 45.6399 169.541 49.0067 169.541 53.1598C169.541 57.3129 172.908 60.6797 177.061 60.6797Z" fill="white"/>
</svg>`

const svgUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`

// Section eyebrow shown above the title for pages nested inside a section
// (e.g. /accounts/signers → "Accounts"). Sidebar section labels in
// vocs.config.ts are the title-cased slugs, so derive the label from the path
// instead of duplicating the sidebar here.
function sectionLabel(path: string): string | undefined {
  const segments = path.split('/').filter(Boolean)
  if (segments.length < 2) return undefined
  return segments[0]
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function handler(request: Request) {
  const url = new URL(request.url)
  const pagePath = url.searchParams.get('path') ?? '/'
  const section = sectionLabel(pagePath)
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
          flexDirection: 'column',
          position: 'absolute',
          left: PAD,
          bottom: PAD,
          maxWidth: W - PAD * 2 - 80,
        }}
      >
        {section && (
          <div
            style={{
              display: 'flex',
              color: '#ffffff',
              opacity: EYEBROW_OPACITY,
              fontSize: EYEBROW_SIZE,
              fontWeight: FONT_WEIGHT,
              letterSpacing: '-0.25px',
              marginBottom: 12,
            }}
          >
            {section}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            color: '#ffffff',
            fontSize: FONT_SIZE,
            fontWeight: FONT_WEIGHT,
            letterSpacing: TRACKING,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: PAD,
          top: PAD,
          alignItems: 'center',
        }}
      >
        <img src={svgUri(LOGO_SVG)} width={LOGO_W} height={LOGO_H} />
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
        <div
          style={{
            display: 'flex',
            color: '#ffffff',
            fontSize: WORDMARK_SIZE,
            fontWeight: 425,
            letterSpacing: '-0.5px',
            marginLeft: 11,
          }}
        >
          Docs
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
