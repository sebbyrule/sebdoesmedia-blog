import Link from "next/link";
import type { Post } from "@/lib/posts";

export function SeriesNav({
  series,
  currentSlug,
  posts,
}: {
  series: string;
  currentSlug: string;
  posts: Post[];
}) {
  if (posts.length < 2) return null;

  return (
    <nav className="mb-8 rounded-xl border bg-muted/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Series: {series}
      </p>
      <ol className="space-y-2">
        {posts.map((post, idx) => {
          const isCurrent = post.slug === currentSlug;
          return (
            <li key={post.slug} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className={`text-sm leading-snug hover:text-primary transition-colors ${
                  isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {post.title}
                {isCurrent && <span className="ml-2 text-xs text-primary">(current)</span>}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
