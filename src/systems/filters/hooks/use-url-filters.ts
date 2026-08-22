import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useSearchParams } from 'react-router';

/** `null` is accepted alongside `undefined` because that is what a cleared
 *  Base UI select hands back, and `String(null)` would otherwise put the
 *  literal "null" in the URL. Both mean "drop this param". */
export type UrlFilterValue = string | string[] | number | null | undefined;

/** The parts of a field declaration that do not depend on what it holds. */
interface UrlFilterFieldBase {
  /** The URL search-param name. Defaults to the object key, so only a field
   *  whose wire name differs - `customerType` as `type` - needs to say so. */
  param?: string;
  /** A view preference rather than a filter - excluded from `isFiltered`, so
   *  sort order does not make "Clear filters" appear on a pristine screen. */
  view?: boolean;
  /** Excluded from `criteria`. Paging is never part of a saved preset. */
  transient?: boolean;
  /** The page cursor. Any write that narrows the result set clears it, so a
   *  new filter cannot land the user on an empty page 7. Writes that only
   *  touch `view` fields leave it alone. */
  pager?: boolean;
}

/** A default may be a thunk, resolved once per mount, for defaults like "today"
 *  that must not drift mid-session. */
type Defaultable<V> = V | (() => V);

type ListFieldInput<V extends readonly unknown[]> = UrlFilterFieldBase & {
  kind: 'list';
  defaultValue?: Defaultable<V>;
  /** Accepted entries. Anything else in the URL is dropped; if nothing
   *  survives, the field falls back to its default. Pass a lookup's `.values`. */
  values?: readonly V[number][];
};

type NumberFieldInput = UrlFilterFieldBase & {
  kind: 'number';
  defaultValue?: Defaultable<number>;
  /** Bounds are clamped rather than rejected, so `?page=-4` reads as page 1
   *  instead of failing the request. */
  min?: number;
  max?: number;
};

type StringFieldInput<V extends string> = UrlFilterFieldBase & {
  kind?: 'string';
  defaultValue?: Defaultable<V>;
  /** Accepted values. Anything else falls back to the default, so a hand-edited
   *  `?status=BANANA` cannot reach the API wearing the type of a real enum
   *  member. Pass a lookup's `.values`. */
  values?: readonly V[];
};

/** Picks the declaration shape from what the field actually holds, so `kind`
 *  and `defaultValue` cannot contradict the filter type: an array field must
 *  say `kind: 'list'`, a number field `kind: 'number'`.
 *
 *  The checks are wrapped in tuples to stop the conditional distributing over
 *  union members - without that, a `CustomerStatus` field would resolve to a
 *  union of per-literal shapes and reject `values: customerStatusLookup.values`. */
export type UrlFilterFieldInput<V> = [NonNullable<V>] extends [readonly unknown[]]
  ? ListFieldInput<NonNullable<V> & readonly unknown[]>
  : [NonNullable<V>] extends [number]
    ? NumberFieldInput
    : [NonNullable<V>] extends [string]
      ? StringFieldInput<NonNullable<V> & string>
      : UrlFilterFieldBase;

/** A field once its param name has been resolved. The runtime shape is the
 *  union of every input shape, since the hook reads them all the same way. */
export interface UrlFilterField extends UrlFilterFieldBase {
  param: string;
  kind?: 'string' | 'number' | 'list';
  defaultValue?: Defaultable<string | number | string[]>;
  values?: readonly string[];
  min?: number;
  max?: number;
}

/** Every key of the filter type needs an entry, so adding a field to the type
 *  fails to compile until it says how it is read. */
export type UrlFilterSpecInput<T> = {
  [K in keyof Required<T>]: UrlFilterFieldInput<Required<T>[K]>;
};

type UrlFilterFields<T> = { [K in keyof Required<T>]: UrlFilterField };

export type UrlFilterSpec<T, C = Omit<T, 'page' | 'limit'>> = UrlFilterFields<T> & {
  /** Phantom - never assigned at runtime. It parks the filter and criteria
   *  types on the spec so `useUrlFilters` can infer both, which means no call
   *  site restates them and none can restate them wrongly. */
  readonly __types?: { filters: T; criteria: C };
};

