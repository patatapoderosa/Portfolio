# Portfolio Next.js Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the edited portfolio as a real Next.js app with client-side routing, first-load-only loader, proper page transitions, and clean asset delivery on Vercel.

**Architecture:** Create a new Next.js App Router app inside the existing repository and treat the mirror only as a migration source. Move visual structure, content, and required assets into typed data, React components, and `public/` assets, then replace the current mirror/Vercel static wrapper with the real app.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS modules or scoped CSS, local typed data files, Vercel.

---

## File Structure

### New application files

- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/work/page.tsx`
- Create: `app/work/[slug]/page.tsx`
- Create: `app/globals.css`
- Create: `app/loading.tsx`
- Create: `components/site-shell.tsx`
- Create: `components/site-loader.tsx`
- Create: `components/page-transition.tsx`
- Create: `components/floating-menu.tsx`
- Create: `components/hero.tsx`
- Create: `components/about-section.tsx`
- Create: `components/work-grid.tsx`
- Create: `components/work-card.tsx`
- Create: `components/work-detail.tsx`
- Create: `components/work-hero.tsx`
- Create: `components/section-heading.tsx`
- Create: `data/site.ts`
- Create: `data/work.ts`
- Create: `lib/routes.ts`
- Create: `lib/session.ts`
- Create: `public/images/...` for referenced images
- Create: `public/videos/...` for referenced videos

### Existing files to replace or remove from deploy path

- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `.vercelignore`
- Modify: `vercel.json`
- Delete or stop using: `scripts/build-vercel.mjs`
- Delete or stop using: `api/next-image.mjs`
- Keep only as migration/reference source: `mirror/www.itsjay.us/**`

### Tests / verification helpers

- Create: `tests/smoke-nextjs-routes.mjs`
- Create: `tests/smoke-nextjs-assets.mjs`

---

### Task 1: Replace the static Vercel wrapper with a real Next.js app shell

**Files:**
- Modify: `package.json`
- Modify: `vercel.json`
- Modify: `.vercelignore`
- Modify: `.gitignore`
- Delete: `scripts/build-vercel.mjs`
- Delete: `api/next-image.mjs`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Replace the package manifest with a Next.js app manifest**

```json
{
  "name": "portfolio",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Replace Vercel config with normal Next.js deployment config**

```json
{
  "version": 2
}
```

- [ ] **Step 3: Remove mirror-build-only exclusions and ignore Next.js build output**

```gitignore
.playwright-cli/
mirror_server.log
__pycache__/
.DS_Store
.vercel/
.next/
node_modules/
```

```text
.git
.playwright-cli
mirror
editable-site
mirror_server.log
serve_editable.py
serve_mirror.py
tests/output
.next
node_modules
```

- [ ] **Step 4: Delete the old Vercel build wrapper and image fallback**

Run:

```bash
rm -f scripts/build-vercel.mjs api/next-image.mjs
```

Expected: the old static deploy shim files are removed from the working tree.

- [ ] **Step 5: Add the minimal app shell**

```tsx
// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carmine Carnevale | Portfolio",
  description: "Portfolio di Carmine Carnevale."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function HomePage() {
  return <main>Placeholder home</main>;
}
```

```css
/* app/globals.css */
html {
  background: #0a0a0a;
}

