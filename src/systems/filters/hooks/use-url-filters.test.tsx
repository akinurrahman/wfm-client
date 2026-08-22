import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';

import { defineUrlFilters, useUrlFilters } from './use-url-filters';

type Filters = {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  tags?: string[];
  sort?: 'NEW' | 'OLD';
  page: number;
  limit: number;
};

const SPEC = defineUrlFilters<Filters>({
  search: {},
  status: { values: ['ACTIVE', 'INACTIVE'], defaultValue: 'ACTIVE' },
  tags: { param: 'tag', kind: 'list', values: ['a', 'b', 'c'] },
  sort: { values: ['NEW', 'OLD'], defaultValue: 'NEW', view: true },
  page: { kind: 'number', min: 1, defaultValue: 1, transient: true, pager: true },
  limit: { kind: 'number', min: 1, max: 100, defaultValue: 25, transient: true },
});

/** Renders the hook at a starting URL and exposes the resulting search string,
 *  which is what every write assertion here is really about. */
function setup(initialUrl = '/') {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>
  );

  return renderHook(
    () => ({ ...useUrlFilters(SPEC), search: useLocation().search }),
    { wrapper }
  );
}

describe('parsing', () => {
  it('reads numbers as numbers, not strings', () => {
    const { result } = setup('/?page=3');
    expect(result.current.filters.page).toBe(3);
  });

  it('reads a repeated param as a list', () => {
    const { result } = setup('/?tag=a&tag=b');
    expect(result.current.filters.tags).toEqual(['a', 'b']);
  });

  it('falls back to the default when the param is absent', () => {
    const { result } = setup('/');
    expect(result.current.filters.status).toBe('ACTIVE');
    expect(result.current.filters.limit).toBe(25);
  });
});

describe('validation', () => {
  it('drops a string outside the accepted values', () => {
    const { result } = setup('/?status=BANANA');
    expect(result.current.filters.status).toBe('ACTIVE');
  });

  it('drops only the invalid entries of a list', () => {
    const { result } = setup('/?tag=a&tag=NOPE&tag=c');
    expect(result.current.filters.tags).toEqual(['a', 'c']);
  });

  it('falls back when no list entry survives', () => {
    const { result } = setup('/?tag=NOPE');
    expect(result.current.filters.tags).toBeUndefined();
  });

  it('clamps a number below its minimum', () => {
    const { result } = setup('/?page=-4');
    expect(result.current.filters.page).toBe(1);
  });

  it('clamps a number above its maximum', () => {
    const { result } = setup('/?limit=99999');
    expect(result.current.filters.limit).toBe(100);
  });

  it('falls back when a number does not parse', () => {
    const { result } = setup('/?page=abc');
    expect(result.current.filters.page).toBe(1);
  });
});

describe('writing', () => {
  it('keeps two writes made in the same tick', () => {
    const { result } = setup('/');

    act(() => {
      result.current.setFilter('search', 'foo');
      result.current.setFilter('status', 'INACTIVE');
    });

    expect(result.current.search).toContain('search=foo');
    expect(result.current.search).toContain('status=INACTIVE');
  });

  it('treats null as clearing the param', () => {
    const { result } = setup('/?search=foo');

    act(() => {
      result.current.setFilter('search', null);
    });

    expect(result.current.search).not.toContain('null');
    expect(result.current.search).not.toContain('search=');
  });

  it('clears the pager when a filter changes', () => {
    const { result } = setup('/?page=7');

    act(() => {
      result.current.setFilter('search', 'foo');
    });

    expect(result.current.search).not.toContain('page=');
  });

  it('clears the pager even when the patch also names it', () => {
    const { result } = setup('/');

    act(() => {
      result.current.setFilters({ page: 3, search: 'foo' });
    });

    expect(result.current.search).not.toContain('page=');
  });

  it('leaves the pager alone for a view-only write', () => {
    const { result } = setup('/?page=7');

    act(() => {
      result.current.setFilter('sort', 'OLD');
    });

    expect(result.current.search).toContain('page=7');
  });

  it('pages without clearing itself', () => {
    const { result } = setup('/?search=foo');

    act(() => {
      result.current.setFilter('page', 4);
    });

    expect(result.current.search).toContain('page=4');
    expect(result.current.search).toContain('search=foo');
  });
});

