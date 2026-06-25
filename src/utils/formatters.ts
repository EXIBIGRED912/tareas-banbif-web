export const parseTags = (tags?: string[] | string) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  } catch {
    return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
};

export const unique = <T,>(items: T[]) => Array.from(new Set(items));