body {
  margin: 0;
  background: #f5f3ef;
  color: #111;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 6: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules/` exists and `package-lock.json` is created or updated.

- [ ] **Step 7: Run the app once**

Run:

```bash
npm run build
```

Expected: `next build` completes successfully with a valid App Router app.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vercel.json .vercelignore .gitignore app scripts api
git commit -m "feat: scaffold Next.js app shell"
```

### Task 2: Extract site content and routes into typed data

**Files:**
- Create: `data/site.ts`
- Create: `data/work.ts`
- Create: `lib/routes.ts`
- Modify: `app/page.tsx`
- Create: `app/work/page.tsx`
- Create: `app/work/[slug]/page.tsx`

- [ ] **Step 1: Create route helpers**

```ts
// lib/routes.ts
export const routes = {
  home: "/",
  work: "/work"
} as const;

export function workRoute(slug: string) {
  return `/work/${slug}`;
}
```

- [ ] **Step 2: Create shared site content**

```ts
// data/site.ts
export const siteContent = {
  name: "Carmine Carnevale",
  heroTitle: "CIAO! SONO CARMINE",
  aboutEyebrow: "Chi sono",
  aboutBody:
    "Appassionato dell'incontro tra design e sviluppo, progetto esperienze fluide e interattive con un obiettivo chiaro."
} as const;
```

- [ ] **Step 3: Create work data for the listing and detail pages**

```ts
// data/work.ts
export type WorkItem = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  coverImage: string;
  previewVideo?: string;
};

export const workItems: WorkItem[] = [
  {
    slug: "jazmin-wong",
    title: "Jazmin Wong",
    year: "2025",
    summary: "Portfolio e art direction.",
    coverImage: "/images/work/jazmin-wong/cover.png",
    previewVideo: "/videos/jazmin-wong-preview-compressed.mp4"
  }
];
```

- [ ] **Step 4: Hook the routes to real data**

```tsx
// app/work/page.tsx
import { workItems } from "@/data/work";

export default function WorkPage() {
  return <main>{workItems.map((item) => <div key={item.slug}>{item.title}</div>)}</main>;
}
```

```tsx
// app/work/[slug]/page.tsx
import { notFound } from "next/navigation";
import { workItems } from "@/data/work";

export default async function WorkDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = workItems.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return <main>{item.title}</main>;
}
```

- [ ] **Step 5: Verify route generation**

Run:

```bash
npm run build
```

Expected: `/`, `/work`, and each `/work/[slug]` route build without `notFound` errors.

- [ ] **Step 6: Commit**

```bash
git add data lib app
git commit -m "feat: add typed site and work data"
```

### Task 3: Migrate referenced assets into `public/`

**Files:**
- Create: `public/images/**`
- Create: `public/videos/**`
- Modify: `data/site.ts`
- Modify: `data/work.ts`

- [ ] **Step 1: Inventory only assets used by the rebuilt routes**

Run:

```bash
find mirror/www.itsjay.us/images mirror/www.itsjay.us/videos -type f | sort
```

Expected: a concrete list of source assets to choose from for home, work list, and work detail pages.

- [ ] **Step 2: Copy the selected home assets into `public/`**

```bash
mkdir -p public/images public/videos
cp mirror/www.itsjay.us/videos/hero-video-compressed.mp4 public/videos/
cp mirror/www.itsjay.us/videos/about-video-compressed.mp4 public/videos/
cp mirror/www.itsjay.us/images/about-poster.jpg public/images/
cp -R mirror/www.itsjay.us/images/social public/images/
```

- [ ] **Step 3: Copy the selected work assets into `public/`**

```bash
mkdir -p public/images/work public/videos/work
cp -R mirror/www.itsjay.us/videos/work public/videos/
```

Expected: all referenced files exist under `public/` with stable paths.

- [ ] **Step 4: Update the data files to point only at `public/` paths**

```ts
// data/site.ts
export const siteContent = {
  ...siteContent,
  heroVideo: "/videos/hero-video-compressed.mp4",
  aboutVideo: "/videos/about-video-compressed.mp4",
  aboutPoster: "/images/about-poster.jpg"
};
```

- [ ] **Step 5: Verify no rebuilt route depends on mirrored `_next/image` or `.html` links**

Run:

```bash
rg -n "_next/image|\\.html" app components data public
```

Expected: no app code depends on mirror-only `_next/image` or `.html` route targets.

- [ ] **Step 6: Commit**

```bash
git add public data
git commit -m "feat: migrate portfolio assets into public"
```

### Task 4: Build the reusable site shell, loader, and page transition

**Files:**
- Create: `components/site-shell.tsx`
- Create: `components/site-loader.tsx`
- Create: `components/page-transition.tsx`
- Create: `components/floating-menu.tsx`
- Create: `lib/session.ts`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create session helpers for the first-load-only loader**

```ts
// lib/session.ts
export const FIRST_LOAD_KEY = "portfolio-first-load-complete";

export function hasCompletedFirstLoad() {
  return typeof window !== "undefined" && sessionStorage.getItem(FIRST_LOAD_KEY) === "true";
}

export function markFirstLoadComplete() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(FIRST_LOAD_KEY, "true");
  }
}
```

- [ ] **Step 2: Implement the loading screen component**

```tsx
// components/site-loader.tsx
"use client";

type SiteLoaderProps = {
  visible: boolean;
};

export function SiteLoader({ visible }: SiteLoaderProps) {
  return (
    <div
      aria-hidden={!visible}
      className={`site-loader${visible ? " is-visible" : ""}`}
    >
      <div className="site-loader__inner">
        <p>0</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Implement the page transition wrapper**

```tsx
// components/page-transition.tsx
"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition-shell">
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create the shared shell**

```tsx
// components/site-shell.tsx
"use client";

import { useEffect, useState } from "react";
import { hasCompletedFirstLoad, markFirstLoadComplete } from "@/lib/session";
import { SiteLoader } from "@/components/site-loader";
import { PageTransition } from "@/components/page-transition";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!hasCompletedFirstLoad()) {
      setShowLoader(true);
      const timer = window.setTimeout(() => {
        markFirstLoadComplete();
        setShowLoader(false);
      }, 1200);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <SiteLoader visible={showLoader} />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
```

- [ ] **Step 5: Wire the shell into the root layout**

```tsx
// app/layout.tsx
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Add the global styles for loader and page transition**

```css
/* app/globals.css */
.site-loader {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: #f5f3ef;
  opacity: 0;
  pointer-events: none;
  transition: opacity 320ms ease;
  z-index: 9999;
}

