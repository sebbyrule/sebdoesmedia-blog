import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";

// Studio Dusk type system: DM Serif Display (headings) + DM Sans (body)
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const dmSerif = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-heading",
});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sebdoesmedia | A Blog About Media and Technology",
  description: "A blog about media, technology, and everything in between.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const socialLinks = [
  {
    label: "YouTube",
    href: "https://youtube.com/@sebdoesmedia",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/sebdoesmedia",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/sebdoesmedia",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", dmSerif.variable, geistMono.variable, "font-sans", dmSans.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="border-b border-border/70 bg-background/85 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-display text-2xl text-foreground tracking-tight">
              Seb<span className="italic text-primary">does</span>media
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">Home</Link>
              <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-primary">Posts</Link>
              <Link href="/archive" className="text-sm text-muted-foreground transition-colors hover:text-primary">Archive</Link>
              <Link href="/projects" className="text-sm text-muted-foreground transition-colors hover:text-primary">Projects</Link>
              <Link href="/now" className="text-sm text-muted-foreground transition-colors hover:text-primary">Now</Link>
              <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">About</Link>
              <div className="relative flex items-center gap-2 pl-1">
                <SearchBar />
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-1 container mx-auto py-10 px-4">
          {children}
        </main>

        <footer className="border-t border-border/70 py-12 mt-auto bg-secondary/40">
          <div className="container mx-auto px-4 grid gap-6">
            <div className="text-center">
              <Link href="/" className="font-display text-xl text-foreground tracking-tight">
                Seb<span className="italic text-primary">does</span>media
              </Link>
            </div>
            <div className="flex justify-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            <div className="text-center text-muted-foreground text-sm">
              <p>© {new Date().getFullYear()} Sebdoesmedia — media &amp; technology, from the studio.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}