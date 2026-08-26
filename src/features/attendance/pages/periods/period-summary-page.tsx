import { useMemo } from 'react';

import { Link, useParams } from 'react-router';

import { FileText, LockKeyhole } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';
import { FilterSelect, useUrlFilters } from '@/systems/filters';
import { DataTable } from '@/systems/table/data-table';
import { FilterBar } from '@/systems/ui/filter-bar';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import { usePeriod, usePeriodSummary } from '../../api/attendance-period.queries';
import { summaryColumns } from '../../components/periods/summary-columns';
import { cycleLabel } from '../../definitions/attendance-monthly.constants';
import { PERIOD_SUMMARY_FILTER_SPEC } from '../../definitions/attendance-period.constants';
import { periodStatusLookup } from '../../definitions/attendance-period.lookup';

export default function PeriodSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const { filters, setFilter } = useUrlFilters(PERIOD_SUMMARY_FILTER_SPEC);

  const periodQuery = usePeriod(id);
  const summaryQuery = usePeriodSummary(id, filters);

  const period = periodQuery.data?.data;
  const rows = summaryQuery.data?.data ?? [];
  const columns = useMemo(() => summaryColumns(), []);

  /** No endpoint lists the versions, so the ceiling is read off whatever came
   *  back. Inspecting an older snapshot lowers it, which is why the clear entry
   *  reads "Current version": that is the reliable way back to what payroll
   *  sees, whatever number it carries. */
  const newestVersion = Math.max(rows[0]?.version ?? 1, filters.version ?? 1);

  const versionOptions = useMemo(
    () =>
      Array.from({ length: newestVersion }, (_, index) => ({
        value: String(newestVersion - index),
        label: `Version ${newestVersion - index}`,
      })),
    [newestVersion]
  );

  if (periodQuery.isError || summaryQuery.isError) {
    return (
      <div className="pb-4">
        <PageHeader title="Locked summary" />
        <ErrorState
          onRetry={() => {
            periodQuery.refetch();
            summaryQuery.refetch();
          }}
        />
      </div>
    );
  }

  if (periodQuery.isLoading) {
    return (
      <div className="space-y-4 pb-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!period) {
    return (
      <div className="pb-4">
        <PageHeader title="Locked summary" />
        <EmptyState
          icon={LockKeyhole}
          title="Period not found"
          description="It may have been declared under a different label. Pick it from the periods list."
          action={
            <Button size="sm" variant="outline" render={<Link to="/attendance/periods" />}>
              All periods
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader
        title={`${cycleLabel(period.year, period.month)} summary`}
        description="The snapshot payroll reads. Re-locking never overwrites it: the old rows are kept and a new version is inserted beside them."
        actions={
          <Button size="sm" variant="outline" render={<Link to="/attendance/periods" />}>
            <LockKeyhole />
            All periods
          </Button>
        }
      />

      <div className="m-panel m-panel-shine mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3.5">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[10px] tracking-[0.18em] text-text-low uppercase">
            Cycle
          </span>
          <span data-numeric className="text-[13px] font-medium text-text-hi">
            {formatDate(toCalendarDate(period.startDate), 'dd MMM yyyy')} to{' '}
            {formatDate(toCalendarDate(period.endDate), 'dd MMM yyyy')}
          </span>
        </span>

        <LookupBadge lookup={periodStatusLookup} value={period.status} />

        {period.lockedAt ? (
          <span data-numeric className="text-[12px] text-text-low">
            Locked {formatDate(period.lockedAt, 'dd MMM yyyy, HH:mm')}
          </span>
        ) : null}

        {period.unlockReason ? (
          <span className="text-[12px] text-text-mid" title={period.unlockReason}>
            Last unlocked for: {period.unlockReason}
          </span>
        ) : null}
      </div>

      <FilterBar>
        <FilterSelect
          value={filters.version === undefined ? undefined : String(filters.version)}
          onChange={value => setFilter('version', value)}
          options={versionOptions}
          placeholder="Version"
          anyLabel="Current version"
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={rows}
        isLoading={summaryQuery.isLoading}
        pagination={summaryQuery.data?.pagination}
        onPageChange={page => setFilter('page', page)}
        emptyState={
          <EmptyState
            icon={FileText}
            title="No summary for this period"
            description="A summary is written when the period is locked. Lock the month once every day reconciles."
          />
        }
      />
    </div>
  );
}
