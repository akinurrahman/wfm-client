export type CommandItem = {
  /** Stable id, unique across groups. */
  id: string;
  title: string;
  url: string;
  /** Sidebar group the entry came from, shown as the trailing hint. Absent for an unlabelled group. */
  group?: string;
  /** Parent item title when this entry is a sub-item. */
  parent?: string;
  icon?: string;
};
