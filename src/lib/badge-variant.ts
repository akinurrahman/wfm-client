/** Badge variants are named after what a value MEANS, not what colour it is,
 *  so a lookup can declare `badgeVariant: "settled"` without knowing the
 *  palette. Lives in lib/ because it is plain data with no react. */
export const BADGE_VARIANTS = [
  'default',
  'secondary',
  'outline',
  'settled',
  'awaiting',
  'overdue',
] as const;

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

/** Lets lookups keep the generic shadcn-ish names while the palette stays
 *  Meridian-native. */
const BADGE_VARIANT_ALIASES: Record<string, BadgeVariant> = {
  success: 'settled',
  warning: 'awaiting',
  destructive: 'overdue',
};

/** Lookup configs type `badgeVariant` as a plain string, so this narrows an
 *  arbitrary value to something the component actually renders. */
export function resolveBadgeVariant(variant: string | undefined): BadgeVariant {
  if (!variant) return 'secondary';
  if (variant in BADGE_VARIANT_ALIASES) return BADGE_VARIANT_ALIASES[variant];
  return (BADGE_VARIANTS as readonly string[]).includes(variant)
    ? (variant as BadgeVariant)
    : 'secondary';
}
