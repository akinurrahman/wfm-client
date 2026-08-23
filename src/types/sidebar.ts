export type SidebarItem = {
  title: string;
  url: string;
  icon?: string;
  roles?: string[];
  items?: SidebarItem[];
};

export type SidebarGroup = {
  /** Section heading. Omit to render the group without a label. */
  group?: string;
  roles?: string[];
  items: SidebarItem[];
};
