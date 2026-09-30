// Confirms every Unsplash photo referenced in src/ still resolves.
// Run with `npm run check:images` (needs network access to images.unsplash.com).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

const ids = new Map()
for (const file of files('src')) {
  for (const [, id] of readFileSync(file, 'utf8').matchAll(/unsplash\('([\w-]+)'/g)) {
    ids.set(id, [...(ids.get(id) ?? []), file])
  }
}

const results = await Promise.all(
  [...ids.keys()].map(async (id) => {
    const url = `https://images.unsplash.com/photo-${id}?w=64&q=10`
    try {
      const res = await fetch(url, { method: 'HEAD' })
      return { id, ok: res.ok, status: res.status }
    } catch (error) {
      return { id, ok: false, status: String(error) }
    }
  }),
)

const broken = results.filter((r) => !r.ok)
console.log(`Checked ${results.length} photos: ${results.length - broken.length} ok, ${broken.length} broken.`)
for (const { id, status } of broken) console.log(`  ✗ ${id} (${status}) in ${ids.get(id).join(', ')}`)
process.exit(broken.length > 0 ? 1 : 0)
