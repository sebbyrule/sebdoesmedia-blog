import { getPosts } from '@/lib/posts';
import { projects } from '@/lib/projects';
import { ProjectIcon } from '@/lib/icons';
import { BlogPostCard } from '@/components/BlogPostCard';
import Image from 'next/image';
import Link from 'next/link';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/70 py-20 md:py-28">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 max-w-5xl mx-auto">
            <div className="flex-1 text-center md:text-left">
              <p className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
                <span className="h-px w-8 bg-primary" />
                Media &amp; Technology
              </p>
              <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight mb-7">
                Notes from the<br />
                <span className="italic text-primary">studio</span>.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-9 max-w-md leading-relaxed">
                Essays, builds and experiments at the seam where creative work
                meets the tools that make it. Written by Seb.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                <Link
                  href="/blog"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
                >
                  Read the journal
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex h-12 items-center justify-center gap-1.5 px-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  About Seb
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>
            <div className="shrink-0">
              <div className="relative">
                <div className="absolute -inset-3 rounded-full border border-primary/30" aria-hidden="true" />
                <Image
                  src="/hero-cartoon.webp"
                  alt="Sebdoesmedia cartoon avatar"
                  width={300}
                  height={300}
                  priority
                  className="relative rounded-full bg-secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-6 mb-12 border-b border-border/70 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Selected work</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight">
                Things I&apos;ve built
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              All projects →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={project.url}
                className="group flex flex-col border border-border bg-card rounded-lg p-6 hover:border-primary/60 hover:bg-secondary/30 transition-colors"
              >
                <div className={`w-11 h-11 rounded-md bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-5`}>
                  <ProjectIcon icon={project.icon} />
                </div>
                <h3 className="font-display text-xl mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full border border-border text-muted-foreground text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                  View project
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              All projects →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 bg-secondary/40 border-t border-border/70">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-6 mb-12 border-b border-border/70 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">From the journal</p>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight">
                Latest writing
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              All posts →
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-lg border border-dashed border-border">
              <p className="font-display text-xl text-muted-foreground mb-2">Nothing published yet</p>
              <p className="text-sm text-muted-foreground">The first piece is on its way.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 6).map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {posts.length > 0 && (
            <div className="text-center mt-10 sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                All posts →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}