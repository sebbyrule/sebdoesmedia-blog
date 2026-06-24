// Projects are generated at build time from public GitHub repos. See
// scripts/fetch-github-projects.mjs (runs in prebuild / pages:build).
import { githubProjects } from './github-projects.generated';

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
};

export const projects: Project[] = githubProjects;

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}