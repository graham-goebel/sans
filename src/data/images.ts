/**
 * Unsplash photo URLs, sized and cropped by Unsplash's image CDN.
 * `npm run check:images` confirms every photo id in src/data still resolves.
 */
export function unsplash(id: string, width = 900): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=70`
}
