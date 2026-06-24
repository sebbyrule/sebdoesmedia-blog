"use client";

import { useEffect } from "react";

export function CodeBlockCopy() {
  useEffect(() => {
    const pres = document.querySelectorAll<HTMLPreElement>(".prose pre");

    for (const pre of pres) {
      // Skip if already enhanced
      if (pre.querySelector('[data-copy-btn]')) continue;

      const btn = document.createElement("button");
      btn.dataset.copyBtn = "true";
      btn.className =
        "absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-md bg-muted border text-muted-foreground hover:bg-background hover:text-foreground transition-colors opacity-0 group-hover/pre:opacity-100 focus:opacity-100";
      btn.textContent = "Copy";

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code.textContent || "");
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2000);
        } catch {
          btn.textContent = "Failed";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2000);
        }
      });

      pre.style.position = "relative";
      pre.classList.add("group/pre");
      pre.appendChild(btn);
    }
  }, []);

  return null;
}