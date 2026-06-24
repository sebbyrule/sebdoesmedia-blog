"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function AudioPlayer({ src, label = "Listen to this post" }: { src: string; label?: string }) {
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [supported] = useState(() => {
    if (typeof window === "undefined") return true;
    return "speechSynthesis" in window;
  });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const buildUtterance = useCallback(() => {
    if (typeof window === "undefined") return null;
    const article = document.querySelector("article");
    const text = article ? article.textContent || "" : "";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    return utterance;
  }, [rate]);

  const toggle = () => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;

    if (playing) {
      synth.cancel();
      setPlaying(false);
    } else {
      // If a URL is provided, prefer native audio element
      if (src) {
        const audio = new Audio(src);
        audio.playbackRate = rate;
        audio.play();
        return;
      }
      const utterance = buildUtterance();
      if (utterance) {
        utteranceRef.current = utterance;
        synth.cancel();
        synth.speak(utterance);
        setPlaying(true);
      }
    }
  };

  const changeRate = (newRate: number) => {
    setRate(newRate);
    if (playing) {
      toggle();
      setTimeout(() => toggle(), 50);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (src) {
    return (
      <div className="border rounded-xl p-4 bg-muted/30">
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          {label}
        </p>
        <audio controls className="w-full" src={src} preload="metadata">
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  if (!supported) return null;

  return (
    <div className="inline-flex items-center gap-3 border rounded-full pl-4 pr-2 py-2 bg-muted/30">
      <button
        onClick={toggle}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        aria-label={playing ? "Pause reading" : "Listen to this post"}
      >
        {playing ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
            Pause
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
            </svg>
            Listen
          </>
        )}
      </button>
      <div className="h-4 w-px bg-border" />
      <select
        value={rate}
        onChange={(e) => changeRate(parseFloat(e.target.value))}
        className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer"
      >
        <option value={0.75}>0.75×</option>
        <option value={1}>1×</option>
        <option value={1.25}>1.25×</option>
        <option value={1.5}>1.5×</option>
        <option value={2}>2×</option>
      </select>
    </div>
  );
}
