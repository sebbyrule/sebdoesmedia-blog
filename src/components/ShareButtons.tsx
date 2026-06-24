"use client";

import { useState } from "react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // noop (user cancelled)
      }
    }
  };

  const shareLinks = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Bluesky",
      href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title}\n${url}`)}`,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.99C2.566.95 1.561 1.422 1.07 2.284c-.46.81-.583 1.912-.452 3.168.17 1.581.7 3.36 1.42 5.095 1.186 2.778 2.54 4.156 3.59 4.156.593 0 1.197-.388 1.78-1.152.582-.765 1.064-1.608 1.357-2.271.186-.418.364-.768.526-1.02.162.252.34.602.526 1.02.293.663.775 1.506 1.357 2.271.583.764 1.187 1.152 1.78 1.152 1.05 0 2.404-1.378 3.59-4.156.72-1.735 1.25-3.514 1.42-5.095.13-1.256.008-2.358-.452-3.168-.49-.862-1.496-1.334-3.132-2.474-2.752 1.937-5.711 5.876-6.798 7.99zM12 19.8c-.895 0-1.683-.625-2.502-1.706-.82-1.08-1.35-2.156-1.67-2.883-.16-.363-.3-.644-.414-.81a2.97 2.97 0 00-.414.81c-.32.727-.85 1.803-1.67 2.883C4.913 19.175 4.125 19.8 3.23 19.8c-1.906 0-3.5-1.696-4.496-4.7C-1.79 12.16-1.966 9.5-1.5 7.5c.366-1.545 1.34-2.573 3.05-3.236C3.92 3.64 6.48 3.8 8.22 5.32c1.19 1.04 2.63 2.84 3.78 4.48 1.15-1.64 2.59-3.44 3.78-4.48 1.74-1.52 4.3-1.68 6.67-.056 1.71.663 2.684 1.69 3.05 3.236.466 2 .29 4.66-.734 7.6-.996 3.004-2.59 4.7-4.496 4.7-.895 0-1.683-.625-2.502-1.706-.82-1.08-1.35-2.156-1.67-2.883-.16-.363-.3-.644-.414-.81a2.97 2.97 0 00-.414.81c-.32.727-.85 1.803-1.67 2.883C13.683 19.175 12.895 19.8 12 19.8z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">Share:</span>
      {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border bg-background hover:bg-muted transition-colors"
          aria-label="Share"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      )}
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border bg-background hover:bg-muted transition-colors"
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
          {link.name}
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border bg-background hover:bg-muted transition-colors"
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
