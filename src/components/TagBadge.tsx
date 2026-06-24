const tagColors: Record<string, string> = {
  announcement:
    "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  tutorial: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  tech: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  media: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  design: "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300",
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