/** Fills in each `param` from its key, so the spec is the single source of the
 *  wire names and consumers can read `SPEC.page.param` without a fallback.
 *
 *  `C` is the slice a saved preset stores. It defaults to the filters minus
 *  their paging, which is what `transient` marks on every screen so far, so
 *  only a spec that marks something else transient needs to name it. Declared
 *  here once either way, and travels with the spec from then on. */
export function defineUrlFilters<T extends object, C = Omit<T, 'page' | 'limit'>>(
  spec: UrlFilterSpecInput<T>
): UrlFilterSpec<T, C> {
  const resolved = {} as UrlFilterFields<T>;

  (Object.keys(spec) as (keyof T & string)[]).forEach(key => {
    // The per-field input types are conditional on a key TypeScript cannot
    // resolve here, so this is the one place the strict declaration shape is
    // widened to the single runtime shape the hook reads.
    const input = spec[key] as UrlFilterFieldBase;
    resolved[key] = { ...input, param: input.param ?? key } as UrlFilterField;
  });

  return resolved;
}

/** The paging half of a spec, which is identical on every list screen bar the
 *  page size. Spread it in rather than restating both fields:
 *
 *  ```ts
 *  defineUrlFilters<InvoiceFilters, InvoiceCriteria>({
 *    search: {},
 *    ...pagingSpec(25),
 *  });
 *  ```
 */
export function pagingSpec(
  defaultLimit: number,
  maxLimit?: number
): UrlFilterSpecInput<{ page: number; limit: number }> {
  return {
    page: { kind: 'number', min: 1, defaultValue: 1, transient: true, pager: true },
    limit: { kind: 'number', min: 1, max: maxLimit, defaultValue: defaultLimit, transient: true },
  };
}

type Patch<T> = Partial<Record<keyof T, UrlFilterValue>>;

/** Clears only what the spec owns. A wholesale rewrite would also wipe params
 *  belonging to a tab, a drawer or a tracking tag that share the URL. */
function clearOwnParams(params: URLSearchParams, fields: [string, UrlFilterField][]) {
  fields.forEach(([, field]) => params.delete(field.param));
}

/** Reads and writes a typed filter object straight off the URL, so every list
 *  screen is shareable, refresh-proof and back-button safe without each one
 *  re-implementing the parse/serialise dance.
 *
 *  Both types come off the spec, so a call site is just
 *  `useUrlFilters(CUSTOMER_FILTER_SPEC)` - there is nothing to get wrong and
 *  nothing to keep in sync between screens reading the same filters.
 *
 *  `T` carries the enum unions; the parse is string-based and cast once here,
 *  exactly as a hand-written version would do per field. */
