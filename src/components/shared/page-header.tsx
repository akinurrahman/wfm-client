import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description?: string;
  /** Primary + secondary actions, rendered right-aligned on desktop and
   *  wrapped underneath on narrow screens. */
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="font-serif text-2xl leading-tight text-text-hi">{title}</h1>
        {description ? <p className="mt-1 text-[13px] text-text-mid">{description}</p> : null}
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
