// Screenshots the same pages from two builds of the app and diffs them.
//
//   node scripts/visual-diff.mjs <base-url> <head-url> <out-dir> [--strict]
//
// Photos are replaced with flat colours and motion is reduced, so the only
// differences are real ones: layout, type, colour, components. Writes a
// Markdown summary (also to the GitHub job summary) and a diff image per
// changed page. With --strict, any change fails the run.
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const [baseUrl, headUrl, outDir, ...flags] = process.argv.slice(2)
if (!baseUrl || !headUrl || !outDir) {
  console.error('Usage: node scripts/visual-diff.mjs <base-url> <head-url> <out-dir> [--strict]')
  process.exit(2)
}
const strict = flags.includes('--strict')

const pages = [
  { name: 'home', path: '/' },
  { name: 'recipes', path: '/recipes' },
  { name: 'products', path: '/products' },
  { name: 'places', path: '/places' },
  { name: 'recipe', path: '/recipes/margherita-pizza' },
  { name: 'product', path: '/products/bronze-cut-rigatoni' },
  { name: 'place', path: '/places/osteria-lume' },
  { name: 'about', path: '/about' },
  { name: 'search', path: '/', search: 'pizza' },
]

const viewports = [
  { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'desktop', width: 1280, height: 900 },
]

// A share of changed pixels below this counts as noise (anti-aliasing).
const NOISE = 0.0005

const colors = ['#b9a37e', '#8a9a5b', '#c47a55', '#d8c3a5', '#6f7d4c', '#a8674b', '#e2d4bb', '#7b6a55']
const photo = (url) => {
  const id = url.match(/photo-([\w-]+)/)?.[1] ?? url
  const c = colors[[...id].reduce((a, ch) => a + ch.charCodeAt(0), 0) % colors.length]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="${c}"/></svg>`
}

async function capture(browser, url, viewport, page) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile,
    hasTouch: viewport.hasTouch,
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  })
  const tab = await context.newPage()
  await tab.route(/images\.unsplash\.com/, (route) =>
    route.fulfill({ contentType: 'image/svg+xml', body: photo(route.request().url()) }),
  )
  await tab.goto(`${url}/#${page.path}`, { waitUntil: 'networkidle' })
  await tab.evaluate(() => document.fonts.ready)
  if (page.search) {
    await tab.getByRole('button', { name: 'Search' }).click()
    await tab.locator('#search-field').fill(page.search)
  }
  await tab.waitForTimeout(800)
  const shot = await tab.screenshot({ fullPage: !page.search })
  await context.close()
  return PNG.sync.read(shot)
}

/** Pads an image with white to a size, so pages of different heights can still be compared. */
function pad(png, width, height) {
  if (png.width === width && png.height === height) return png
  const out = new PNG({ width, height })
  out.data.fill(255)
  PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0)
  return out
}

mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
)

const results = []
for (const viewport of viewports) {
  for (const page of pages) {
    const key = `${viewport.name}-${page.name}`
    try {
      const [before, after] = await Promise.all([
        capture(browser, baseUrl, viewport, page),
        capture(browser, headUrl, viewport, page),
      ])
      const width = Math.max(before.width, after.width)
      const height = Math.max(before.height, after.height)
      const a = pad(before, width, height)
      const b = pad(after, width, height)
      const diff = new PNG({ width, height })
      const changed = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 })
      const share = changed / (width * height)
      const resized = before.height !== after.height || before.width !== after.width
      const isChange = share > NOISE || resized
      if (isChange) {
        writeFileSync(join(outDir, `${key}-before.png`), PNG.sync.write(a))
        writeFileSync(join(outDir, `${key}-after.png`), PNG.sync.write(b))
        writeFileSync(join(outDir, `${key}-diff.png`), PNG.sync.write(diff))
      }
      results.push({ key, share, resized, isChange, heights: [before.height, after.height] })
    } catch (error) {
      // A page that exists on one side only (a new route, say) is a change, not a crash.
      results.push({ key, share: 1, resized: false, isChange: true, error: String(error.message ?? error) })
    }
  }
}
await browser.close()

const changedPages = results.filter((r) => r.isChange)
const lines = [
  '## Visual check',
  '',
  changedPages.length === 0
    ? `No visual changes across ${results.length} screenshots.`
    : `${changedPages.length} of ${results.length} screenshots changed. Before, after and diff images are in the \`visual-diff\` artifact.`,
  '',
  '| Screen | Changed pixels | Note |',
  '| --- | ---: | --- |',
  ...results.map(
    (r) =>
      `| ${r.key} | ${r.error ? '—' : `${(r.share * 100).toFixed(2)}%`} | ${
        r.error ? `couldn’t capture: ${r.error.split('\n')[0]}` : r.resized ? `height ${r.heights[0]} → ${r.heights[1]}px` : r.isChange ? 'changed' : ''
      } |`,
  ),
]
if (strict && changedPages.length > 0) {
  lines.push('', '**Strict mode:** this PR should not change how the app looks, so any change fails the check.')
}
const summary = lines.join('\n') + '\n'
writeFileSync(join(outDir, 'summary.md'), summary)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
console.log(summary)

process.exit(strict && changedPages.length > 0 ? 1 : 0)
