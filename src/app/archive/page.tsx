import { getPosts } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive | Sebdoesmedia",
  description: "Browse all Sebdoesmedia posts by year.",
};

export const dynamic = "force-static";

export default async function ArchivePage() {
  const posts = await getPosts();

  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">Archive</h1>
      <p className="text-muted-foreground mb-10">
        All {posts.length} posts, grouped by year.
      </p>

      <div className="space-y-10">
        {years.map((year) => (
          <section key={year}>
            <h2 className="text-2xl font-semibold mb-4 sticky top-20 bg-background/95 backdrop-blur-sm py-2 z-10">
              {year}
            </h2>
            <ul className="space-y-3">
              {grouped[year].map((post) => (
                <li key={post.slug} className="flex items-start gap-4 group">
                  <span className="text-sm text-muted-foreground shrink-0 w-20 pt-1">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-lg font-medium group-hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
