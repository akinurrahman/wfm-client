import { useMemo, useState } from 'react';

import { CalendarOff, Plus } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { getErrorStatus } from '@/lib/api/error';
import { FilterPopover, useUrlFilters, type FilterConfig } from '@/systems/filters';
import { DataTable } from '@/systems/table/data-table';
import { FilterBar } from '@/systems/ui/filter-bar';

import { useMyLeaveList } from '../../api/my-leave.queries';
import { MyLeaveApplySheet } from '../../components/my-leave/my-leave-apply-sheet';
import { MyLeaveCancelSheet } from '../../components/my-leave/my-leave-cancel-sheet';
import { myLeaveColumns } from '../../components/my-leave/my-leave-columns';
import { MY_LEAVE_FILTER_SPEC } from '../../definitions/my-leave.constants';
import { plannedAbsenceStatusLookup } from '../../definitions/planned-absence.lookup';
import type { PlannedAbsence } from '../../definitions/planned-absence.types';

export default function MyLeaveListPage() {
  const { filters, setFilter, isFiltered, resetFilters } = useUrlFilters(MY_LEAVE_FILTER_SPEC);

  const { data, isLoading, isError, error, refetch } = useMyLeaveList(filters);
  const rows = data?.data ?? [];

  const [isApplying, setIsApplying] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<PlannedAbsence | null>(null);

  const filterConfig = useMemo<FilterConfig[]>(
    () => [
      {
        key: MY_LEAVE_FILTER_SPEC.from.param,
        label: 'From',
        type: 'date',
        placeholder: 'Any start',
      },
      {
        key: MY_LEAVE_FILTER_SPEC.to.param,
        label: 'To',
        type: 'date',
        placeholder: 'Any end',
      },
      {
        key: MY_LEAVE_FILTER_SPEC.status.param,
        label: 'Status',
        type: 'select',
        span: 'full',
        placeholder: 'Any status',
        // `#` is the popover's clear sentinel: applying it drops the param.
        options: [{ value: '#', label: 'Any status' }, ...plannedAbsenceStatusLookup.options],
      },
    ],
    []
  );

  const columns = useMemo(
    () => myLeaveColumns({ pendingId: cancelTarget?.id ?? null, onCancel: setCancelTarget }),
    [cancelTarget]
  );

  // A login with no employee record behind it cannot have leave, and retrying
  // will not give it one.
  if (isError && getErrorStatus(error) === 403) {
    return (
      <EmptyState
        icon={CalendarOff}
        title="No employee record linked to this account"
        description="Leave is filed against an employee record, and your login is not connected to one yet. Ask HR to link it."
      />
    );
  }

  return (
    <div className="pb-4">
      <PageHeader
        title="My leave"
        description="Everything you have asked for and everything settled on your behalf. A request changes no attendance day until your admin approves it."
      />

      {isError ? (
        <ErrorState onRetry={refetch} className="mb-4" />
      ) : (
        <>
          <FilterBar
            actions={
              <Button
                className="m-brand-fill h-10 w-full cursor-pointer sm:h-8 sm:w-auto"
                onClick={() => setIsApplying(true)}
              >
                <Plus />
                Request leave
              </Button>
            }
          >
            <FilterPopover
              config={filterConfig}
              // A narrower filter must not land on an empty page 7.
              resetOnApply={[MY_LEAVE_FILTER_SPEC.page.param]}
              className="h-10 w-full cursor-pointer sm:h-8 sm:w-auto"
            />
          </FilterBar>

          <DataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={page => setFilter('page', page)}
            emptyState={
              isFiltered ? (
                <EmptyState
                  icon={CalendarOff}
                  title="No leave matches these filters"
                  description="The date filters match by overlap, so leave running across the boundary still shows up. Try a wider window."
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="cursor-pointer"
                    >
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={CalendarOff}
                  title="No leave yet"
                  description="Request the days you need. It goes to your admin, and you can withdraw it while it waits."
                  action={
                    <Button
                      size="sm"
                      className="m-brand-fill cursor-pointer"
                      onClick={() => setIsApplying(true)}
                    >
                      <Plus />
                      Request leave
                    </Button>
                  }
                />
              )
            }
          />
        </>
      )}

      <MyLeaveApplySheet open={isApplying} onOpenChange={setIsApplying} />

      <MyLeaveCancelSheet
        open={cancelTarget !== null}
        onOpenChange={open => setCancelTarget(open ? cancelTarget : null)}
        absence={cancelTarget}
      />
    </div>
  );
}
