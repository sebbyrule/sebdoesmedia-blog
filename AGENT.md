# AGENT.md — Sebdoesmedia Blog

## Project Overview
A blog platform hosted on **Cloudflare Pages** using the **Open Next Cloudflare** adapter. Content is authored in Markdown files under `content/posts/`. Projects are defined in `src/lib/projects.ts`.

## Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.9 |
| UI Components | shadcn/ui (Radix Luma style) | via components.json |
| Styling | Tailwind CSS v4 + @tailwindcss/typography | via globals.css @theme |
| Fonts | Geist + Inter (next/font) | - |
| Icons | Lucide React | ^1.18.0 |
| Content | Markdown (gray-matter + react-markdown + remark-gfm) | ^4.0.3 / ^10.1.1 |
| Search | Fuse.js client-side search | ^7.4.2 |
| Code Highlighting | rehype-highlight | latest |
| OG Image Generation | satori + @resvg/resvg-js | ^0.26.0 / ^2.6.2 |
| Deployment | Open Next Cloudflare + Wrangler | ^1.19.11 / ^4.100.0 |

## Directory Structure
```
sebdoesmedia-blog/
├── src/                    # ALL source code lives here (Next.js src dir)
│   ├── app/
│   │   ├── page.tsx        # Home page (hero + featured projects + latest posts)
│   │   ├── layout.tsx      # Root layout (nav: Home/Posts/Projects/About, footer with YT/IG/X icons)
│   │   ├── globals.css     # Tailwind v4 config (@theme inline, typography plugin)
│   │   ├── about/page.tsx  # About page
│   │   ├── contact/page.tsx# Contact page
│   │   ├── blog/page.tsx   # Blog index page (lists all posts)
│   │   ├── blog/[slug]/page.tsx  # Blog post with react-markdown + OG metadata + reading time
│   │   ├── projects/page.tsx     # Projects index page
│   │   ├── projects/[id]/page.tsx# Individual project detail page (SSG)
│   │   ├── now/page.tsx     # Now page (current focus / interests)
│   │   ├── lint/page.tsx    # Content quality dashboard
│   │   ├── archive/page.tsx # Year-grouped post archive
│   │   ├── sitemap.ts      # Auto-generated sitemap.xml
│   │   ├── search.json/route.ts # Build-time JSON search index (fetched by /search)
│   │   ├── search/page.tsx # Search page wrapper (Suspense boundary)
│   │   ├── search/SearchClient.tsx # Client-side Fuse.js search with query param support
│   │   └── feed.xml/route.ts     # RSS feed
│   ├── components/
│   │   ├── AudioPlayer.tsx  # TTS listen button + native audio player for podcasts
│   │   ├── BlogPostCard.tsx # Reusable blog post card (date, reading time, excerpt, tags, hero image, format badge)
│   │   ├── CodeBlockCopy.tsx # Adds copy button to code blocks in blog posts
│   │   ├── ImageLightbox.tsx # Click-to-expand lightbox for images inside posts
│   │   ├── ImageWithCDN.tsx # Image component with CDN base URL
│   │   ├── RelatedPosts.tsx # Shows 3 related posts based on shared tags
│   │   ├── ScrollProgress.tsx # Reading progress bar at top of blog posts
│   │   ├── SearchBar.tsx    # Nav search icon + expanded input (desktop), search link (mobile)
│   │   ├── SeriesNav.tsx    # Series progress navigation for multi-part posts
│   │   ├── ShareButtons.tsx # Copy link + native/web share + X/Bluesky/LinkedIn buttons
│   │   ├── TableOfContents.tsx # Sticky TOC sidebar for blog posts
│   │   ├── TagBadge.tsx    # Color-coded tag pill component
│   │   └── ThemeToggle.tsx  # Dark/light mode toggle
│   └── lib/
│       ├── icons.tsx      # Shared ProjectIcon component (monitor/zap/tools SVGs)
│       ├── posts.ts       # Markdown file loader + Post type + getAllSlugs + getAllTags + getPrevNextPosts + extractHeadings
│       ├── projects.ts    # Projects data source (static typed array)
│       └── utils.ts       # cn() utility (clsx + tailwind-merge)
├── content/posts/          # Markdown blog posts (with frontmatter)
├── public/                 # Static assets
├── open-next.config.ts     # Open Next Cloudflare adapter config
├── wrangler.toml           # Cloudflare Workers config (OpenNext: main/assets/R2 cache binding)
├── next.config.ts          # Next.js config
└── package.json
```

