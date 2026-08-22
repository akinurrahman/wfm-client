import { Badge } from '@/components/ui/badge';
import { resolveBadgeVariant } from '@/lib/badge-variant';
import type { createLookup } from '@/lib/lookup';

type Lookup<T extends string> = ReturnType<typeof createLookup<T>>;

type Props<T extends string> = {
  lookup: Lookup<T>;
  value: string | null | undefined;
  showIcon?: boolean;
  className?: string;
};

/** The one place the resolve -> badge JSX lives, so no feature ever writes a
 *  per-enum badge component. `lookup.resolve` already warns on an unknown
 *  value, which is how a backend adding an enum member surfaces in dev. */
export function LookupBadge<T extends string>({
  lookup,
  value,
  showIcon = true,
  className,
}: Props<T>) {
  const meta = lookup.resolve(value);
  if (!meta) return null;

  const Icon = meta.icon;

  return (
    <Badge variant={resolveBadgeVariant(meta.badgeVariant)} className={className}>
      {showIcon && Icon ? <Icon className={meta.iconClassName ?? 'size-3'} /> : null}
      {meta.label}
    </Badge>
  );
}