describe('params the spec does not own', () => {
  it('survive a reset', () => {
    const { result } = setup('/?search=foo&drawer=open');

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.search).toContain('drawer=open');
    expect(result.current.search).not.toContain('search=foo');
  });

  it('survive applying a preset', () => {
    const { result } = setup('/?search=foo&drawer=open');

    act(() => {
      result.current.applyCriteria({ status: 'INACTIVE' });
    });

    expect(result.current.search).toContain('drawer=open');
    expect(result.current.search).toContain('status=INACTIVE');
    expect(result.current.search).not.toContain('search=foo');
  });
});

describe('isFiltered', () => {
  it('is false on a pristine screen', () => {
    const { result } = setup('/');
    expect(result.current.isFiltered).toBe(false);
  });

  it('ignores a field sitting on its own default', () => {
    const { result } = setup('/?status=ACTIVE');
    expect(result.current.isFiltered).toBe(false);
  });

  it('ignores a view field', () => {
    const { result } = setup('/?sort=OLD');
    expect(result.current.isFiltered).toBe(false);
  });

  it('ignores transient paging', () => {
    const { result } = setup('/?page=4&limit=50');
    expect(result.current.isFiltered).toBe(false);
  });

  it('is true for an applied filter', () => {
    const { result } = setup('/?status=INACTIVE');
    expect(result.current.isFiltered).toBe(true);
  });

  it('is true for a list with entries', () => {
    const { result } = setup('/?tag=a');
    expect(result.current.isFiltered).toBe(true);
  });
});

describe('criteria', () => {
  it('excludes transient fields', () => {
    const { result } = setup('/?search=foo&page=3&limit=50');
    expect(result.current.criteria).not.toHaveProperty('page');
    expect(result.current.criteria).not.toHaveProperty('limit');
    expect(result.current.criteria.search).toBe('foo');
  });
});

describe('write sequencing', () => {
  it('keeps three writes made in the same tick', () => {
    const { result } = setup('/');

    act(() => {
      result.current.setFilter('search', 'foo');
      result.current.setFilter('status', 'INACTIVE');
      result.current.setFilter('tags', ['a', 'b']);
    });

    expect(result.current.search).toContain('search=foo');
    expect(result.current.search).toContain('status=INACTIVE');
    expect(result.current.search).toContain('tag=a');
    expect(result.current.search).toContain('tag=b');
  });

  it('does not replay a queued write into a later tick', () => {
    const { result } = setup('/');

    act(() => {
      result.current.setFilter('search', 'foo');
    });
    act(() => {
      result.current.setFilter('search', 'bar');
    });

    expect(result.current.search).toContain('search=bar');
    expect(result.current.search).not.toContain('search=foo');
  });

  it('builds a later tick on what actually landed', () => {
    const { result } = setup('/');

    act(() => {
      result.current.setFilter('search', 'foo');
    });
    act(() => {
      result.current.setFilter('status', 'INACTIVE');
    });

    expect(result.current.search).toContain('search=foo');
    expect(result.current.search).toContain('status=INACTIVE');
  });

  it('leaves foreign params alone on a normal write', () => {
    const { result } = setup('/?drawer=open');

    act(() => {
      result.current.setFilter('search', 'foo');
    });

    expect(result.current.search).toContain('drawer=open');
  });

  it('drops empty strings rather than writing a bare param', () => {
    const { result } = setup('/?search=foo');

    act(() => {
      result.current.setFilter('search', '');
    });

    expect(result.current.search).not.toContain('search');
  });
});

describe('a list field that has a default', () => {
  type Listed = { tags?: string[]; page: number };

  const LIST_SPEC = defineUrlFilters<Listed>({
    tags: { param: 'tag', kind: 'list', values: ['a', 'b'], defaultValue: ['a'] },
    page: { kind: 'number', defaultValue: 1, transient: true, pager: true },
  });

  function setupListed(initialUrl = '/') {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>
    );
    return renderHook(() => useUrlFilters(LIST_SPEC), { wrapper });
  }

  it('is not filtered while sitting on its default', () => {
    const { result } = setupListed('/');
    expect(result.current.filters.tags).toEqual(['a']);
    expect(result.current.isFiltered).toBe(false);
  });

  it('is not filtered when the URL restates the default', () => {
    const { result } = setupListed('/?tag=a');
    expect(result.current.isFiltered).toBe(false);
  });

  it('is filtered once the selection differs', () => {
    const { result } = setupListed('/?tag=b');
    expect(result.current.isFiltered).toBe(true);
  });
});
