import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="space-y-4 pb-4">
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-9 w-full" />
      <div className="m-panel m-panel-shine space-y-4 p-5">
        <Skeleton className="h-3 w-24" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
