// Build-time fetch of public GitHub repos -> generated Project data.
// Runs in prebuild / pages:build (never at runtime — keeps the site Workers-safe
// and within GitHub's unauthenticated rate limit). Output is committed so the
// build still succeeds if GitHub is unreachable.
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outFile = path.join(root, 'src/lib/github-projects.generated.ts');

const USERNAME = 'sebbyrule';

// Repos to never show as projects (the site itself, etc.).
const EXCLUDE = new Set(['sebdoesmedia', 'sebdoesmedia-blog']);

// Gradient palette + deterministic assignment.
// Studio Dusk: warm marigold/clay/amber/sage tones — no stock blue/purple.
const GRADIENTS = [
  'from-amber-500 to-orange-600',
  'from-orange-600 to-rose-700',
  'from-yellow-500 to-amber-600',
  'from-stone-500 to-stone-700',
  'from-rose-500 to-orange-700',
  'from-lime-600 to-emerald-700',
  'from-amber-600 to-yellow-700',
  'from-red-600 to-amber-700',
];

function iconForLanguage(lang) {
  if (lang === 'Python') return 'zap';
  if (['TypeScript', 'JavaScript', 'HTML', 'CSS'].includes(lang)) return 'monitor';
  return 'tools';
}

function slugify(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // split camelCase: AppropriatedKitchen -> Appropriated-Kitchen
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function prettify(name) {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // split camelCase
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

const GH_HEADERS = {
  'User-Agent': `${USERNAME}-blog-build`,
  Accept: 'application/vnd.github+json',
};

const README_MAX = 16000;

// Light README cleanup: drop HTML comments, rewrite relative image/link URLs to
// absolute GitHub URLs (so they resolve off-site), and cap the length.
function cleanReadme(md, repo) {
  if (!md) return undefined;
  const owner = repo.owner?.login || USERNAME;
  const name = repo.name;
  const branch = repo.default_branch || 'main';
  const rawBase = `https://raw.githubusercontent.com/${owner}/${name}/${branch}/`;
  const blobBase = `https://github.com/${owner}/${name}/blob/${branch}/`;

  let out = md.replace(/<!--[\s\S]*?-->/g, '');

  const isAbsolute = (u) => /^(https?:|mailto:|#|\/)/i.test(u);
  // Markdown images: ![alt](relpath)
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)([^)]*)\)/g, (m, alt, url, rest) =>
    isAbsolute(url) ? m : `![${alt}](${rawBase}${url.replace(/^\.\//, '')}${rest})`,
  );
  // Markdown links: [text](relpath) — but not images (handled above)
  out = out.replace(/(^|[^!])\[([^\]]+)\]\(([^)\s]+)([^)]*)\)/g, (m, pre, text, url, rest) =>
    isAbsolute(url) ? m : `${pre}[${text}](${blobBase}${url.replace(/^\.\//, '')}${rest})`,
  );

  out = out.trim();
  if (out.length > README_MAX) {
    out = out.slice(0, README_MAX).replace(/\n[^\n]*$/, '') + '\n\n…';
  }
  return out || undefined;
}

async function fetchReadme(repo) {
  const owner = repo.owner?.login || USERNAME;
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/readme`, {
      headers: { ...GH_HEADERS, Accept: 'application/vnd.github.raw+json' },
    });
    if (!res.ok) return undefined;
    return cleanReadme(await res.text(), repo);
  } catch {
    return undefined;
  }
}

async function fetchLanguages(repo) {
  const owner = repo.owner?.login || USERNAME;
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/languages`, {
      headers: GH_HEADERS,
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Sort by byte count, most-used first.
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  } catch {
    return [];
  }
}

async function toProject(repo, index) {
  const language = repo.language || undefined;
  const topics = repo.topics || [];
  const [readme, languages] = await Promise.all([fetchReadme(repo), fetchLanguages(repo)]);
  const techStack = languages.length ? languages : uniq([language, ...topics]);
  const tags = topics.length ? topics : uniq([language]);
  return {
    id: slugify(repo.name),
    title: prettify(repo.name),
    description: repo.description || '',
    longDescription: repo.description || '',
    tags,
    techStack,
    gradient: GRADIENTS[index % GRADIENTS.length],
    icon: iconForLanguage(language),
    url: `/projects/${slugify(repo.name)}`,
    github: repo.html_url,
    demo: repo.homepage ? repo.homepage : undefined,
    homepage: repo.homepage || undefined,
    status: repo.archived ? 'archived' : 'active',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language,
    license: repo.license?.spdx_id && repo.license.spdx_id !== 'NOASSERTION' ? repo.license.spdx_id : undefined,
    createdAt: repo.created_at,
    updatedAt: repo.pushed_at,
    readme,
  };
}

async function main() {
  const url = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;
  let repos;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': `${USERNAME}-blog-build`,
        Accept: 'application/vnd.github+json',
      },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`);
    repos = await res.json();
    if (!Array.isArray(repos)) throw new Error('Unexpected GitHub API response');
  } catch (err) {
    console.warn(`⚠ GitHub fetch failed (${err.message}).`);
    if (await fileExists(outFile)) {
      console.warn('  Keeping existing generated projects file.');
      return;
    }
    console.warn('  Writing empty projects file.');
    await writeProjects([]);
    return;
  }

  const selected = repos
    .filter((r) => !r.fork && !EXCLUDE.has(r.name) && (r.description || '').trim().length > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at));

  // Enrich each repo with its README + language breakdown (2 calls per repo).
  const projects = await Promise.all(selected.map((repo, i) => toProject(repo, i)));

  await writeProjects(projects);
  console.log(`✓ Generated ${projects.length} GitHub projects -> ${path.relative(root, outFile)}`);
  for (const p of projects) console.log(`  • ${p.title} (${p.language || 'n/a'})`);
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function writeProjects(projects) {
  const body = `// AUTO-GENERATED by scripts/fetch-github-projects.mjs — do not edit by hand.
// Regenerated on every build (prebuild / pages:build).
import type { Project } from "./projects";

export const githubProjects: Project[] = ${JSON.stringify(projects, null, 2)};
`;
  await fs.writeFile(outFile, body);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
