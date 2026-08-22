import { cn } from '@/lib/utils';

type Props = {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

/** "Nothing here yet" and "nothing matches your filters" are different states
 *  and must read differently - the caller picks the copy, this only frames it. */
export function EmptyState({ icon: Icon, title, description, action, className }: Props) {
  return (
    <div className={cn('flex flex-col items-center gap-2 px-6 py-14 text-center', className)}>
      {Icon ? (
        <span className="mb-1 flex size-9 items-center justify-center rounded-full border border-hairline bg-surface-2">
          <Icon className="size-4 text-text-low" />
        </span>
      ) : null}

      <p className="text-sm font-medium text-text-hi">{title}</p>
      {description ? (
        <p className="max-w-sm text-[13px] leading-relaxed text-text-mid">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
