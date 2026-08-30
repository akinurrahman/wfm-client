import { cn } from '@/lib/utils';

export type DetailItem = {
  label: string;
  value: React.ReactNode;
};

type Props = {
  items: DetailItem[];
  className?: string;
};

/** Reads a stored record back. An empty value says so rather than leaving a
 *  gap, since "nothing here" and "nobody filled this in" look identical. */
export function DetailList({ items, className }: Props) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-4 sm:grid-cols-2', className)}>
      {items.map(item => (
        <div key={item.label} className="min-w-0">
          <dt className="meta-label text-text-low">
            {item.label}
          </dt>
          <dd className="mt-1 text-[13px] break-words text-text-hi">
            {item.value ?? <span className="text-text-low">Not recorded</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
