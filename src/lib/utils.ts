/**
 * Format km driven for display
 * e.g. 45000 → "45,000"
 */
export function formatKm(km: number): string {
  return km.toLocaleString("en-IN");
}

/**
 * Format km driven in short form
 * e.g. 45000 → "45K"
 */
export function formatKmShort(km: number): string {
  if (km >= 100000) return `${(km / 100000).toFixed(1)}L`;
  if (km >= 1000) return `${Math.round(km / 1000)}K`;
  return km.toString();
}

/**
 * Get relative time since listing was added
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Truncate text to given length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

/**
 * Slugify a car name for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Get ownership badge color class name
 */
export function getOwnershipColor(ownership: string): string {
  if (ownership === "1st Owner") return "ownership-first";
  if (ownership === "2nd Owner") return "ownership-second";
  return "ownership-third";
}
