import { useLocation } from 'react-router';

export function useResolvedActiveRoute(
  resolvedUrl: (url: string) => string,
  /** Every top-level nav url. Prefix matching is what keeps `/employees`
   *  highlighted on `/employees/:id/edit`, but it also lights up `/attendance`
   *  while `/attendance/tools` is open. Passing the full set lets the longest
   *  match win, so only one sibling is ever active. */
  candidateUrls: string[] = []
) {
  const { pathname } = useLocation();

  const matches = (url: string) => {
    const resolved = resolvedUrl(url);
    return pathname === resolved || pathname.startsWith(`${resolved}/`);
  };

  const bestMatchLength = candidateUrls.reduce(
    (longest, url) => (matches(url) ? Math.max(longest, resolvedUrl(url).length) : longest),
    0
  );

  const isRouteActive = (url: string) =>
    matches(url) && resolvedUrl(url).length >= bestMatchLength;

  const isExact = (url: string) => pathname === resolvedUrl(url);

  return { pathname, isRouteActive, isExact };
}
