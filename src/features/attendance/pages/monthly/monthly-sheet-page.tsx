import { useMemo, useState } from 'react';

import { Link, useNavigate } from 'react-router';

import { addMonths } from 'date-fns';
import { CalendarRange, ChevronLeft, ChevronRight, LockKeyhole } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { getErrorDetails } from '@/lib/api/error';
import { toCalendarDate } from '@/lib/time';
import { FilterSelect, useUrlFilters } from '@/systems/filters';
import { FilterBar } from '@/systems/ui/filter-bar';

import { useLockPeriod } from '../../api/attendance-period.mutations';
import { useMonthlySheet } from '../../api/attendance-monthly.queries';
import { MonthlyCycleBar } from '../../components/monthly/monthly-cycle-bar';
import { MonthlyGrid } from '../../components/monthly/monthly-grid';
import { MonthlyLegend } from '../../components/monthly/monthly-legend';
import { MonthlyTotalsSheet } from '../../components/monthly/monthly-totals-sheet';
import { PeriodFormSheet } from '../../components/periods/period-form-sheet';
import { PeriodLockBlockers } from '../../components/periods/period-lock-blockers';
import { PeriodUnlockSheet } from '../../components/periods/period-unlock-sheet';
import {
  cycleLabel,
  MONTH_OPTIONS,
  MONTHLY_FILTER_SPEC,
  monthlyYearOptions,
} from '../../definitions/attendance-monthly.constants';
import type { MonthlyDay, MonthlyRow } from '../../definitions/attendance-monthly.types';

/** Steps a year and month label together, so December steps to January of the
 *  next year rather than to month 13. */
function shiftCycle(year: number, month: number, delta: number) {
  const next = addMonths(new Date(year, month - 1, 1), delta);
  return { year: next.getFullYear(), month: next.getMonth() + 1 };
}

export default function MonthlySheetPage() {
  const navigate = useNavigate();
  const { filters, setFilter, setFilters } = useUrlFilters(MONTHLY_FILTER_SPEC);

  const { data, isLoading, isError, refetch } = useMonthlySheet(filters);
  const rows = data?.data ?? [];
  const cycle = data?.stats.period;

  const lockPeriod = useLockPeriod();
  const [blockers, setBlockers] = useState<string[]>([]);
  const [isDeclaring, setIsDeclaring] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [totalsRow, setTotalsRow] = useState<MonthlyRow | null>(null);

  const yearOptions = useMemo(() => monthlyYearOptions(), []);
  const label = cycleLabel(filters.year, filters.month);

  const now = new Date();
  const isThisMonth = filters.year === now.getFullYear() && filters.month === now.getMonth() + 1;

  /** A cell is only useful if it leads somewhere the day can be settled, and
   *  that is the roster for the date it fell on. */
  const openDayOnRoster = (_row: MonthlyRow, day: MonthlyDay) =>
    navigate(`/attendance?date=${toCalendarDate(day.date)}`);

  const handleLock = () => {
    if (!cycle?.id) return;
    setBlockers([]);
    lockPeriod.mutate(cycle.id, { onError: error => setBlockers(getErrorDetails(error)) });
  };

  return (
    <div className="pb-4">
      <PageHeader
        title="Monthly sheet"
        description="What payroll will be handed. The year and month are the cycle's label, not a calendar filter, so a 26th-to-25th cycle labelled August starts in July."
      />

      {isError ? (
        <ErrorState onRetry={refetch} className="mb-4" />
      ) : (
        <>
          <FilterBar
            actions={
              <Button
                variant="outline"
                className="h-10 w-full sm:h-8 sm:w-auto"
                render={<Link to="/attendance/periods" />}
              >
                <LockKeyhole />
                Periods
              </Button>
            }
          >
            {/* The two selects carry `w-full` on a phone, so they only share a
                line once they are flex children with a basis of their own. */}
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous month"
                onClick={() => setFilters(shiftCycle(filters.year, filters.month, -1))}
                className="size-10 shrink-0 sm:size-8"
              >
                <ChevronLeft />
              </Button>

              <FilterSelect
                value={String(filters.month)}
                onChange={value => setFilter('month', value)}
                options={MONTH_OPTIONS}
                placeholder="Month"
                clearable={false}
                className="min-w-0 flex-1 sm:min-w-36 sm:flex-none"
              />

              <FilterSelect
                value={String(filters.year)}
                onChange={value => setFilter('year', value)}
                options={yearOptions}
                placeholder="Year"
                clearable={false}
                className="w-22 min-w-0 shrink-0 sm:w-auto sm:min-w-28"
              />

              <Button
                variant="outline"
                size="icon"
                aria-label="Next month"
                onClick={() => setFilters(shiftCycle(filters.year, filters.month, 1))}
                className="size-10 shrink-0 sm:size-8"
              >
                <ChevronRight />
              </Button>

              {isThisMonth ? null : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters({ year: now.getFullYear(), month: now.getMonth() + 1 })
                  }
                  className="h-10 w-full sm:h-8 sm:w-auto"
                >
                  This month
                </Button>
              )}
            </div>
          </FilterBar>

          {cycle ? (
            <MonthlyCycleBar
              cycle={cycle}
              employeeCount={data?.pagination.total ?? 0}
              unreconciled={rows.filter(row => !row.reconciles).length}
              isLocking={lockPeriod.isPending}
              onDeclare={() => setIsDeclaring(true)}
              onLock={handleLock}
              onUnlock={() => setIsUnlocking(true)}
              onViewSummary={() => navigate(`/attendance/periods/${cycle.id}/summary`)}
            />
          ) : null}

          <PeriodLockBlockers
            blockers={blockers}
            onDismiss={() => setBlockers([])}
            className="mb-4"
          />

          <MonthlyGrid
            rows={rows}
            isLoading={isLoading}
            emptyState={
              <EmptyState
                icon={CalendarRange}
                title={`Nobody on rolls in ${label}`}
                description="Either the cycle falls before anyone joined, or every employee has left. Pick another month."
              />
            }
            pagination={data?.pagination}
            onPageChange={page => setFilter('page', page)}
            onSelectDay={openDayOnRoster}
            onSelectRow={setTotalsRow}
          />

          <MonthlyLegend />
        </>
      )}

      <PeriodFormSheet
        open={isDeclaring}
        onOpenChange={setIsDeclaring}
        year={filters.year}
        month={filters.month}
      />

      <PeriodUnlockSheet
        open={isUnlocking}
        onOpenChange={setIsUnlocking}
        periodId={cycle?.id ?? null}
        cycleLabel={label}
      />

      <MonthlyTotalsSheet
        open={totalsRow !== null}
        row={totalsRow}
        onOpenChange={open => setTotalsRow(open ? totalsRow : null)}
        onSelectDay={openDayOnRoster}
      />
    </div>
  );
}
