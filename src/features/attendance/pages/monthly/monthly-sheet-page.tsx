import { useState } from 'react';

import { Link, useNavigate } from 'react-router';

import { CalendarRange, LockKeyhole } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { getErrorDetails } from '@/lib/api/error';
import { toCalendarDate } from '@/lib/time';
import { useUrlFilters } from '@/systems/filters';
import { FilterBar } from '@/systems/ui/filter-bar';

import { useLockPeriod } from '../../api/attendance-period.mutations';
import { useMonthlySheet } from '../../api/attendance-monthly.queries';
import { CyclePicker } from '../../components/cycle-picker';
import { MonthlyCycleBar } from '../../components/monthly/monthly-cycle-bar';
import { MonthlyGrid } from '../../components/monthly/monthly-grid';
import { MonthlyLegend } from '../../components/monthly/monthly-legend';
import { MonthlyTotalsSheet } from '../../components/monthly/monthly-totals-sheet';
import { PeriodFormSheet } from '../../components/periods/period-form-sheet';
import { PeriodLockBlockers } from '../../components/periods/period-lock-blockers';
import { PeriodUnlockSheet } from '../../components/periods/period-unlock-sheet';
import { cycleLabel, MONTHLY_FILTER_SPEC } from '../../definitions/attendance-monthly.constants';
import type { MonthlyDay, MonthlyRow } from '../../definitions/attendance-monthly.types';

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

  const label = cycleLabel(filters.year, filters.month);

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
            <CyclePicker year={filters.year} month={filters.month} onChange={setFilters} />
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
