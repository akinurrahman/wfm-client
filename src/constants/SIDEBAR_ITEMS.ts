import { type SidebarGroup } from "@/types/sidebar";
import { USER_ROLES } from "./ROLES";

const { keys: ROLE } = USER_ROLES;

export const SIDEBAR_ITEMS = (): SidebarGroup[] => [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "LayoutDashboard",
        roles: [ROLE.SITE_ADMIN, ROLE.EMPLOYEE],
      },
    ],
  },
  {
    group: "People",
    items: [
      {
        title: "Employees",
        url: "/employees",
        icon: "Users",
        roles: [ROLE.SITE_ADMIN],
      },
    ],
  },
  {
    group: "Attendance",
    items: [
      {
        title: "Daily roster",
        url: "/attendance",
        icon: "CalendarCheck",
        roles: [ROLE.SITE_ADMIN],
      },
      {
        title: "Monthly sheet",
        url: "/attendance/monthly",
        icon: "CalendarRange",
        roles: [ROLE.SITE_ADMIN],
      },
      {
        title: "Periods",
        url: "/attendance/periods",
        icon: "LockKeyhole",
        roles: [ROLE.SITE_ADMIN],
      },
      {
        title: "Attendance tools",
        url: "/attendance/tools",
        icon: "Wrench",
        roles: [ROLE.SITE_ADMIN],
      },
    ],
  },
  {
    group: "Organization",
    items: [
      {
        title: "Designations",
        url: "/designations",
        icon: "BriefcaseBusiness",
        roles: [ROLE.SITE_ADMIN],
      },
      {
        title: "Shifts",
        url: "/shifts",
        icon: "CalendarClock",
        roles: [ROLE.SITE_ADMIN],
      },
      {
        title: "Holidays",
        url: "/holidays",
        icon: "CalendarDays",
        // Reads are open to employees so their attendance calendar can render.
        roles: [ROLE.SITE_ADMIN, ROLE.EMPLOYEE],
      },
    ],
  },
];
