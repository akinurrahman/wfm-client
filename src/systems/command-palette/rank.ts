import { type CommandItem } from './types';

/** Lower is a better match; -1 means no match at all. */
function scoreText(text: string, query: string): number {
  const haystack = text.toLowerCase();

  if (haystack.startsWith(query)) return 0;

  const wordStart = haystack.split(/[\s\-/]+/).some(word => word.startsWith(query));
  if (wordStart) return 1;

  if (haystack.includes(query)) return 2;

  // subsequence, so "emgmt" still finds "Employee Management"
  let cursor = 0;
  for (const char of query) {
    cursor = haystack.indexOf(char, cursor) + 1;
    if (cursor === 0) return -1;
  }
  return 3;
}

function scoreItem(item: CommandItem, query: string): number {
  const title = scoreText(item.title, query);
  if (title !== -1) return title;

  const parent = item.parent ? scoreText(item.parent, query) : -1;
  if (parent !== -1) return parent + 4;

  const group = scoreText(item.group, query);
  if (group !== -1) return group + 8;

  return -1;
}

export function rankCommandItems(items: CommandItem[], rawQuery: string): CommandItem[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return items;

  return items
    .map(item => ({ item, score: scoreItem(item, query) }))
    .filter(entry => entry.score !== -1)
    .sort((a, b) => a.score - b.score || a.item.title.localeCompare(b.item.title))
    .map(entry => entry.item);
}
