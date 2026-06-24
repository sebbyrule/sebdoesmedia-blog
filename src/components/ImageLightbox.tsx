"use client";

import { useEffect, useState, useCallback } from "react";

export function ImageLightbox() {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  const openLightbox = useCallback((url: string) => {
    setSrc(url);
    setOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setOpen(false);
    setSrc(null);
  }, []);

  useEffect(() => {
    const images = document.querySelectorAll<HTMLImageElement>(".prose img");

    const onClick = (e: Event) => {
      const target = e.currentTarget as HTMLImageElement;
      if (target.src) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(target.src);
      }
    };

    images.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", onClick);
    });

    return () => {
      images.forEach((img) => img.removeEventListener("click", onClick));
    };
  }, [openLightbox]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeLightbox]);

  if (!open || !src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        onClick={closeLightbox}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close image preview"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Enlarged view"
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
