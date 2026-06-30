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

function loadFont(pkg, file) {
  return fs.readFile(path.join(root, 'node_modules/@fontsource', pkg, 'files', file));
}

// Studio Dusk palette
const COLORS = {
  bg: '#1C1719', // warm aubergine near-black
  sand: '#EDE3D9', // primary text
  muted: '#A99A8A', // warm muted text
  marigold: '#E8A33D', // primary accent
  tagBg: 'rgba(232, 163, 61, 0.14)',
};

async function generateOG(post) {
  const interNormal = await loadFont('inter', 'inter-latin-400-normal.woff');
  const interMedium = await loadFont('inter', 'inter-latin-500-normal.woff');
  const serifNormal = await loadFont('dm-serif-display', 'dm-serif-display-latin-400-normal.woff');
  const serifItalic = await loadFont('dm-serif-display', 'dm-serif-display-latin-400-italic.woff');

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
          padding: 72,
          background: COLORS.bg,
          color: COLORS.sand,
          fontFamily: 'Inter',
          borderTop: `10px solid ${COLORS.marigold}`,
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', fontFamily: 'DM Serif Display', fontSize: 32, color: COLORS.sand },
                    children: [
                      { type: 'span', props: { children: 'Seb' } },
                      { type: 'span', props: { style: { fontStyle: 'italic', color: COLORS.marigold }, children: 'does' } },
                      { type: 'span', props: { children: 'media' } },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: 20, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 2 },
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
                    style: { fontFamily: 'DM Serif Display', fontSize: 68, lineHeight: 1.08, letterSpacing: -1, margin: 0, color: COLORS.sand },
                    children: post.title,
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 28, color: COLORS.muted, lineHeight: 1.45, margin: 0 },
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
                    background: COLORS.tagBg,
                    color: COLORS.marigold,
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
        { name: 'Inter', data: interMedium, weight: 500, style: 'normal' },
        { name: 'DM Serif Display', data: serifNormal, weight: 400, style: 'normal' },
        { name: 'DM Serif Display', data: serifItalic, weight: 400, style: 'italic' },
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
