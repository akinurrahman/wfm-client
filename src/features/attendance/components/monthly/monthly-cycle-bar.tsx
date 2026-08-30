import { AlertTriangle, FileText, Loader2, Lock, LockOpen, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import type { MonthlyCycle } from '../../definitions/attendance-monthly.types';
import { periodStatusLookup } from '../../definitions/attendance-period.lookup';

type Props = {
  cycle: MonthlyCycle;
  employeeCount: number;
  /** Counted over the loaded page, so it is labelled as such. */
  unreconciled: number;
  isLocking: boolean;
  onDeclare: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onViewSummary: () => void;
};

/** The cycle a year and month label resolved to, and the one action available
 *  on it. Payroll reads what is locked here, so the window has to be stated
 *  rather than assumed to be the calendar month. */
export function MonthlyCycleBar({
  cycle,
  employeeCount,
  unreconciled,
  isLocking,
  onDeclare,
  onLock,
  onUnlock,
  onViewSummary,
}: Props) {
  const isDeclared = cycle.id !== null;
  const isLocked = isDeclared && cycle.status === periodStatusLookup.keys.LOCKED;

  return (
    <div className="m-panel m-panel-shine mb-4 flex flex-col gap-3 px-4 py-3.5 lg:flex-row lg:items-center">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="flex items-baseline gap-2">
          <span className="meta-label text-text-low">
            Cycle
          </span>
          <span data-numeric className="text-[13px] font-medium text-text-hi">
            {formatDate(toCalendarDate(cycle.startDate), 'dd MMM yyyy')} to{' '}
            {formatDate(toCalendarDate(cycle.endDate), 'dd MMM yyyy')}
          </span>
        </span>

        {isDeclared ? (
          <LookupBadge lookup={periodStatusLookup} value={cycle.status} />
        ) : (
          <Badge
            variant="outline"
            className="border-dashed"
            title="No period is declared for this label, so the calendar month was assumed. Nothing can be locked until one exists."
          >
            Not declared
          </Badge>
        )}

        <span data-numeric className="text-[12px] text-text-low">
          {employeeCount.toLocaleString('en-IN')} employees
        </span>

        {unreconciled ? (
          <span className="flex items-center gap-1.5 text-[12px] text-overdue">
            <AlertTriangle aria-hidden className="size-3.5" />
            <span data-numeric>{unreconciled}</span> not reconciling on this page
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:ml-auto">
        {!isDeclared ? (
          <Button size="sm" className="m-brand-fill" onClick={onDeclare}>
            <Plus />
            Declare this period
          </Button>
        ) : isLocked ? (
          <>
            <Button variant="outline" size="sm" onClick={onViewSummary}>
              <FileText />
              Locked summary
            </Button>
            <Button variant="ghost" size="sm" onClick={onUnlock}>
              <LockOpen />
              Unlock
            </Button>
          </>
        ) : (
          <Button size="sm" className="m-brand-fill" disabled={isLocking} onClick={onLock}>
            {isLocking ? <Loader2 className="animate-spin" /> : <Lock />}
            {isLocking ? 'Locking' : 'Lock this month'}
          </Button>
        )}
      </div>
    </div>
  );
}
