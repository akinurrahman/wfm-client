import {
  BriefcaseBusiness,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarOff,
  CalendarRange,
  LayoutDashboard,
  LockKeyhole,
  Star,
  UserCircle,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/** Maps the `icon` string on a sidebar item to a real icon component.
 *
 *  Only what the nav actually uses: the map is one live object, so a name
 *  listed here ships whether or not any item references it. Adding a nav item
 *  with a new icon means adding it in both places below. */
export const NAV_ICONS: Record<string, LucideIcon> = {
  BriefcaseBusiness,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarOff,
  CalendarRange,
  LayoutDashboard,
  LockKeyhole,
  UserCircle,
  Users,
  Wrench,
};

export const resolveNavIcon = (name?: string): LucideIcon =>
  (name && NAV_ICONS[name]) || Star;
