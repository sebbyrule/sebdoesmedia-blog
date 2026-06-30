// Projects are generated at build time from public GitHub repos. See
// scripts/fetch-github-projects.mjs (runs in prebuild / pages:build).
// Curated, hand-written details live in projects.overrides.ts and take
// precedence over the auto-generated GitHub data.
import { githubProjects } from './github-projects.generated';
import { projectOverrides } from './projects.overrides';

export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  techStack: string[];
  gradient: string;
  icon: 'monitor' | 'zap' | 'tools';
  url: string;
  github?: string;
  demo?: string;
  status: 'active' | 'planned' | 'archived';
  // GitHub-sourced metadata (optional; populated by scripts/fetch-github-projects.mjs)
  stars?: number;
  language?: string;
  updatedAt?: string;
  createdAt?: string;
  forks?: number;
  license?: string;
  homepage?: string;
  // Rendered as the "About" body when present (repo README, lightly cleaned).
  readme?: string;
  // Curated extras (see projects.overrides.ts)
  highlights?: string[];
  featured?: boolean;
};

// Shallow-merge curated overrides over generated data, ignoring undefined values
// so a partial override never blanks out a real GitHub-sourced field.
function applyOverride(base: Project, override?: Partial<Project>): Project {
  if (!override) return base;
  const merged: Project = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = value;
    }
  }
  return merged;
}

export const projects: Project[] = githubProjects.map((p) =>
  applyOverride(p, projectOverrides[p.id]),
);

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
