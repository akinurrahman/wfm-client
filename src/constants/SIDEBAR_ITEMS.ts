import { type SidebarGroup } from "@/types/sidebar";
import { USER_ROLES } from "./ROLES";

const { keys: ROLE } = USER_ROLES;

export const SIDEBAR_ITEMS = (): SidebarGroup[] => [
  {
    group: "General",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "LayoutDashboard",
        roles: [ROLE.SITE_ADMIN, ROLE.EMPLOYEE],
      },
    ],
  },
];
