import { useMemo } from 'react';

import { resolveRoute } from './resolve-route';

type RouteParams = Record<string, string | number | null | undefined>;

export function useResolvedRoute(externalParams?: RouteParams) {
  const routeParams = useMemo(() => ({ ...externalParams }), [externalParams]);

  const resolvedUrl = useMemo(() => (url: string) => resolveRoute(url, routeParams), [routeParams]);

  return { resolvedUrl, routeParams };
}
