"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Post } from "@/lib/posts";
import { BlogPostCard } from "@/components/BlogPostCard";
import { TagBadge } from "@/components/TagBadge";

export function BlogIndexClient({
  allPosts,
  allTags,
}: {
  allPosts: Post[];
  allTags: string[];
}) {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") ?? undefined;

  const posts = tag
    ? allPosts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
    : allPosts;

  return (
    <>
      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b">
          <Link
            href="/blog"
            className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
              !tag
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                tag === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-background rounded-xl border border-dashed">
          <p className="text-xl text-muted-foreground mb-2">
            {tag ? `No posts tagged "${tag}"` : "No posts yet"}
          </p>
          {tag && (
            <Link href="/blog" className="text-sm text-primary hover:underline">
              View all posts →
            </Link>
          )}
        </div>
      ) : (
        <>
          {tag && (
            <p className="text-sm text-muted-foreground mb-6">
              Showing {posts.length} post{posts.length !== 1 ? "s" : ""} tagged
              with <TagBadge tag={tag} />
            </p>
          )}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
