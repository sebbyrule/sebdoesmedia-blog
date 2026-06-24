import type { ReactElement } from "react";

export type IconName = "monitor" | "zap" | "tools";

const iconPaths: Record<IconName, ReactElement> = {
  monitor: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  ),
  zap: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  ),
  tools: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
  ),
};

export function ProjectIcon({
  icon,
  size = "sm",
}: {
  icon: IconName;
  size?: "sm" | "lg";
}) {
  const className =
    size === "lg"
      ? "w-12 h-12 text-white"
      : "w-6 h-6 text-white";

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {iconPaths[icon]}
    </svg>
  );
}