import { useMemo, useState } from 'react';

import { Link, useNavigate } from 'react-router';

import { CalendarRange, LockKeyhole, Plus } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { getErrorDetails } from '@/lib/api/error';
import { FilterSelect, useUrlFilters } from '@/systems/filters';
import { DataTable } from '@/systems/table/data-table';
import { FilterBar } from '@/systems/ui/filter-bar';

import { useLockPeriod } from '../../api/attendance-period.mutations';
import { usePeriodList } from '../../api/attendance-period.queries';
import { periodColumns } from '../../components/periods/period-columns';
import { PeriodFormSheet } from '../../components/periods/period-form-sheet';
import { PeriodLockBlockers } from '../../components/periods/period-lock-blockers';
import { PeriodUnlockSheet } from '../../components/periods/period-unlock-sheet';
import {
  cycleLabel,
  monthlyYearOptions,
} from '../../definitions/attendance-monthly.constants';
import { PERIOD_FILTER_SPEC } from '../../definitions/attendance-period.constants';
import { periodStatusLookup } from '../../definitions/attendance-period.lookup';
import type { AttendancePeriod } from '../../definitions/attendance-period.types';

export default function PeriodListPage() {
  const navigate = useNavigate();
  const { filters, setFilter, isFiltered, resetFilters } = useUrlFilters(PERIOD_FILTER_SPEC);

  const { data, isLoading, isError, refetch } = usePeriodList(filters);
  const rows = data?.data ?? [];

  const lockPeriod = useLockPeriod();
  const [blockers, setBlockers] = useState<string[]>([]);
  const [lockingId, setLockingId] = useState<string | null>(null);
  const [isDeclaring, setIsDeclaring] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState<AttendancePeriod | null>(null);

  const yearOptions = useMemo(() => monthlyYearOptions(), []);

  const columns = useMemo(
    () =>
      periodColumns({
        lockingId,
        onLock: period => {
          setBlockers([]);
          setLockingId(period.id);
          lockPeriod.mutate(period.id, {
            onError: error => setBlockers(getErrorDetails(error)),
            onSettled: () => setLockingId(null),
          });
        },
        onUnlock: setUnlockTarget,
        onViewSummary: period => navigate(`/attendance/periods/${period.id}/summary`),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lockingId]
  );

  return (
    <div className="pb-4">
      <PageHeader
        title="Attendance periods"
        description="The cycles payroll is paid against. A period is born open and only lock and unlock move it: there is no edit and no delete, because moving the boundaries once rows exist would re-scope what is already locked."
      />

      {isError ? (
        <ErrorState onRetry={refetch} className="mb-4" />
      ) : (
        <>
          <FilterBar
            isFiltered={isFiltered}
            onReset={resetFilters}
            actions={
              // `contents` from sm up, so the pair only exists as a row on a
              // phone and the toolbar lays the buttons out itself on desktop.
              <div className="flex gap-2 sm:contents">
                <Button
                  variant="outline"
                  className="h-10 flex-1 sm:h-8 sm:w-auto sm:flex-none"
                  render={<Link to="/attendance/monthly" />}
                >
                  <CalendarRange />
                  Monthly sheet
                </Button>
                <Button
                  className="m-brand-fill h-10 flex-1 sm:h-8 sm:w-auto sm:flex-none"
                  onClick={() => setIsDeclaring(true)}
                >
                  <Plus />
                  Declare period
                </Button>
              </div>
            }
          >
            {/* Both selects carry `w-full` on a phone, so they only share a line
                once they are flex children with a basis of their own. */}
            <div className="flex w-full gap-2 sm:contents">
              <FilterSelect
                value={filters.year === undefined ? undefined : String(filters.year)}
                onChange={value => setFilter('year', value)}
                options={yearOptions}
                placeholder="Year"
                anyLabel="All years"
                className="min-w-0 flex-1 sm:flex-none"
              />
              <FilterSelect
                value={filters.status}
                onChange={value => setFilter('status', value)}
                options={periodStatusLookup.options}
                placeholder="Status"
                anyLabel="All statuses"
                className="min-w-0 flex-1 sm:flex-none"
              />
            </div>
          </FilterBar>

          <PeriodLockBlockers
            blockers={blockers}
            onDismiss={() => setBlockers([])}
            className="mb-4"
          />

          <DataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={page => setFilter('page', page)}
            emptyState={
              <EmptyState
                icon={LockKeyhole}
                title="No periods declared"
                description="Without a period the monthly sheet falls back to the calendar month and nothing can be locked. Declare one per payroll cycle."
                action={
                  <Button size="sm" className="m-brand-fill" onClick={() => setIsDeclaring(true)}>
                    <Plus />
                    Declare period
                  </Button>
                }
              />
            }
          />
        </>
      )}

      <PeriodFormSheet
        open={isDeclaring}
        onOpenChange={setIsDeclaring}
        year={new Date().getFullYear()}
        month={new Date().getMonth() + 1}
      />

      <PeriodUnlockSheet
        open={unlockTarget !== null}
        onOpenChange={open => setUnlockTarget(open ? unlockTarget : null)}
        periodId={unlockTarget?.id ?? null}
        cycleLabel={
          unlockTarget ? cycleLabel(unlockTarget.year, unlockTarget.month) : 'this period'
        }
      />
    </div>
  );
}