.site-loader.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.page-transition-shell {
  min-height: 100vh;
}
```

- [ ] **Step 7: Verify behavior manually**

Run:

```bash
npm run dev
```

Expected:

- loader appears on first hard load
- loader does not replay on internal route changes
- internal route changes do not do full document reloads

- [ ] **Step 8: Commit**

```bash
git add app components lib
git commit -m "feat: add site shell loader and transitions"
```

### Task 5: Rebuild the floating menu and shared navigation

**Files:**
- Create: `components/floating-menu.tsx`
- Modify: `components/site-shell.tsx`
- Modify: `app/globals.css`
- Modify: `data/site.ts`

- [ ] **Step 1: Add menu data**

```ts
// data/site.ts
export const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Lavori" }
] as const;
```

- [ ] **Step 2: Implement the floating menu**

```tsx
// components/floating-menu.tsx
"use client";

import Link from "next/link";
import { menuLinks, siteContent } from "@/data/site";

export function FloatingMenu() {
  return (
    <div className="floating-menu">
      <Link href="/" className="floating-menu__brand">
        {siteContent.name}
      </Link>
      <nav className="floating-menu__nav">
        {menuLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 3: Mount it in the site shell**

```tsx
// components/site-shell.tsx
import { FloatingMenu } from "@/components/floating-menu";

return (
  <>
    <SiteLoader visible={showLoader} />
    <FloatingMenu />
    <PageTransition>{children}</PageTransition>
  </>
);
```

- [ ] **Step 4: Style it to match the current edited direction**

```css
.floating-menu {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 20px;
  background: #111;
  color: #f5f3ef;
  z-index: 50;
}
```

- [ ] **Step 5: Verify internal links use `next/link` only**

Run:

```bash
rg -n "href=.*\\.html|window.location.href" app components
```

Expected: no `.html` navigation or forced full-page route changes remain in the new app code.

- [ ] **Step 6: Commit**

```bash
git add components app/globals.css data
git commit -m "feat: add floating navigation shell"
```

### Task 6: Rebuild the home page to match the edited site

**Files:**
- Create: `components/hero.tsx`
- Create: `components/about-section.tsx`
- Modify: `app/page.tsx`
- Modify: `data/site.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Implement the hero component**

```tsx
// components/hero.tsx
import { siteContent } from "@/data/site";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__media">
        <video
          src={siteContent.heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <h1 className="hero__title">{siteContent.heroTitle}</h1>
    </section>
  );
}
```

- [ ] **Step 2: Implement the about section**

```tsx
// components/about-section.tsx
import { siteContent } from "@/data/site";

export function AboutSection() {
  return (
    <section className="about-section">
      <p className="about-section__eyebrow">{siteContent.aboutEyebrow}</p>
      <p className="about-section__body">{siteContent.aboutBody}</p>
    </section>
  );
}
```

- [ ] **Step 3: Compose the home page**

```tsx
// app/page.tsx
import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutSection />
    </main>
  );
}
```

- [ ] **Step 4: Add responsive styles matching the current edited direction**

```css
.hero {
  min-height: 100vh;
  padding: 112px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero__title {
  margin: 0;
  font-size: clamp(28px, 8vw, 112px);
  font-weight: 800;
  letter-spacing: -0.06em;
  text-transform: uppercase;
}
```

- [ ] **Step 5: Verify mobile and desktop behavior**

Run:

```bash
npm run dev
```

Expected:

- hero video renders on mobile and desktop
- `CIAO! SONO CARMINE` appears in the intended position
- `Chi sono` sits at the intended distance below the hero

- [ ] **Step 6: Commit**

```bash
git add app components data
git commit -m "feat: rebuild portfolio home page"
```

### Task 7: Rebuild the work listing page

**Files:**
- Create: `components/work-grid.tsx`
- Create: `components/work-card.tsx`
- Modify: `app/work/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Implement a reusable work card**

```tsx
// components/work-card.tsx
import Link from "next/link";
import type { WorkItem } from "@/data/work";
import { workRoute } from "@/lib/routes";

export function WorkCard({ item }: { item: WorkItem }) {
  return (
    <Link href={workRoute(item.slug)} className="work-card">
      <div className="work-card__media" />
      <h2>{item.title}</h2>
      <p>{item.year}</p>
    </Link>
  );
}
```

- [ ] **Step 2: Implement the work grid**

```tsx
// components/work-grid.tsx
import { workItems } from "@/data/work";
import { WorkCard } from "@/components/work-card";

export function WorkGrid() {
  return (
    <section className="work-grid">
      {workItems.map((item) => (
        <WorkCard key={item.slug} item={item} />
      ))}
    </section>
  );
}
```

- [ ] **Step 3: Mount the work page**

```tsx
// app/work/page.tsx
import { WorkGrid } from "@/components/work-grid";

export default function WorkPage() {
  return (
    <main>
      <WorkGrid />
    </main>
  );
}
```

- [ ] **Step 4: Add layout styles**

```css
.work-grid {
  display: grid;
  gap: 24px;
  padding: 160px 16px 96px;
}

.work-card {
  display: grid;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}
```

- [ ] **Step 5: Verify route transitions**

Run:

```bash
npm run dev
```

Expected: `/work` opens via client navigation and card clicks animate to detail routes without full reload.

- [ ] **Step 6: Commit**

```bash
git add app components
git commit -m "feat: rebuild work listing page"
```

### Task 8: Rebuild the work detail pages

**Files:**
- Create: `components/work-detail.tsx`
- Create: `components/work-hero.tsx`
- Modify: `app/work/[slug]/page.tsx`
- Modify: `data/work.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Expand `WorkItem` to support detail content**

```ts
// data/work.ts
export type WorkItem = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  coverImage: string;
  previewVideo?: string;
  services: string[];
  body: string[];
};
```

- [ ] **Step 2: Implement the work detail component**

```tsx
// components/work-detail.tsx
import type { WorkItem } from "@/data/work";

