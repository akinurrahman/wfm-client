import { Skeleton } from '@/components/ui/skeleton';

/** Shaped like the board it stands in for, so nothing moves when the figures
 *  arrive. A spinner here would reflow the whole page on every date step. */
export function BoardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full rounded-xl" />

      <div className="grid gap-px overflow-hidden rounded-xl bg-hairline sm:grid-cols-2 desk:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2 bg-surface-1 px-4 py-3.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        ))}
      </div>

      <div className="m-panel space-y-3 p-6">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-36 w-full" />
      </div>

      <div className="grid gap-4 desk:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="m-panel space-y-3 p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
