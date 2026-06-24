"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Fuse from "fuse.js";
import { TagBadge } from "@/components/TagBadge";

type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime: string;
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [index, setIndex] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/search.json")
      .then((r) => r.json())
      .then((data: PostMeta[]) => {
        setIndex(data);
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 3 },
          { name: "excerpt", weight: 2 },
          { name: "tags", weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [index],
  );

  const results = useMemo(() => {
    if (!query.trim()) return index;
    return fuse.search(query.trim()).map((r) => r.item);
  }, [query, fuse, index]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search";
    window.history.pushState(null, "", url);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Search</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all posts…"
            className="w-full pl-10 pr-4 py-3 bg-background border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </form>

      {loading ? (
        <p className="text-muted-foreground">Loading search index…</p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {query.trim()
              ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query.trim()}"`
              : `${index.length} post${index.length !== 1 ? "s" : ""} total`}
          </p>

          {results.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-xl border border-dashed">
              <p className="text-xl text-muted-foreground mb-2">No results found</p>
              <p className="text-sm text-gray-500">
                Try a different search term or{" "}
                <Link href="/blog" className="text-primary hover:underline">
                  browse all posts
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block border bg-card rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200"
                >
                  <h2 className="text-lg font-semibold mb-1 hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {post.tags.map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}