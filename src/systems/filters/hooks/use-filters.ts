import { useCallback, useMemo } from 'react';

import { useNavigate, useSearchParams } from 'react-router';

import type { FilterConfig } from '../types';

export function useFilters(config: FilterConfig[]) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const filters = useMemo(() => {
    const result: Record<string, string | undefined> = {};

    searchParams.forEach((v, k) => {
      result[k] = v || undefined;
    });

    config.forEach(field => {
      if (!result[field.key] && field.defaultValue) {
        result[field.key] = field.defaultValue;
      }
    });

    return result;
  }, [searchParams, config]);

  /** `resetKeys` are dropped whenever filters are applied - pagination is the
   *  usual case, since a narrower filter must not land the user on an empty
   *  page 7. */
  const applyFilters = useCallback(
    (updates: Record<string, string | undefined>, resetKeys: string[] = []) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === '#') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      resetKeys.forEach(key => params.delete(key));

      navigate(`?${params.toString()}`, { replace: true });
    },
    [navigate, searchParams]
  );

  const clearAll = useCallback(() => {
    navigate('?', { replace: true });
  }, [navigate]);

  /** A field sitting on its own default is not a user-applied filter, so it must
   *  not light up the badge on a pristine screen. */
  const activeCount = useMemo(() => {
    return config.filter(field => {
      if (field.disabled) return false;
      const v = filters[field.key];
      if (field.defaultValue && v === field.defaultValue) return false;
      return v && v !== '#' && v !== 'all';
    }).length;
  }, [filters, config]);

  return { filters, applyFilters, clearAll, activeCount };
}
