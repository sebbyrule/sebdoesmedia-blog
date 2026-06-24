import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Sebdoesmedia",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ?
          </span>
        </div>
      </div>
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        This page doesn&apos;t exist yet — or maybe it wandered off. 
        Either way, let&apos;s get you back on track.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 transition-all duration-200"
        >
          Go Home
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-12 items-center justify-center rounded-xl border bg-background px-8 text-sm font-medium hover:bg-muted transition-all duration-200"
        >
          Read the Blog
        </Link>
      </div>
    </div>
  );
}