import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now | Sebdoesmedia",
  description: "What Sebdoesmedia is focused on right now.",
};

export default function NowPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">Now</h1>
      <p className="text-muted-foreground mb-8">
        This is a{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          now page
        </a>
        . It reflects what I’m focused on at this point in time.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Projects</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Building out the Sebdoesmedia blog and content pipeline.</li>
            <li>Experimenting with new media formats: podcast, video essays, and galleries.</li>
            <li>Exploring AI tooling for creative production and publishing workflows.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Learning</h2>
          <p className="text-muted-foreground">
            Deep-diving into Next.js App Router patterns, Cloudflare edge runtimes, and modern
            Tailwind CSS workflows.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Reading & Watching</h2>
          <p className="text-muted-foreground">
            A mix of indie media business newsletters, Next.js conference talks, and classic sci-fi
            films.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Listening</h2>
          <p className="text-muted-foreground">
            A rotating playlist of synthwave, lo-fi, and podcast episodes about the future of media.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-gray-500">Last updated: June 2026</p>
    </main>
  );
}
