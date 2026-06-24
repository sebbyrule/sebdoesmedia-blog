import Link from "next/link";
import type { Post } from "@/lib/posts";

export function RelatedPosts({ currentSlug, posts }: { currentSlug: string; posts: Post[] }) {
  const current = posts.find((p) => p.slug === currentSlug);
  if (!current) return null;

  const scored = posts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      const sharedTags = p.tags.filter((tag) => current.tags.includes(tag));
      return { post: p, score: sharedTags.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .slice(0, 3)
    .map((item) => item.post);

  if (scored.length === 0) return null;

  return (
    <aside className="mt-12 pt-6 border-t">
      <h2 className="text-lg font-semibold mb-4">Related posts</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scored.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-muted-foreground mb-1">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {post.excerpt || "Read more →"}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
