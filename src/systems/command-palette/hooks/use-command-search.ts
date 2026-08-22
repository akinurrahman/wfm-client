import { useMemo, useState } from 'react';

import { rankCommandItems } from '../rank';
import { type CommandItem } from '../types';

export function useCommandSearch(items: CommandItem[]) {
  const [query, setQueryValue] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  const results = useMemo(() => rankCommandItems(items, query), [items, query]);

  // clamp during render so a shrinking result list never points past the end
  const activeIndex = results.length ? Math.min(highlighted, results.length - 1) : 0;
  const activeItem = results[activeIndex];

  const setQuery = (value: string) => {
    setQueryValue(value);
    setHighlighted(0);
  };

  const moveHighlight = (delta: number) => {
    if (!results.length) return;
    const next = (activeIndex + delta + results.length) % results.length;
    setHighlighted(next);
  };

  const reset = () => {
    setQueryValue('');
    setHighlighted(0);
  };

  return {
    query,
    setQuery,
    results,
    activeIndex,
    activeItem,
    setHighlighted,
    moveHighlight,
    reset,
  };
}
