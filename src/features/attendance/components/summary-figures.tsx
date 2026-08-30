import { cn } from '@/lib/utils';

/** The counted month, read the same way wherever it is shown: a labelled group
 *  of figures, each one a term the payroll conversation already uses. */
export function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h3 className="meta-label text-text-low">{title}</h3>
        <span aria-hidden className="h-px flex-1 bg-hairline" />
      </div>
      <dl className="flex flex-wrap gap-x-6 gap-y-2.5">{children}</dl>
    </section>
  );
}

export function SummaryFigure({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: number | string;
  tone?: 'settled' | 'overdue';
  hint?: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5" title={hint}>
      <dt className="meta-label text-text-low">{label}</dt>
      <dd
        data-numeric
        className={cn(
          'text-[14px] font-medium',
          tone === 'settled' && 'text-settled',
          tone === 'overdue' && 'text-overdue',
          !tone && 'text-text-hi'
        )}
      >
        {value}
      </dd>
    </div>
  );
}
