import { useState } from 'react';

import { CalendarRange, UserX } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { getErrorStatus } from '@/lib/api/error';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';
import { useUrlFilters } from '@/systems/filters';
import { FilterBar } from '@/systems/ui/filter-bar';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import { useMyAttendanceMonth } from '../../api/my-attendance.queries';
import { CyclePicker } from '../../components/cycle-picker';
import { MyAttendanceCalendar } from '../../components/my-attendance/my-attendance-calendar';
import { MyAttendanceDaySheet } from '../../components/my-attendance/my-attendance-day-sheet';
import { MyAttendanceSummary } from '../../components/my-attendance/my-attendance-summary';
import { MonthlyLegend } from '../../components/monthly/monthly-legend';
import { cycleLabel } from '../../definitions/attendance-monthly.constants';
import { periodStatusLookup } from '../../definitions/attendance-period.lookup';
import type { MonthlyCycle } from '../../definitions/attendance-monthly.types';
import { MY_ATTENDANCE_FILTER_SPEC } from '../../definitions/my-attendance.constants';
import type { MyAttendanceDay } from '../../definitions/my-attendance.types';

export default function MyAttendancePage() {
  const { filters, setFilters } = useUrlFilters(MY_ATTENDANCE_FILTER_SPEC);
  const { data, isLoading, isError, error, refetch } = useMyAttendanceMonth(filters);

  const [selectedDay, setSelectedDay] = useState<MyAttendanceDay | null>(null);

  const month = data?.data;
  const days = month?.days ?? [];
  const label = cycleLabel(filters.year, filters.month);

  // 403 is an account with no employee record behind it, 404 the record having
  // gone. Neither is worth a retry.
  const status = getErrorStatus(error);
  if (isError && (status === 403 || status === 404)) {
    return (
      <EmptyState
        icon={UserX}
        title="No employee record linked to this account"
        description="Attendance is kept against an employee record, and your login is not connected to one yet. Ask HR to link it."
      />
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title="My attendance"
        description="Every day of the cycle, as the sheet payroll reads holds it. The month is a cycle label, not a calendar filter, so a 26th-to-25th cycle labelled August starts in July."
      />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <FilterBar>
            <CyclePicker year={filters.year} month={filters.month} onChange={setFilters} />
          </FilterBar>

          {month ? <CycleStrip cycle={month.period} eligibleDays={month.eligibleDays} /> : null}

          {month && !month.totals ? (
            <EmptyState
              icon={CalendarRange}
              title={`You were not on rolls in ${label}`}
              description="The cycle falls entirely outside your time here, so there is nothing to count. Pick another month."
            />
          ) : (
            <>
              <MyAttendanceCalendar
                days={days}
                isLoading={isLoading}
                selectedDate={selectedDay?.date ?? null}
                onSelectDay={setSelectedDay}
              />

              <MonthlyLegend />

              {month?.totals ? (
                <MyAttendanceSummary totals={month.totals} reconciles={month.reconciles} />
              ) : null}
            </>
          )}
        </>
      )}

      <MyAttendanceDaySheet
        open={selectedDay !== null}
        onOpenChange={open => setSelectedDay(open ? selectedDay : null)}
        day={selectedDay}
      />
    </div>
  );
}

/** Which window the label resolved to, and whether it is still open. A locked
 *  cycle is what payroll was handed, so nothing in it will move again. */
function CycleStrip({ cycle, eligibleDays }: { cycle: MonthlyCycle; eligibleDays: number }) {
  return (
    <div className="m-panel m-panel-shine flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3.5">
      <span className="flex items-baseline gap-2">
        <span className="meta-label text-text-low">
          Cycle
        </span>
        <span data-numeric className="text-[13px] font-medium text-text-hi">
          {formatDate(toCalendarDate(cycle.startDate), 'dd MMM yyyy')} to{' '}
          {formatDate(toCalendarDate(cycle.endDate), 'dd MMM yyyy')}
        </span>
      </span>

      {cycle.id ? (
        <LookupBadge lookup={periodStatusLookup} value={cycle.status} />
      ) : (
        <Badge
          variant="outline"
          className="border-dashed"
          title="No period is declared for this label, so the calendar month was assumed."
        >
          Not declared
        </Badge>
      )}

      <span data-numeric className="text-[12px] text-text-low">
        {eligibleDays} days on rolls
      </span>
    </div>
  );
}
