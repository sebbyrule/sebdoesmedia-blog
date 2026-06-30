// Curated, hand-written project details. These are merged OVER the auto-generated
// GitHub data (src/lib/github-projects.generated.ts) by src/lib/projects.ts, so
// anything you set here wins over what GitHub returned. This file is NOT
// overwritten by the build — edit it freely.
//
// Only set the fields you want to customise; omit the rest and the GitHub value
// (or the rendered README) is used. Keys are project ids (the lowercased repo
// slug, e.g. "questvault", "appropriated-kitchen").
//
// Fields you'll most likely want to set:
//   longDescription — a real paragraph for the "About" section. Takes precedence
//                     over the repo README. Use this when the README is messy or
//                     missing.
//   highlights      — bullet points shown under "Highlights" (string[]).
//   techStack       — override the auto-detected language list.
//   tags            — override the tag pills.
//   demo            — live demo / homepage URL (adds a "Live Demo" button).
//   status          — 'active' | 'planned' | 'archived'.
//   featured        — mark a project to feature (reserved for future use).
//
// Example:
//   questvault: {
//     longDescription:
//       "Questvault turns your to-do list into an RPG. Tasks become quests, " +
//       "an LLM breaks big goals into steps, and an MCP server lets agents " +
//       "read and update your board.",
//     highlights: [
//       "LLM-assisted task breakdown",
//       "MCP server for agent access",
//       "XP, levels, and streaks",
//     ],
//     demo: "https://questvault.example.com",
//   },

import type { Project } from './projects';

export const projectOverrides: Record<string, Partial<Project>> = {
  questvault: {},
  agentkernal: {},
  'prompt-playground': {},
  'sa3-studio': {},
  'appropriated-kitchen': {},
  'pi-wiki': {},
};
