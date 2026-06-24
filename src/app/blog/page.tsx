import { Suspense } from "react";
import { getPosts, getAllTags } from "@/lib/posts";
import { BlogIndexClient } from "./BlogIndexClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts | Sebdoesmedia",
  description: "All blog posts about media, technology, and everything in between.",
};

export default async function BlogIndexPage() {
  // Read posts at build time (fs is only available during static generation
  // on Cloudflare Workers). Tag filtering happens client-side from the URL.
  const allPosts = await getPosts();
  const allTags = await getAllTags();

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Posts</h1>
        <p className="text-lg text-muted-foreground">
          Thoughts on media, technology, and everything in between.
        </p>
      </header>

      <Suspense fallback={null}>
        <BlogIndexClient allPosts={allPosts} allTags={allTags} />
      </Suspense>
    </div>
  );
}
