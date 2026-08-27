import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_DEBOUNCE_MS, DEFAULT_PAGE_SIZE } from '../constants';
import type { AsyncFetchFn, Option } from '../types';

type Options = {
  fetchOptions: AsyncFetchFn;
  parentValue?: string;
  parentValues?: Record<string, string | undefined>;
  /** False stops every fetch. Used to gate on popup open plus parent presence. */
  enabled?: boolean;
  pageSize?: number;
  debounceMs?: number;
  /** Seeds the label cache so an edit-mode trigger shows a label before the
   *  first fetch lands. */
  initialOptions?: Option[];
};

type Result = {
  /** Which search and parent combination these options answer. */
  key: string;
  page: number;
  options: Option[];
  hasMore: boolean;
};

/** Server-side search, page-at-a-time loading, abort on change, and a value to
 *  label cache that outlives the option list a trigger was built from. */
export function useAsyncOptions({
  fetchOptions,
  parentValue,
  parentValues,
  enabled = true,
  pageSize = DEFAULT_PAGE_SIZE,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  initialOptions,
}: Options) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // A plain Map rather than state: it is written from fetch callbacks and read
  // when rendering a trigger, and a mutation to it never has to repaint on its
  // own, since the option list that caused it repaints anyway.
  const [labels] = useState<Map<string, string>>(
    () => new Map(initialOptions?.map(option => [option.value, option.label]))
  );

  useEffect(() => {
    if (!initialOptions) return;
    for (const option of initialOptions) labels.set(option.value, option.label);
  }, [initialOptions, labels]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), debounceMs);
    return () => clearTimeout(timer);
  }, [search, debounceMs]);

  // Every input the server cares about, collapsed into one identity. A change to
  // any of them invalidates the pages already loaded.
  const requestKey = JSON.stringify([debouncedSearch, parentValue, parentValues ?? null]);

  const [requested, setRequested] = useState({ key: requestKey, page: 1 });
  const [result, setResult] = useState<Result>({
    key: requestKey,
    page: 0,
    options: [],
    hasMore: false,
  });

  // Adjusting during render rather than in an effect, so a new search never
  // paints one frame of the previous query's results.
  if (requested.key !== requestKey) {
    setRequested({ key: requestKey, page: 1 });
  }
  const page = requested.key === requestKey ? requested.page : 1;

  const fresh = result.key === requestKey;
  const options = fresh ? result.options : [];
  const hasMore = fresh ? result.hasMore : false;
  const loading = enabled && !(fresh && result.page === page);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    let cancelled = false;

    fetchOptions({
      search: debouncedSearch,
      page,
      limit: pageSize,
      parentValue,
      parentValues,
      signal: controller.signal,
    })
      .then(response => {
        if (cancelled || controller.signal.aborted) return;
        for (const option of response.options) labels.set(option.value, option.label);
        setResult(previous => ({
          key: requestKey,
          page,
          options:
            page === 1 || previous.key !== requestKey
              ? response.options
              : [...previous.options, ...response.options],
          hasMore: response.hasMore,
        }));
      })
      .catch(() => {
        // A picker that cannot load is not a reason to take the form down, but
        // the request still has to settle or the list spins forever.
        if (cancelled) return;
        setResult(previous =>
          previous.key === requestKey
            ? { ...previous, page }
            : { key: requestKey, page, options: [], hasMore: false }
        );
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, requestKey, page, pageSize, fetchOptions]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setRequested(current => ({ key: current.key, page: current.page + 1 }));
  }, [loading, hasMore]);

  const getLabel = useCallback((value: string) => labels.get(value) ?? value, [labels]);

  return { options, hasMore, loading, search, setSearch, loadMore, getLabel };
}
