import { getPosts } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();
  const index = posts.map(({ slug, title, excerpt, date, tags, readingTime }) => ({
    slug,
    title,
    excerpt,
    date,
    tags,
    readingTime,
  }));
  return Response.json(index);
}