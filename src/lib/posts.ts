import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export type PostFormat = 'article' | 'podcast' | 'video' | 'gallery';

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readingTime: string;
  tags: string[];
  image?: string;
  format: PostFormat;
  audio?: string;
  video?: string;
  gallery?: string[];
  series?: string;
  seriesOrder?: number;
};

export type Heading = {
  level: number;
  text: string;
  id: string;
};

export type LintIssue = {
  slug: string;
  type: 'error' | 'warning';
  message: string;
};

function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({ level, text, id: slugify(text) });
  }
  return headings;
}

function normalizeFormat(value: unknown): PostFormat {
  const formats: PostFormat[] = ['article', 'podcast', 'video', 'gallery'];
  return formats.includes(value as PostFormat) ? (value as PostFormat) : 'article';
}

export async function getPosts(): Promise<Post[]> {
  const fileNames = await fs.readdir(postsDirectory);
  const mdFiles = fileNames.filter(fileName => fileName.endsWith('.md'));

  const posts = await Promise.all(mdFiles.map(async (fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const format = normalizeFormat(data.format);

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      excerpt: data.excerpt || '',
      content,
      readingTime: calculateReadingTime(content),
      tags: data.tags || [],
      image: data.image || undefined,
      format,
      audio: data.audio || undefined,
      video: data.video || undefined,
      gallery: data.gallery || undefined,
      series: data.series || undefined,
      seriesOrder: typeof data.seriesOrder === 'number' ? data.seriesOrder : undefined,
    };
  }));

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getAllSlugs(): Promise<string[]> {
  const fileNames = await fs.readdir(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}

export function getPrevNextPosts(
  posts: Post[],
  currentSlug: string,
): { prev: Post | null; next: Post | null } {
  const index = posts.findIndex((p) => p.slug === currentSlug);
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export function getSeriesPosts(posts: Post[], seriesName: string): Post[] {
  return posts
    .filter((p) => p.series === seriesName)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}

export function getRelatedPosts(
  posts: Post[],
  current: Post,
  limit: number = 3,
): Post[] {
  const scored = posts
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      const sharedTags = p.tags.filter((tag) => current.tags.includes(tag));
      return { post: p, score: sharedTags.length };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    });

  return scored.slice(0, limit).map((s) => s.post);
}

export async function lintPosts(): Promise<{ posts: Post[]; issues: LintIssue[]; stats: { total: number; totalWords: number; avgReadingTime: number; missingImages: number; missingTags: number; missingExcerpts: number } }> {
  const posts = await getPosts();
  const issues: LintIssue[] = [];

  for (const post of posts) {
    if (!post.title || post.title === post.slug) {
      issues.push({ slug: post.slug, type: 'error', message: 'Missing or fallback title' });
    }
    if (!post.date) {
      issues.push({ slug: post.slug, type: 'error', message: 'Missing date' });
    }
    if (!post.excerpt) {
      issues.push({ slug: post.slug, type: 'warning', message: 'Missing excerpt (used for SEO and cards)' });
    }
    if (post.tags.length === 0) {
      issues.push({ slug: post.slug, type: 'warning', message: 'No tags' });
    }
    if (post.format === 'article' && !post.image) {
      issues.push({ slug: post.slug, type: 'warning', message: 'Article has no hero image' });
    }
    if (post.format === 'podcast' && !post.audio) {
      issues.push({ slug: post.slug, type: 'error', message: 'Podcast format requires audio URL' });
    }
    if (post.format === 'video' && !post.video) {
      issues.push({ slug: post.slug, type: 'error', message: 'Video format requires video URL' });
    }
    if (post.format === 'gallery' && (!post.gallery || post.gallery.length === 0)) {
      issues.push({ slug: post.slug, type: 'error', message: 'Gallery format requires gallery images' });
    }
    if (post.series && typeof post.seriesOrder !== 'number') {
      issues.push({ slug: post.slug, type: 'warning', message: 'In series but missing seriesOrder' });
    }
  }

  const totalWords = posts.reduce((sum, p) => sum + p.content.trim().split(/\s+/).length, 0);
  const avgReadingTime = posts.length ? Math.round(posts.reduce((sum, p) => sum + parseInt(p.readingTime, 10), 0) / posts.length) : 0;

  return {
    posts,
    issues,
    stats: {
      total: posts.length,
      totalWords,
      avgReadingTime,
      missingImages: posts.filter((p) => p.format === 'article' && !p.image).length,
      missingTags: posts.filter((p) => p.tags.length === 0).length,
      missingExcerpts: posts.filter((p) => !p.excerpt).length,
    },
  };
}
