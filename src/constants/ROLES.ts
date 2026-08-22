import { createLookup } from "@/lib/lookup";

export const USER_ROLES = createLookup({
  SITE_ADMIN: { label: "Site Admin", badgeVariant: "default" },
  EMPLOYEE: { label: "Employee", badgeVariant: "default" },
});

export type UserRole = keyof typeof USER_ROLES.config;