## ⚠️ Critical Rules for Coding Agents

### 1. No root `app/`, `components/`, or `lib/` directories
These were removed as duplicates. **All source code lives in `src/`**. The `@/*` alias in tsconfig.json maps to `./src/*`. Do NOT create files under root `app/`, `components/`, or `lib/` — they will be dead code.

### 2. Cloudflare Workers = no Node.js fs at runtime
`src/lib/posts.ts` uses `fs.readdir` / `fs.readFile` to load markdown content. This works at **build time** (static generation) but will **CRASH at runtime** on Cloudflare Workers. All blog pages use `generateStaticParams()` to pre-render at build time. Do NOT add runtime-dependent features that rely on `fs`.

### 3. Next.js 16 App Router — `params` is a Promise
Always use `const { slug } = await params;` — do NOT destructure params directly. Missing `await` will return a Promise, causing TypeScript errors. This applies to **both** page components AND `generateMetadata`.

### 4. Open Next Cloudflare deployment
- Build: `npm run pages:build` (runs `@opennextjs/cloudflare build`)
- Deploy: `npm run pages:deploy`
- Preview: `npm run pages:preview`
- Standard `npm run build` / `next build` works for dev/preview but does NOT produce Cloudflare-compatible output.
- **MUST build Next.js with webpack, not Turbopack.** The `build` script is `next build --webpack`. Next 16 defaults to Turbopack, whose server chunk format OpenNext cannot load at runtime (`ChunkLoadError` / `ComponentMod.handler is not a function` → every server response 500s). Do NOT remove the `--webpack` flag.
- **An incremental cache override is REQUIRED**, even though the site is fully static. `open-next.config.ts` uses the `static-assets-incremental-cache` (serves prerendered pages from the `ASSETS` binding — no R2/KV/D1 needed, read-only/no revalidation). Without an incremental cache, prerendered pages re-render on demand at runtime and crash on `fs.readdir` (`[unenv] fs.readdir is not implemented yet!`). If ISR is ever added, switch to a writable backend (R2/KV/D1) and add its binding in `wrangler.toml`.
- **`wrangler.toml` is Workers config**, not Pages: `main = ".open-next/worker.js"`, `[assets]` binding `ASSETS`, `compatibility_flags = ["nodejs_compat", "global_fetch_strictly_public"]`.
- Local `npm run pages:preview` is unreliable on Windows (OpenNext warns; server function 500s). Verify against a real `*.workers.dev` deploy instead. If a build hits `EPERM` removing `.open-next`, kill stray `workerd` processes first.
- **Automatic deploys via Cloudflare Workers Builds (Git integration).** The Worker `sebdoesmedia-blog` is connected to `github.com/sebbyrule/sebdoesmedia-blog`; pushes to `main` build + deploy automatically, and branches/PRs get preview versions. Dashboard build settings (Workers & Pages → `sebdoesmedia-blog` → Settings → Builds):
  - Production branch: `main`
  - Build command: `npm run pages:build`
  - Deploy command: `npx opennextjs-cloudflare deploy` (NOT bare `wrangler deploy` — `deploy` also populates the static-assets cache; without it, prerendered pages crash on `fs` at runtime)
  - Non-production branch deploy command: `npx opennextjs-cloudflare upload`
  - Build variables: `NEXT_PUBLIC_SITE_URL` must be set here (baked into SSG output at build time: OG tags, canonical URLs, sitemap, RSS)
  - Node version pinned via `.nvmrc` (22); override with a `NODE_VERSION` build var if needed
  - CI runs on Linux, so it avoids the Windows OpenNext flakiness. Prefer `git push` over local `npm run pages:deploy` so there's a single source of truth (both target the same Worker).

