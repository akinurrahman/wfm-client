import { formatDuration } from '@/lib/time';

import type { SummaryCounts } from '../../definitions/attendance-monthly.types';
import { SummaryFigure, SummarySection } from '../summary-figures';

type Props = {
  totals: SummaryCounts;
  /** False when the buckets do not sum to the eligible days. Shown as under
   *  review rather than as a total to act on. */
  reconciles: boolean;
};

export function MyAttendanceSummary({ totals, reconciles }: Props) {
  return (
    <section className="m-panel m-panel-shine space-y-5 p-5">
      {reconciles ? null : (
        <p
          role="alert"
          className="rounded-lg border border-overdue/25 bg-overdue-soft px-3.5 py-3 text-[13px] text-text-mid"
        >
          These counts do not add up to the days you were on rolls, so the month is still under
          review. Do not read the totals as final until your admin has settled it.
        </p>
      )}

      <SummarySection title="Days">
        <SummaryFigure label="On rolls" value={totals.eligibleDays} />
        <SummaryFigure
          label="Working"
          value={totals.eligibleDays - totals.weeklyOffCount - totals.holidayCount}
          hint="Derived, not stored: days on rolls less weekly offs and holidays."
        />
        <SummaryFigure label="Present" value={totals.presentDays} tone="settled" />
        <SummaryFigure label="Half day" value={totals.halfDays} />
        <SummaryFigure label="Absent" value={totals.absentDays} tone="overdue" />
        <SummaryFigure label="Paid leave" value={totals.paidLeaveDays} />
        <SummaryFigure label="Unpaid leave" value={totals.unpaidLeaveDays} />
        <SummaryFigure label="Holiday" value={totals.holidayCount} />
        <SummaryFigure label="Weekly off" value={totals.weeklyOffCount} />
      </SummarySection>

      {totals.holidayWorkedDays || totals.weeklyOffWorkedDays ? (
        <SummarySection title="Worked on days off">
          <SummaryFigure
            label="Holiday worked"
            value={totals.holidayWorkedDays}
            hint="Already counted inside the holiday total, never added on top of it."
          />
          <SummaryFigure
            label="Weekly off worked"
            value={totals.weeklyOffWorkedDays}
            hint="Already counted inside the weekly off total, never added on top of it."
          />
        </SummarySection>
      ) : null}

      <SummarySection title="Time">
        <SummaryFigure label="Worked" value={formatDuration(totals.totalWorkedMinutes)} />
        <SummaryFigure label="Late" value={formatDuration(totals.totalLateMinutes)} />
        <SummaryFigure label="Early exit" value={formatDuration(totals.totalEarlyExitMinutes)} />
        <SummaryFigure label="Overtime" value={formatDuration(totals.normalOvertimeMinutes)} />
        <SummaryFigure label="Holiday OT" value={formatDuration(totals.holidayOvertimeMinutes)} />
        <SummaryFigure
          label="Weekly off OT"
          value={formatDuration(totals.weeklyOffOvertimeMinutes)}
        />
      </SummarySection>
    </section>
  );
}
