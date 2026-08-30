import { parseISO } from 'date-fns';
import { AlertTriangle, ArrowUpRight } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatDate } from '@/lib/format';
import { formatDuration } from '@/lib/time';

import type { MonthlyDay, MonthlyRow } from '../../definitions/attendance-monthly.types';
import { SummaryFigure as Figure, SummarySection as Section } from '../summary-figures';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: MonthlyRow | null;
  onSelectDay: (row: MonthlyRow, day: MonthlyDay) => void;
};

/** A day nobody decided, or one two sources disagree about. Both block the
 *  lock, so both belong on the same worklist. */
const unsettledDays = (row: MonthlyRow) =>
  row.days.filter(day => day.eligible && (!day.attendanceId || day.hasConflict));

export function MonthlyTotalsSheet({ open, onOpenChange, row, onSelectDay }: Props) {
  const totals = row?.totals ?? null;
  const unsettled = row ? unsettledDays(row) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-hairline p-5">
          <SheetTitle className="display-title text-lg leading-tight text-text-hi">
            {row ? row.employee.fullName : 'Totals'}
          </SheetTitle>
          <SheetDescription className="text-[13px] leading-relaxed text-text-mid">
            The seven buckets sum to the eligible days. The overlays sit on top of a bucket rather
            than beside it, so they are never added into the total.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          {!totals ? (
            <EmptyState
              icon={AlertTriangle}
              title="No totals for this cycle"
              description="This employee was on rolls for no part of the cycle, so there is nothing to sum."
            />
          ) : (
            <>
              {row?.reconciles ? null : (
                <p
                  role="alert"
                  className="rounded-lg border border-overdue/25 bg-overdue-soft px-3.5 py-3 text-[13px] text-text-mid"
                >
                  The buckets do not sum to the eligible days. The month will not lock until every
                  day below is settled.
                </p>
              )}

              <Section title="Days">
                <Figure label="Eligible" value={totals.eligibleDays} />
                <Figure
                  label="Working"
                  value={totals.eligibleDays - totals.weeklyOffCount - totals.holidayCount}
                  hint="Derived, not stored: eligible less weekly offs and holidays."
                />
                <Figure label="Present" value={totals.presentDays} tone="settled" />
                <Figure label="Half day" value={totals.halfDays} />
                <Figure label="Absent" value={totals.absentDays} tone="overdue" />
                <Figure label="Paid leave" value={totals.paidLeaveDays} />
                <Figure label="Unpaid leave" value={totals.unpaidLeaveDays} />
                <Figure label="Holiday" value={totals.holidayCount} />
                <Figure label="Weekly off" value={totals.weeklyOffCount} />
              </Section>

              <Section title="Worked on days off">
                <Figure label="Holiday worked" value={totals.holidayWorkedDays} />
                <Figure label="Weekly off worked" value={totals.weeklyOffWorkedDays} />
              </Section>

              <Section title="Time">
                <Figure label="Worked" value={formatDuration(totals.totalWorkedMinutes)} />
                <Figure label="Late" value={formatDuration(totals.totalLateMinutes)} />
                <Figure label="Early exit" value={formatDuration(totals.totalEarlyExitMinutes)} />
                <Figure label="Overtime" value={formatDuration(totals.normalOvertimeMinutes)} />
                <Figure
                  label="Holiday OT"
                  value={formatDuration(totals.holidayOvertimeMinutes)}
                />
                <Figure
                  label="Weekly off OT"
                  value={formatDuration(totals.weeklyOffOvertimeMinutes)}
                />
              </Section>
            </>
          )}

          {row && unsettled.length ? (
            <Section title={`Needs settling (${unsettled.length})`}>
              <ul className="w-full space-y-1.5">
                {unsettled.map(day => (
                  <li key={day.date}>
                    <button
                      type="button"
                      onClick={() => onSelectDay(row, day)}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-left transition-colors duration-200 hover:bg-surface-3"
                    >
                      <span data-numeric className="text-[13px] font-medium text-text-hi">
                        {formatDate(parseISO(day.date), 'dd MMM')}
                      </span>
                      <span className="text-[12px] text-text-mid">
                        {day.hasConflict ? 'Conflict to resolve' : 'Nothing decided this day'}
                      </span>
                      <ArrowUpRight aria-hidden className="ml-auto size-3.5 text-text-low" />
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