### 5. Tailwind CSS v4
All configuration is in `src/app/globals.css` via `@theme inline {}`. The legacy `tailwind.config.mjs` has been removed. Do NOT re-create it — add theme tokens (colors, fonts, spacing) to the CSS `@theme` block instead.
- The `@tailwindcss/typography` plugin is added via `@plugin "@tailwindcss/typography";` in CSS.
- Use `prose prose-slate dark:prose-invert` for markdown content styling.

### 6. shadcn/ui — Radix Luma style
Components use the new `displayName`-free pattern with `data-slot` attributes. If adding new shadcn components, run `npx shadcn@latest add <component>` from the project root. Do NOT use the old `forwardRef` + `displayName` pattern — it's been replaced by the Luma style.

### 7. Post frontmatter format
Required fields: `title`, `date`, `excerpt`. Optional: `tags` (array of strings), `image` (hero image path / default for article format), `format` (`article` | `podcast` | `video` | `gallery`; defaults to `article`), `audio` (podcast/mp3 URL), `video` (embed URL), `gallery` (array of image paths), `series` (series name), `seriesOrder` (number for ordering in a series). The file `src/lib/posts.ts` reads `data.excerpt`. Do NOT use `description` instead of `excerpt`.

Example (article):
```yaml
---
title: "My Post"
date: "2026-06-13"
excerpt: "A short summary of the post."
tags: ["tech", "tutorial"]
image: "/my-post-hero.webp"
---
```

Example (podcast):
```yaml
---
title: "Episode 1: The Future of Media"
format: podcast
date: "2026-06-13"
excerpt: "..."
audio: "https://example.com/episode.mp3"
---
```

Example (series):
```yaml
---
title: "Building a Platform, Part 1"
series: "Building a Platform"
seriesOrder: 1
date: "2026-06-13"
excerpt: "..."
---
```

### 8. Markdown rendering uses react-markdown
`src/app/blog/[slug]/page.tsx` uses `ReactMarkdown` with `remarkGfm` (GitHub-flavored markdown) and `rehypeHighlight` (syntax highlighting for code blocks). Do NOT replace this with `dangerouslySetInnerHTML` or plain `.split("\n")` rendering.

