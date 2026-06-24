import { projects, getProjectById } from "@/lib/projects";
import { ProjectIcon } from "@/lib/icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
  active: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  planned: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  archived: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <header className="mb-8 pb-6 border-b">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center shrink-0`}
          >
            <ProjectIcon icon={project.icon} size="lg" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1">{project.title}</h1>
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-4">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Live Demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-5 text-sm font-medium hover:bg-muted transition-colors"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
              </svg>
              View on GitHub
            </a>
          )}
        </div>
      </header>

      {/* About section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-muted-foreground leading-relaxed">{project.longDescription}</p>
      </section>

      {/* Tech stack */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-lg bg-muted text-sm font-medium text-foreground border"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Status + details */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
            <p className="font-semibold">
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </p>
          </div>
          {project.language && (
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Language</p>
              <p className="font-semibold">{project.language}</p>
            </div>
          )}
          {typeof project.stars === "number" && (
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Stars</p>
              <p className="font-semibold">{project.stars}</p>
            </div>
          )}
          {project.updatedAt && (
            <div className="bg-muted rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last updated</p>
              <p className="font-semibold">
                {new Date(project.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
          <div className="bg-muted rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tags</p>
            <p className="font-semibold">{project.tags.join(", ")}</p>
          </div>
        </div>
      </section>

      {/* Back link */}
      <nav className="pt-6 border-t">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to all projects
        </Link>
      </nav>
    </article>
  );
}