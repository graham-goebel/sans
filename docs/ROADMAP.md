# Roadmap to production

sans is a working prototype with sample content. This is the plan to make it
safe and useful for real people to browse. A backend (accounts, real reviews,
community) comes later and is out of scope here.

## Phase 1: safe to share ✅

So the prototype can be shared without anyone mistaking sample content for
real advice.

- [x] "Prototype · sample content" banner on every page, controlled by
      `site.sampleContent` in `src/site.ts`
- [x] Reviews and testimonials labelled as samples
- [x] Store buttons replaced with a "coming soon" note (no dead ends)
- [x] About & disclaimer, Privacy, Terms and Photo credits pages, linked from a
      site footer on every page
- [x] A "last checked" date on every place
- [x] Crash screen (error boundary) so one broken page doesn't blank the app
- [x] Automated tests (Vitest) for search, filters and every page, run by the
      `CI` workflow on every PR and before every deploy

## Phase 2: real content

The launch blocker. See [CONTENT.md](CONTENT.md) for how to add and check it.

- [ ] Choose a launch city
- [ ] Verify 15–30 places there: visit or call, record precautions, date it
- [ ] Replace sample products with real ones you have checked (labels, certification)
- [ ] Replace sample recipes with tested ones
- [ ] Replace every photo with a correctly matched, credited one
- [ ] Remove sample reviews and testimonials (empty is fine until real ones exist)
- [ ] Set `site.sampleContent` to `false`
- [ ] Have the Privacy and Terms drafts reviewed

## Phase 3: launch polish

- [ ] Custom domain (e.g. sans.app) instead of `github.io/sans`
- [ ] Clean URLs without `#` (router switch plus a GitHub Pages 404 fallback, or move hosting)
- [ ] Social share previews (Open Graph title, description and image per page)
- [ ] Error monitoring (e.g. Sentry), hooked into `ErrorBoundary`
- [ ] Privacy-friendly analytics, if wanted (update the Privacy page first)
- [ ] Content in files or a git-based editor, so it can be changed without touching code
- [ ] Accessibility pass with a screen reader on iOS and Android

## Later: backend

Accounts, real reviews and ratings, community posts, moderation, and the
iPhone and Android apps behind the community call to action.