export function useUrlFilters<T extends object, C = Omit<T, 'page' | 'limit'>>(
  spec: UrlFilterSpec<T, C>
) {
  const [params, setParams] = useSearchParams();

  /** react-router builds `setParams` per render and hands its updater the
   *  params from that render, not the live ones. Two writes in the same tick
   *  therefore both start from the same snapshot and the second drops the
   *  first. Each write is remembered here so the next one in the same tick
   *  builds on it; the navigation landing clears it. */
  const pendingRef = useRef<URLSearchParams | null>(null);

  useEffect(() => {
    pendingRef.current = null;
  }, [params]);

  const write = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      setParams(
        prev => {
          const next = new URLSearchParams(pendingRef.current ?? prev);
          mutate(next);
          pendingRef.current = next;
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  // `__types` is a type-only marker and never present at runtime, so the
  // entries are exactly the declared fields.
  const fields = useMemo(
    () => Object.entries(spec) as unknown as [keyof T & string, UrlFilterField][],
    [spec]
  );

  const defaults = useMemo(() => {
    const resolved: Record<string, UrlFilterValue> = {};
    fields.forEach(([key, field]) => {
      resolved[key] =
        typeof field.defaultValue === 'function' ? field.defaultValue() : field.defaultValue;
    });
    return resolved;
  }, [fields]);

  const filters = useMemo(() => {
    const parsed: Record<string, UrlFilterValue> = {};

    fields.forEach(([key, field]) => {
      const fallback = defaults[key];

      if (field.kind === 'list') {
        const entries = params.getAll(field.param);
        const accepted = field.values
          ? entries.filter(entry => field.values?.includes(entry))
          : entries;
        parsed[key] = accepted.length ? accepted : (fallback as string[] | undefined);
        return;
      }

      const raw = params.get(field.param);

      if (field.kind === 'number') {
        const value = raw === null || raw.trim() === '' ? Number.NaN : Number(raw);
        if (!Number.isFinite(value)) {
          parsed[key] = fallback as number | undefined;
          return;
        }

        const lowered = field.max === undefined ? value : Math.min(value, field.max);
        parsed[key] = field.min === undefined ? lowered : Math.max(lowered, field.min);
        return;
      }

      if (raw !== null && field.values && !field.values.includes(raw)) {
        parsed[key] = fallback as string | undefined;
        return;
      }

      parsed[key] = raw ?? (fallback as string | undefined);
    });

    return parsed as T;
  }, [params, fields, defaults]);

  /** Writes several fields in one navigation, so a range edit is a single
   *  history entry rather than two. */
  const setFilters = useCallback(
    (patch: Patch<T>) => {
      write(next => {
        Object.entries(patch).forEach(([key, value]) => {
          const field = spec[key as keyof T];
          if (!field) return;

          next.delete(field.param);

          const values =
            Array.isArray(value)
              ? value
              : value === undefined || value === null
                ? []
                : [String(value)];
          values.filter(entry => entry !== '').forEach(entry => next.append(field.param, entry));
        });

        // Keyed off what the patch narrows, not off whether it happens to
        // mention the pager: `{ page: 3, search: 'foo' }` is a new search and
        // must start at page 1, even though it names the page. A `view` field
        // only reorders what is already matched, so it leaves paging alone.
        const narrows = Object.keys(patch).some(key => {
          const field = spec[key as keyof T];
          return Boolean(field) && !field.pager && !field.view;
        });

        if (narrows) {
          fields.forEach(([, field]) => {
            if (field.pager) next.delete(field.param);
          });
        }
      });
    },
    [write, spec, fields]
  );

  const setFilter = useCallback(
    (key: keyof T, value?: UrlFilterValue) => setFilters({ [key]: value } as Patch<T>),
    [setFilters]
  );

  /** Applies a whole preset in one navigation, dropping any of the spec's own
   *  fields the preset does not name. */
  const applyCriteria = useCallback(
    (criteria: C) => {
      write(next => {
        clearOwnParams(next, fields);

        Object.entries(criteria as Record<string, unknown>).forEach(([key, value]) => {
          const field = spec[key as keyof T];
          if (!field || value === undefined || value === null || value === '') return;

          const values = Array.isArray(value) ? value : [value];
          values.forEach(entry => next.append(field.param, String(entry)));
        });
      });
    },
    [write, spec, fields]
  );

  const resetFilters = useCallback(
    () => write(next => clearOwnParams(next, fields)),
    [write, fields]
  );

  const criteria = useMemo(() => {
    const slice: Record<string, UrlFilterValue> = {};
    fields.forEach(([key, field]) => {
      if (field.transient) return;
      slice[key] = (filters as Record<string, UrlFilterValue>)[key];
    });
    return slice as C;
  }, [fields, filters]);

  /** A field sitting on its own default was not applied by the user, so it must
   *  not light up a "Clear filters" affordance. */
  const isFiltered = useMemo(
    () =>
      fields.some(([key, field]) => {
        if (field.transient || field.view) return false;

        const value = (filters as Record<string, UrlFilterValue>)[key];
        if (value === undefined || value === null || value === '') return false;

        const fallback = defaults[key];

        if (Array.isArray(value)) {
          if (!Array.isArray(fallback)) return value.length > 0;
          // Compared by membership rather than identity: a list default is a
          // fresh array every mount, and param order is not meaningful.
          return (
            value.length !== fallback.length || value.some(entry => !fallback.includes(entry))
          );
        }

        return value !== fallback;
      }),
    [fields, filters, defaults]
  );

  return {
    filters,
    criteria,
    isFiltered,
    setFilter,
    setFilters,
    applyCriteria,
    resetFilters,
    searchParams: params,
  };
}
