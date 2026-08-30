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
    <section className={cn('m-panel m-panel-shine p-6', className)}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="display-title text-[14px] text-text-hi">{title}</h3>
          {description ? (
            <p className="mt-1 text-[13px] leading-relaxed text-text-mid">{description}</p>
          ) : null}
        </div>
        {action}
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}
