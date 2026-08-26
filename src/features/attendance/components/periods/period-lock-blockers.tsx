import { AlertTriangle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  blockers: string[];
  onDismiss: () => void;
  className?: string;
};

/** A refused lock comes back as a list rather than a sentence, and that list is
 *  the worklist: unresolved conflicts, days nobody created, check-ins with no
 *  check-out, rows that do not reconcile. Locking would not make any of them go
 *  away, it would make them payroll's, so all of them are rendered. */
export function PeriodLockBlockers({ blockers, onDismiss, className }: Props) {
  if (!blockers.length) return null;

  return (
    <section
      role="alert"
      className={cn('m-panel border-overdue/25 bg-overdue-soft px-4 py-3.5', className)}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-overdue" />

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-text-hi">
            The lock was refused. <span data-numeric>{blockers.length}</span>{' '}
            {blockers.length === 1 ? 'blocker' : 'blockers'} to settle first.
          </p>

          <ul className="mt-2 space-y-1">
            {blockers.map((blocker, index) => (
              <li
                key={`${blocker}-${index}`}
                className="font-mono text-[11px] leading-relaxed break-words text-text-mid"
              >
                {blocker}
              </li>
            ))}
          </ul>
        </div>

        <Button variant="ghost" size="icon-sm" aria-label="Dismiss blockers" onClick={onDismiss}>
          <X />
        </Button>
      </div>
    </section>
  );
}