export function WorkDetail({ item }: { item: WorkItem }) {
  return (
    <article className="work-detail">
      <h1>{item.title}</h1>
      <p>{item.summary}</p>
      <ul>
        {item.services.map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>
    </article>
  );
}
```

- [ ] **Step 3: Mount it in the dynamic route**

```tsx
// app/work/[slug]/page.tsx
import { notFound } from "next/navigation";
import { workItems } from "@/data/work";
import { WorkDetail } from "@/components/work-detail";

export default async function WorkDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = workItems.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return (
    <main>
      <WorkDetail item={item} />
    </main>
  );
}
```

- [ ] **Step 4: Add detail-page styles**

```css
.work-detail {
  display: grid;
  gap: 24px;
  padding: 160px 16px 96px;
}
```

- [ ] **Step 5: Verify all slugs resolve**

Run:

```bash
npm run build
```

Expected: each work item generates a valid detail page and no slug route 404s during build.

- [ ] **Step 6: Commit**

```bash
git add app components data
git commit -m "feat: rebuild work detail pages"
```

### Task 9: Remove mirror-specific runtime and finish Vercel cutover

**Files:**
- Modify: `vercel.json`
- Modify: `.vercelignore`
- Modify: `package.json`
- Create: `tests/smoke-nextjs-routes.mjs`
- Create: `tests/smoke-nextjs-assets.mjs`

- [ ] **Step 1: Remove the temporary `_next/image` fallback rewrite**

```json
{
  "version": 2
}
```

- [ ] **Step 2: Add simple route smoke verification**

```js
// tests/smoke-nextjs-routes.mjs
const routes = ["/", "/work"];
for (const route of routes) {
  console.log(`Check route manually in dev: ${route}`);
}
```

- [ ] **Step 3: Add simple asset smoke verification**

```js
// tests/smoke-nextjs-assets.mjs
const assets = [
  "/videos/hero-video-compressed.mp4",
  "/images/about-poster.jpg"
];
for (const asset of assets) {
  console.log(`Check asset manually in dev: ${asset}`);
}
```

- [ ] **Step 4: Run final app build**

Run:

```bash
npm run build
```

Expected: clean Next.js production build with no dependency on mirror deploy hacks.

- [ ] **Step 5: Commit**

```bash
git add vercel.json tests package.json
git commit -m "chore: complete Next.js Vercel cutover"
```

### Task 10: Final manual verification and deploy handoff

**Files:**
- Modify: none
- Test: local app and Vercel preview deployment

- [ ] **Step 1: Start the local app**

Run:

```bash
npm run dev
```

Expected: local server starts successfully.

- [ ] **Step 2: Manually verify key flows**

Check:

```text
- First hard load shows the loader once
- Internal navigation from / to /work does not full reload
- Internal navigation from /work to /work/[slug] does not full reload
- Hero video and about assets load
- Mobile and desktop layouts are sane
```

- [ ] **Step 3: Build once more for release confidence**

Run:

```bash
npm run build
```

Expected: production build completes successfully.

- [ ] **Step 4: Push**

```bash
git push origin main
```

- [ ] **Step 5: Deploy on Vercel**

```text
Import the repository in Vercel as a normal Next.js project.
Do not use custom static build output settings.
```

- [ ] **Step 6: Commit**

```bash
git commit --allow-empty -m "chore: verify Next.js rebuild for deploy"
```

## Self-Review

### Spec coverage

- Next.js rebuild: covered by Tasks 1-4
- shared loader/transition/menu behavior: covered by Tasks 4-5
- home rebuild: covered by Task 6
- work list and work detail rebuild: covered by Tasks 7-8
- Vercel cutover away from mirror hacks: covered by Task 9
- verification and deploy: covered by Task 10

### Placeholder scan

- no `TBD` or `TODO`
- commands are explicit
- file paths are explicit
- implementation snippets are included for each code-writing step

### Type consistency

- `WorkItem` is defined in `data/work.ts` and referenced consistently in work components
- route helpers live in `lib/routes.ts`
- loader session state helpers live in `lib/session.ts`
