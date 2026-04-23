# Portfolio Next.js Rebuild Design

## Goal

Rebuild the current portfolio as a real `Next.js` application instead of a static mirror, while preserving the current visual result and the user's custom changes.

This rebuild should eliminate the mirror-specific issues:

- broken or slow asset loading
- page reloads between internal navigations
- fake transitions that fight with full page reloads
- Vercel workarounds for `_next/image` and static HTML routing

The new app should feel like the current edited portfolio, but run as a proper client-routed site.

## User-Facing Requirements

- Keep the current edited identity and content, not the original Jason Zubiate version.
- Preserve the Italian copy already introduced.
- Keep the current desired layout direction:
  - `Carmine Carnevale`
  - hero with the current edited structure/content
  - menu/floating island behavior
  - no `Lab` page
  - header behavior as currently requested
- Show the loading screen only on the first hard load.
- Use a real client-side page transition for internal navigation.
- Internal page changes must not trigger a full page reload.
- Deploy cleanly to Vercel without custom mirror hacks.

## Recommended Approach

Rebuild the site as a `Next.js` App Router project inside this repository and treat the mirror as a migration source only.

This is preferred over continuing to patch the mirror because:

- the original site behavior depended on a real app/router runtime
- the mirror keeps reintroducing hydration, asset, and routing inconsistencies
- Vercel integration becomes straightforward once the site is a normal Next.js app

## Scope

### In Scope

- Create a new `Next.js` app structure in the repo.
- Rebuild the key routes:
  - `/`
  - `/work`
  - `/work/[slug]`
- Move required assets into `public/`.
- Implement shared app behavior:
  - initial loader
  - page transition
  - floating menu / island
  - responsive layout
- Port the current edited content and styling faithfully.

### Out of Scope

- Preserving the current mirror implementation as the final product
- Perfect 1:1 parity with every hidden implementation detail of the original live site
- Rebuilding removed `Lab` functionality

## Architecture

### App Structure

Use `Next.js` with the App Router:

- `app/layout.tsx`
- `app/page.tsx`
- `app/work/page.tsx`
- `app/work/[slug]/page.tsx`
- `app/globals.css`

Shared UI should live in focused components, for example:

- `components/site-loader`
- `components/page-transition`
- `components/floating-menu`
- `components/hero`
- `components/about`
- `components/work-grid`
- `components/work-detail`

### Data Model

Use local typed content objects for work items and shared page content.

Recommended shape:

- `data/site.ts`
- `data/work.ts`

This avoids scraping the mirror at runtime and makes the edited content explicit and maintainable.

## Behavior Design

### Initial Loader

The loading screen appears only on the first full page load.

Implementation direction:

- use a top-level client-side loader state in the root layout
- gate it with session state so it does not replay on internal route transitions

### Page Transition

Internal route changes should use a true app-level transition, not a full reload overlay hack.

Implementation direction:

- client component in layout listens to pathname changes
- animate exiting content and entering content around route changes
- keep transitions consistent across home, work list, and project pages

### Navigation

Navigation must use real Next.js links.

That means:

- `next/link` for internal routes
- no `.html` navigation targets
- no manual remapping from `/work` to `work.html`

### Assets

Assets should be served normally from `public/`.

Rules:

- videos live under `public/videos`
- images live under `public/images`
- social icons, posters, and visual assets should use stable file paths
- no mirrored `_next/image?...` files in the final architecture

## Migration Strategy

### Phase 1: Foundation

- scaffold Next.js app structure
- establish fonts, globals, tokens, and layout shell
- implement loader and transition framework
- implement floating island/menu

### Phase 2: Home

- rebuild hero
- rebuild about section
- rebuild services / stack / home sections that remain in scope
- ensure mobile behavior matches the current edited direction

### Phase 3: Work

- rebuild `/work`
- rebuild each work detail page from structured content
- remove any dependency on mirrored `_next/image` paths

### Phase 4: Cutover

- update Vercel config for the real app
- retire mirror-specific build hacks
- keep the mirror only as reference or archive if still useful

## Styling Strategy

The rebuild should preserve the current customized site feel, not revert to generic defaults.

Styling principles:

- keep the bold editorial typography and strong contrast
- preserve the current motion language
- preserve the current Italian content choices
- maintain the current mobile/desktop intent, but implement it with clean responsive code rather than CSS overrides on mirrored HTML

## Risks and Mitigations

### Risk: Rebuild drifts away from the current edited site

Mitigation:

- treat the current edited mirror as the visual/content source of truth
- port route by route
- verify each rebuilt section against the edited version before moving on

### Risk: Transition logic becomes overcomplicated

Mitigation:

- keep one shared transition system in layout
- avoid per-page transition hacks

### Risk: Asset migration is incomplete

Mitigation:

- explicitly inventory assets used by home, work list, and work detail pages
- move only referenced assets into `public/`

## Testing and Verification

Minimum verification for the rebuild:

- local app boots successfully
- internal route changes happen without full reload
- loader appears only on first hard load
- work pages load without 404s
- core media assets render on home and work pages
- mobile and desktop sanity checks on the key routes

## Success Criteria

The rebuild is successful when:

- the site visually matches the edited portfolio direction
- internal navigation is client-side
- loader runs only on first load
- page transition is real and consistent
- assets load from normal app paths without mirror fallbacks
- Vercel deploy no longer depends on static mirror rewrites and `_next/image` emulation
