// Studio Dusk tag palette — warm, low-saturation, drawn from the brand spectrum
const tagColors: Record<string, string> = {
  announcement:
    "bg-primary/12 text-primary dark:bg-primary/15",
  tutorial:
    "bg-[oklch(0.58_0.06_145_/_0.14)] text-[oklch(0.42_0.07_145)] dark:text-[oklch(0.74_0.08_145)]",
  tech:
    "bg-accent/12 text-accent dark:bg-accent/18 dark:text-[oklch(0.72_0.11_42)]",
  media:
    "bg-[oklch(0.68_0.1_95_/_0.16)] text-[oklch(0.45_0.1_85)] dark:text-[oklch(0.78_0.1_92)]",
  design:
    "bg-[oklch(0.5_0.09_350_/_0.14)] text-[oklch(0.45_0.1_350)] dark:text-[oklch(0.74_0.09_350)]",
};

export function TagBadge({ tag }: { tag: string }) {
  const colorClass =
    tagColors[tag.toLowerCase()] ||
    "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {tag}
    </span>
  );
}