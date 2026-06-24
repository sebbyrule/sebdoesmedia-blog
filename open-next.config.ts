import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The incremental cache serves the prerendered output of static/SSG pages at
// runtime, so the worker serves them FROM cache instead of re-rendering them —
// which is what keeps build-time-only code (e.g. the fs reads in
// src/lib/posts.ts) from running at request time and crashing on Workers.
//
// This site is fully static with no revalidation, so we use the static-assets
// cache: it reads prerendered pages straight from the ASSETS binding, needing
// no R2/KV/D1. If you ever add ISR / on-demand revalidation, switch to a
// writable backend (e.g. r2IncrementalCache) and add the matching binding.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});