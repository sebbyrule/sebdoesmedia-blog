import { getPostBySlug, getAllSlugs, getPosts, getPrevNextPosts, getSeriesPosts, extractHeadings } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { TagBadge } from "@/components/TagBadge";
import { ScrollProgress } from "@/components/ScrollProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { CodeBlockCopy } from "@/components/CodeBlockCopy";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SeriesNav } from "@/components/SeriesNav";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ShareButtons } from "@/components/ShareButtons";
import { ImageLightbox } from "@/components/ImageLightbox";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sebdoesmedia.pages.dev";

  return {
    title: `${post.title} | Sebdoesmedia`,
    description: post.excerpt || `Read "${post.title}" on Sebdoesmedia`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${siteUrl}/blog/${post.slug}`,
      tags: post.tags,
      images: [`${siteUrl}/og/${post.slug}.png`],
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPosts();
  const headings = extractHeadings(post.content);
  const { prev, next } = getPrevNextPosts(allPosts, slug);
  const seriesPosts = post.series ? getSeriesPosts(allPosts, post.series) : [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sebdoesmedia.pages.dev";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Person", name: "Sebdoesmedia" },
    description: post.excerpt,
    url: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <ScrollProgress />
      <CodeBlockCopy />
      <ImageLightbox />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative mx-auto max-w-3xl px-4">
        <article className="min-w-0 py-10">
          {post.series && (
            <SeriesNav series={post.series} currentSlug={slug} posts={seriesPosts} />
          )}

          <header className="mb-8 pb-6 border-b">
            <h1 className="font-display text-4xl md:text-5xl leading-[1.08] tracking-tight mb-4 text-foreground">
              {post.title}
            </h1>

            {post.format !== "article" && (
              <p className="text-sm font-medium text-primary mb-3 capitalize">
                {post.format === "podcast" && "🎙 Podcast"}
                {post.format === "video" && "🎬 Video"}
                {post.format === "gallery" && "🖼 Gallery"}
              </p>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                    <TagBadge tag={tag} />
                  </Link>
                ))}
              </div>
            )}

            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span>{post.readingTime}</span>
            </div>

            <div className="mt-5 pt-5 border-t">
              <ShareButtons title={post.title} url={`${siteUrl}/blog/${post.slug}`} />
            </div>
            </header>

          {/* Format-specific hero media */}
          {post.format === "podcast" && post.audio && (
            <div className="mb-8">
              <AudioPlayer src={post.audio} />
            </div>
          )}

          {post.format === "video" && post.video && (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8 bg-muted">
              <iframe
                src={post.video}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}

          {post.format === "gallery" && post.gallery && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {post.gallery.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={src}
                    alt={`${post.title} gallery image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 200px"
                  />
                </div>
              ))}
            </div>
          )}

          {post.format === "article" && post.image && (
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8 bg-muted">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:border prose-img:rounded-xl prose-headings:scroll-mt-20">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeSlug]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Prev / Next navigation — only show when there are adjacent posts */}
          {prev || next ? (
            <nav className="mt-12 pt-6 border-t grid grid-cols-2 gap-4">
              <div>
                {next && (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="group flex flex-col gap-1 rounded-lg p-3 hover:bg-muted transition-colors"
                  >
                    <span className="text-xs text-muted-foreground">
                      ← Newer post
                    </span>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {next.title}
                    </span>
                  </Link>
                )}
              </div>
              <div className="text-right">
                {prev && (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className="group flex flex-col gap-1 rounded-lg p-3 hover:bg-muted transition-colors"
                  >
                    <span className="text-xs text-muted-foreground">
                      Older post →
                    </span>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {prev.title}
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          ) : null}

          {/* Back link */}
          <nav className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back to all posts
            </Link>
          </nav>

          <RelatedPosts currentSlug={slug} posts={allPosts} />
        </article>

        {/* TOC sidebar — fixed on very wide screens so article stays centered */}
        <aside className="hidden 2xl:block fixed right-16 top-32 w-56">
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </>
  );
}
