import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/posts";
import { TagBadge } from "@/components/TagBadge";

const formatLabels: Record<string, string> = {
  article: "",
  podcast: "🎙 Podcast",
  video: "🎬 Video",
  gallery: "🖼 Gallery",
};

export function BlogPostCard({ post }: { post: Post }) {
  return (
    <Link
      key={post.slug}
      href={`/blog/${post.slug}`}
      className="group block border bg-card rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      {post.image && (
        <div className="relative w-full h-40 overflow-hidden bg-muted">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.format !== "article" && (
            <span className="shrink-0 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              {formatLabels[post.format]}
            </span>
          )}
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {post.excerpt || "No excerpt available"}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-gray-400 rounded-full" />
            {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
