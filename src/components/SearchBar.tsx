"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        setOpen(false);
        setQuery("");
      }
    },
    [query, router],
  );

  return (
    <>
      {/* Desktop search icon */}
      <button
        onClick={() => setOpen(!open)}
        className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg border bg-background hover:bg-muted transition-all duration-200"
        aria-label="Search"
      >
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </button>

      {/* Desktop expanded search */}
      {open && (
        <div className="hidden sm:block absolute top-full right-0 mt-2 w-72 p-3 bg-card border rounded-xl shadow-lg z-50">
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts…"
              className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </form>
        </div>
      )}

      {/* Mobile search link */}
      <Link
        href="/search"
        className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border bg-background hover:bg-muted transition-all duration-200"
        aria-label="Search"
      >
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </Link>
    </>
  );
}