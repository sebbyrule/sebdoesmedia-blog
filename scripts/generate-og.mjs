import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'content/posts');
const outDir = path.join(root, 'public/og');

const width = 1200;
const height = 630;

async function loadFont(file) {
  return fs.readFile(path.join(root, 'node_modules/@fontsource/inter/files', file));
}

async function generateOG(post) {
  const interNormal = await loadFont('inter-latin-400-normal.woff');
  const interBold = await loadFont('inter-latin-700-normal.woff');

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#f8fafc',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: 28, fontWeight: 700, color: '#60a5fa' },
                    children: 'Sebdoesmedia',
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: 20, color: '#94a3b8' },
                    children: post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: 24 },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: { fontSize: 64, fontWeight: 700, lineHeight: 1.1, margin: 0 },
                    children: post.title,
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 28, color: '#cbd5e1', lineHeight: 1.4, margin: 0 },
                    children: post.excerpt || 'Read more on Sebdoesmedia',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', gap: 12, flexWrap: 'wrap' },
              children: (post.tags || []).slice(0, 5).map((tag) => ({
                type: 'span',
                props: {
                  style: {
                    background: 'rgba(96, 165, 250, 0.15)',
                    color: '#60a5fa',
                    padding: '8px 16px',
                    borderRadius: 9999,
                    fontSize: 20,
                    fontWeight: 500,
                  },
                  children: tag,
                },
              })),
            },
          },
        ],
      },
    },
    {
      width,
      height,
      fonts: [
        { name: 'Inter', data: interNormal, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  await fs.writeFile(path.join(outDir, `${post.slug}.png`), pngBuffer);
  console.log(`✓ Generated OG image for ${post.slug}`);
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const fileNames = await fs.readdir(postsDir);
  const mdFiles = fileNames.filter((f) => f.endsWith('.md'));

  for (const fileName of mdFiles) {
    const slug = fileName.replace(/\.md$/, '');
    const content = await fs.readFile(path.join(postsDir, fileName), 'utf8');
    const { data } = matter(content);
    await generateOG({ slug, ...data });
  }

  console.log('OG image generation complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
