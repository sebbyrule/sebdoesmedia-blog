# Sebdoesmedia Blog

A blog platform built with Next.js, deployed on **Cloudflare Pages** via Open Next Cloudflare.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI:** shadcn/ui (Radix Luma) + Tailwind CSS v4 + Lucide icons
- **Content:** Markdown posts parsed with gray-matter
- **Deployment:** Cloudflare Pages via @opennextjs/cloudflare

## Getting Started

```bash
npm install
npm run dev        # Next.js dev server at http://localhost:3000
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Next.js production build |
| `npm run lint` | ESLint check |
| `npm run pages:build` | Open Next Cloudflare build |
| `npm run pages:preview` | Preview Cloudflare build locally |
| `npm run pages:deploy` | Deploy to Cloudflare Pages |

## Adding a Blog Post

1. Create a `.md` file in `content/posts/`
2. Add YAML frontmatter with `title`, `date`, and `excerpt`
3. Write the body in Markdown
4. Rebuild — the post appears automatically

Example frontmatter (article):
```yaml
---
title: "My New Post"
date: "2026-07-01"
excerpt: "A short description of the post."
tags: ["tech", "tutorial"]
image: "/my-post-hero.webp"
---
```

### Media formats
Set `format` to one of `article`, `podcast`, `video`, or `gallery`.

```yaml
---
title: "Episode 1"
format: podcast
date: "2026-07-01"
excerpt: "..."
audio: "https://example.com/episode.mp3"
---
```

```yaml
---
title: "My Video Essay"
format: video
date: "2026-07-01"
excerpt: "..."
video: "https://www.youtube.com/embed/VIDEO_ID"
---
```

```yaml
---
title: "Photo Gallery"
format: gallery
date: "2026-07-01"
excerpt: "..."
gallery: ["/img/1.webp", "/img/2.webp", "/img/3.webp"]
---
```

### Series
Group multi-part posts with matching `series` names and ascending `seriesOrder` values. A series progress nav appears on each post.

```yaml
---
title: "Part 1: Setup"
series: "Building My Project"
seriesOrder: 1
date: "2026-07-01"
excerpt: "..."
---
```

## Features

- **Tags** — filter posts by tag on `/blog?tag=...`
- **Search** — fuzzy full-text search on `/search`
- **TOC** — sticky table of contents on wide screens
- **Series** — multi-part series navigation
- **Media formats** — podcasts, video embeds, galleries
- **TTS** — "Listen" button reads articles aloud via browser speech synthesis
- **OG Images** — per-post share cards generated at build time
- **Related posts** — related content based on shared tags
- **Share buttons** — copy link + X/Bluesky/LinkedIn/native share
- **Image lightbox** — click any post image to expand
- **Archive** — `/archive` groups posts by year
- **Lint dashboard** — `/lint` shows content quality metrics and issues
- **Now page** — `/now` shares current focus/interests
- **Dark mode** — theme toggle in the nav

## Search

Search all posts from the nav bar or visit [/search](/search). Results update as you type, using Fuse.js for fuzzy matching against titles, excerpts, and tags.

## Deployment

The project uses **Open Next Cloudflare** (`@opennextjs/cloudflare`) to deploy on Cloudflare Pages.

1. Set your environment variables in Cloudflare Dashboard > Pages > your project > Settings > Environment variables
2. Run `npm run pages:deploy`

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g., https://sebdoesmedia.pages.dev) |
| `NEXT_PUBLIC_IMAGE_CDN_URL` | Image CDN base URL |
| `NEXT_PUBLIC_APP_NAME` | Application name |