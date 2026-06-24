import { projects } from "@/lib/projects";
import { ProjectIcon } from "@/lib/icons";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Sebdoesmedia",
  description: "Explore projects and experiments in media and technology.",
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-lg text-muted-foreground">
          Our latest projects and experiments pushing the boundaries of what&apos;s possible.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={project.url}
            className="group border bg-card rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <ProjectIcon icon={project.icon} />
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            {(project.language || typeof project.stars === "number") && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {project.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/70" />
                    {project.language}
                  </span>
                )}
                {typeof project.stars === "number" && (
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.783 1.401 8.169L12 18.896l-7.335 3.857 1.401-8.169L.132 9.211l8.2-1.193z" />
                    </svg>
                    {project.stars}
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}