import { projects, getProjectById } from "@/lib/projects";
import { ProjectIcon } from "@/lib/icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) return {};
  return {
    title: `${project.title} | Sebdoesmedia`,
    description: project.description,
  };
}

const statusColors: Record<string, string> = {
  active:
    "bg-[oklch(0.58_0.06_145_/_0.16)] text-[oklch(0.42_0.07_145)] dark:text-[oklch(0.76_0.08_145)]",
  planned: "bg-primary/12 text-primary",
  archived: "bg-muted text-muted-foreground",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  // A curated longDescription (different from the one-line tagline) wins over the
  // README; otherwise fall back to the repo README. If neither exists, the About
  // section is hidden and we show a "lives on GitHub" call-to-action instead.
  const curatedAbout =
    project.longDescription && project.longDescription !== project.description
      ? project.longDescription
      : null;
  const aboutMarkdown = curatedAbout ?? project.readme ?? null;
  const hasHighlights = (project.highlights?.length ?? 0) > 0;
  const isBare = !aboutMarkdown && !hasHighlights;

  return (
    <article className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <header className="mb-10 pb-8 border-b border-border/70">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center shrink-0`}
          >
            <ProjectIcon icon={project.icon} size="lg" />
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-2">{project.title}</h1>
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>

        <p className="text-lg text-muted-foreground leading-relaxed mb-5">{project.description}</p>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-border text-muted-foreground text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Live Demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium hover:bg-secondary/60 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
              </svg>
              View on GitHub
            </a>
          )}
        </div>
      </header>

      {/* Highlights (curated) */}
      {hasHighlights && (
        <section className="mb-10">
          <h2 className="text-2xl mb-4">Highlights</h2>
          <ul className="space-y-2">
            {project.highlights!.map((item) => (
              <li key={item} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* About — curated paragraph or rendered README */}
      {aboutMarkdown && (
        <section className="mb-10">
          <h2 className="text-2xl mb-4">About</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:border prose-img:rounded-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {aboutMarkdown}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Graceful fallback when there's nothing to show beyond the tagline */}
      {isBare && project.github && (
        <section className="mb-10">
          <div className="rounded-lg border border-border bg-secondary/40 p-8 text-center">
            <h2 className="font-display text-2xl mb-2">This project lives on GitHub</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              The code, docs, and full story are over on the repository. Have a look — or check back
              here once it&apos;s written up.
            </p>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Explore the repository →
            </a>
          </div>
        </section>
      )}

      {/* Tech stack */}
      {project.techStack.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-md bg-secondary/60 text-sm font-medium text-foreground border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Details */}
      <section className="mb-10">
        <h2 className="text-2xl mb-4">Details</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Detail label="Status" value={project.status.charAt(0).toUpperCase() + project.status.slice(1)} />
          {project.language && <Detail label="Primary language" value={project.language} />}
          {project.license && <Detail label="License" value={project.license} />}
          {typeof project.stars === "number" && <Detail label="Stars" value={String(project.stars)} />}
          {typeof project.forks === "number" && <Detail label="Forks" value={String(project.forks)} />}
          {project.createdAt && <Detail label="Created" value={formatDate(project.createdAt)} />}
          {project.updatedAt && <Detail label="Last updated" value={formatDate(project.updatedAt)} />}
        </dl>
      </section>

      {/* Back link */}
      <nav className="pt-6 border-t border-border/70">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          Back to all projects
        </Link>
      </nav>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/40 border border-border rounded-lg p-4">
      <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