### 9. Projects data source
Projects are **generated at build time from public GitHub repos** by `scripts/fetch-github-projects.mjs` (runs in `prebuild` / `pages:build`). It fetches `https://api.github.com/users/<USERNAME>/repos` (unauthenticated — no token, public repos only), maps each repo to the `Project` shape, and writes `src/lib/github-projects.generated.ts` (committed, so builds work even if GitHub is unreachable). `src/lib/projects.ts` re-exports that array and defines the `Project` type: `id`, `title`, `description`, `longDescription`, `tags`, `techStack`, `gradient`, `icon` (monitor/zap/tools), `url`, optional `github`/`demo`, `status` (active/planned/archived), plus GitHub metadata `stars`/`language`/`updatedAt`. Repos are filtered to non-forks with a description, minus an `EXCLUDE` set (the site repos) defined in the script. To change which repos appear, edit `USERNAME`/`EXCLUDE` in the script — do NOT hand-edit `github-projects.generated.ts` (it's overwritten each build). Projects automatically appear on the homepage, projects page, sitemap, and detail pages. `id` is a lowercased slug of the repo name (camelCase repos like `AppropriatedKitchen` → `appropriatedkitchen`).

### 10. Dynamic OG images
Per-post OG share cards are generated at build time by `scripts/generate-og.mjs` (uses `satori` + `@resvg/resvg-js`) and written to `public/og/[slug].png`. The script runs automatically via `npm run prebuild` before `next build`. Each `/blog/[slug]` page references its generated image in `openGraph.images`.

### 11. Social links in footer
Footer social icons (YouTube, Instagram, X/Twitter) are defined in `src/app/layout.tsx` in the `socialLinks` array. Update the `href` values when real URLs are available.

### 12. Tag system
- Posts can have a `tags` array in frontmatter. Tags are displayed on blog cards and post pages.
- The blog index (`/blog`) supports tag filtering via `?tag=<name>` query parameter.
- Tag colors are defined in `src/components/TagBadge.tsx`. Add a new entry to `tagColors` for each tag that needs a specific color; unknown tags get a neutral style.
- To list all available tags, use `getAllTags()` from `src/lib/posts.ts`.

### 13. Audio player / TTS
`src/components/AudioPlayer.tsx` renders a native `<audio>` element if `audio` frontmatter is present. For `article` format posts, it renders a browser speech-synthesis (TTS) "Listen" button that reads the article text. It falls back gracefully if `speechSynthesis` is unavailable.

### 14. Series navigation
Multi-part series use `series` (name) + `seriesOrder` (number) frontmatter fields. `src/components/SeriesNav.tsx` renders a numbered progress list on each post in the series. Posts in the same series are ordered by `seriesOrder` ascending.

### 15. Table of Contents positioning
The TOC is hidden on narrow viewports. On very wide screens (`2xl:` / 1536px+) it appears as a **fixed right sidebar** so the article stays centered. The `TableOfContents` component no longer manages its own visibility; the parent blog page controls it.

### 16. Related posts, share buttons, lightbox, archive
- `RelatedPosts` appears below each post and shows up to 3 posts with the most shared tags.
- `ShareButtons` is added to each post header with copy link, native share (when supported), and X/Bluesky/LinkedIn share links.
- `ImageLightbox` attaches click handlers to `.prose img` elements so readers can click any inline image to expand it.
- `/archive` groups posts by year with sticky year headings.

## Build Commands
```bash
npm run lint         # ESLint — must pass with 0 errors/warnings
npm run build        # Next.js build — must pass TypeScript check
npm run pages:build  # Open Next Cloudflare build — produces .open-next/ output
npm run pages:deploy # Deploy to Cloudflare Pages
npm run pages:preview# Preview Cloudflare build locally
```

## Routes
| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Home page |
| `/about` | Static | About page |
| `/blog` | Static | Blog index; tag filtering (`?tag=...`) is client-side via `BlogIndexClient` (kept static so no runtime `fs`) |
| `/blog/[slug]` | SSG | Blog post with markdown rendering |
| `/projects` | Static | Projects index |
| `/projects/[id]` | SSG | Project detail page |
| `/contact` | Static | Contact page |
| `/sitemap.xml` | SSG | Auto-generated sitemap |
| `/feed.xml` | SSG | RSS feed |
| `/search` | Static | Full-text search with Fuse.js |
| `/search.json` | SSG | Build-time search index |
| `/now` | Static | Now page — current focus |
| `/lint` | Static | Content quality dashboard |
| `/archive` | Static | Year-grouped post archive |

## Environment Variables
| Variable | Description | Required? |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SITE_URL` | Cloudflare Pages production URL | For deploy, sitemap, RSS |
| `NEXT_PUBLIC_IMAGE_CDN_URL` | Image CDN base URL | Optional (has fallback) |
| `NEXT_PUBLIC_APP_NAME` | App display name | Default: Sebdoesmedia |

## Previously Resolved Issues
- **Missing `await` on `getPostBySlug()`**: Fixed — was returning Promise, causing TS error.
- **`dangerouslySetInnerHTML` on blog page**: Replaced with react-markdown rendering.
- **Corrupted `wrangler.toml`**: Had `pages_build_output_dir = ".next/定/server"` — fixed.
- **`@cloudflare/next-on-pages` incompatible**: Replaced with `@opennextjs/cloudflare` (supports Next.js 16).
- **`first-post.md` used `description:` instead of `excerpt:`**: Fixed frontmatter.
- **`any` type on `ImageWithCDN` props**: Fixed with proper `ImageProps` typing.
- **No blog index page**: Created `src/app/blog/page.tsx`.
- **No projects pages**: Created `src/app/projects/` index + detail pages.
- **Homepage linked to `/blog/welcome`**: Fixed to link to `/blog`.
- **Reading time not shown**: Added to posts lib and displayed on blog cards + post pages.