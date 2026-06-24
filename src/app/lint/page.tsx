import { lintPosts } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Lint | Sebdoesmedia",
  description: "Quality dashboard for blog content.",
};

export const dynamic = "force-static";

export default async function LintPage() {
  const { posts, issues, stats } = await lintPosts();
  const errors = issues.filter((i) => i.type === "error");
  const warnings = issues.filter((i) => i.type === "warning");

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-bold mb-4">Content Lint</h1>
      <p className="text-muted-foreground mb-8">
        A build-time quality dashboard for posts. Errors block good SEO/social previews; warnings
        are recommendations.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Posts</p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-3xl font-bold">{stats.totalWords.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Words</p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-3xl font-bold">{stats.avgReadingTime}</p>
          <p className="text-sm text-muted-foreground">Avg min read</p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-3xl font-bold">{issues.length}</p>
          <p className="text-sm text-muted-foreground">Issues</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
          <span className="font-semibold">{stats.missingExcerpts}</span> missing excerpts
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
          <span className="font-semibold">{stats.missingTags}</span> posts without tags
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
          <span className="font-semibold">{stats.missingImages}</span> articles without hero images
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 p-6 text-green-700 dark:text-green-300">
          ✅ All posts pass the quality checks.
        </div>
      ) : (
        <div className="space-y-4">
          {errors.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Errors ({errors.length})
              </h2>
              <ul className="divide-y border rounded-xl overflow-hidden bg-card">
                {errors.map((issue, idx) => (
                  <li key={`err-${idx}`} className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm">
                      {issue.message} on{" "}
                      <Link
                        href={`/blog/${issue.slug}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {issue.slug}
                      </Link>
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium">
                      Error
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {warnings.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Warnings ({warnings.length})
              </h2>
              <ul className="divide-y border rounded-xl overflow-hidden bg-card">
                {warnings.map((issue, idx) => (
                  <li key={`warn-${idx}`} className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm">
                      {issue.message} on{" "}
                      <Link
                        href={`/blog/${issue.slug}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {issue.slug}
                      </Link>
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-medium">
                      Warning
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Posts</h2>
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Slug</th>
                <th className="text-left px-4 py-2 font-medium">Format</th>
                <th className="text-left px-4 py-2 font-medium">Tags</th>
                <th className="text-left px-4 py-2 font-medium">Words</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.slug}>
                  <td className="px-4 py-2">
                    <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
                      {post.slug}
                    </Link>
                  </td>
                  <td className="px-4 py-2 capitalize">{post.format}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {post.tags.length > 0 ? post.tags.join(", ") : "—"}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {post.content.trim().split(/\s+/).length.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
