import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description?: string;
  /** Right-aligned section-level control, e.g. a "copy from above" shortcut. */
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/** A long form or a long record is a wall of fields unless it is broken into
 *  the questions it is actually answering. Each section is one of those. */
export function PanelSection({ title, description, action, className, children }: Props) {
  return (
    <section className={cn('m-panel m-panel-shine p-5', className)}>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="font-mono text-[10px] tracking-[0.18em] text-text-low uppercase">{title}</h3>
        <span aria-hidden className="h-px flex-1 bg-hairline" />
        {action}
      </div>

      {description ? <p className="mb-4 text-[13px] text-text-mid">{description}</p> : null}

      <div className="space-y-4">{children}</div>
    </section>
  );
}
