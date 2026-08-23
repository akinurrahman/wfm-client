import { useMemo } from 'react';

import { useSidebarStore } from '@/stores/sidebar';

import { type CommandItem } from '../types';

/**
 * Flattens the sidebar tree into searchable entries. The store is already
 * filtered by the signed-in user's role, so a page the role cannot reach is
 * never in this list and therefore never searchable.
 */
export function useCommandItems(): CommandItem[] {
  const groups = useSidebarStore(store => store.sidebarData);

  return useMemo(
    () =>
      groups.flatMap(group =>
        group.items.flatMap(item => {
          const entry: CommandItem = {
            id: `${group.group ?? ""}:${item.url}`,
            title: item.title,
            url: item.url,
            group: group.group,
            icon: item.icon,
          };

          const children = (item.items ?? []).map<CommandItem>(sub => ({
            id: `${group.group ?? ""}:${item.url}:${sub.url}`,
            title: sub.title,
            url: sub.url,
            group: group.group,
            parent: item.title,
            icon: sub.icon ?? item.icon,
          }));

          return [entry, ...children];
        })
      ),
    [groups]
  );
}
