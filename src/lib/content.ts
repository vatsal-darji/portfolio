import type { CollectionEntry } from "astro:content";

export function sortByDateDesc<T extends CollectionEntry<"blog">>(items: T[]) {
  return [...items].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
