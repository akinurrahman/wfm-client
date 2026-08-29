import { useCallback, useMemo, useState } from 'react';

import { CalendarOff, Plus } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { fetchEmployeeOptions } from '@/features/employees';
import { useConfirmation } from '@/systems/confirmation/hooks/use-confirmation';
import {
  FilterAsyncSelect,
  FilterPopover,
  useUrlFilters,
  type FilterConfig,
} from '@/systems/filters';
import type { Option } from '@/systems/form';
import { DataTable } from '@/systems/table/data-table';
import { FilterBar } from '@/systems/ui/filter-bar';

import { useApprovePlannedAbsence } from '../../api/planned-absence.mutations';
import { usePlannedAbsenceList } from '../../api/planned-absence.queries';
import { PlannedAbsenceCancelSheet } from '../../components/planned-absences/planned-absence-cancel-sheet';
import { plannedAbsenceColumns } from '../../components/planned-absences/planned-absence-columns';
import { PlannedAbsenceFormSheet } from '../../components/planned-absences/planned-absence-form-sheet';
import { PlannedAbsenceRejectSheet } from '../../components/planned-absences/planned-absence-reject-sheet';

import { PLANNED_ABSENCE_FILTER_SPEC } from '../../definitions/planned-absence.constants';
import { plannedAbsenceStatusLookup } from '../../definitions/planned-absence.lookup';
import type { PlannedAbsence } from '../../definitions/planned-absence.types';

export default function PlannedAbsenceListPage() {
  const { filters, setFilter, isFiltered, resetFilters } = useUrlFilters(
    PLANNED_ABSENCE_FILTER_SPEC
  );

  const { data, isLoading, isError, refetch } = usePlannedAbsenceList(filters);
  const rows = data?.data ?? [];

  const [isFiling, setIsFiling] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<PlannedAbsence | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PlannedAbsence | null>(null);

  const { mutateAsync: approveAbsence } = useApprovePlannedAbsence();
  const { confirm } = useConfirmation<PlannedAbsence>();

  /** Approving is the write that rewrites closed days, and the 409s it can come
   *  back with (a locked period, a second approval over the same dates) are not
   *  worth discovering by accident. */
  const askApprove = useCallback(
    (absence: PlannedAbsence) =>
      confirm({
        item: absence,
        title: 'Approve leave',
        description: item =>
          `${item.employee?.fullName ?? 'This employee'} goes on leave for the whole window. Days already closed as absent flip to on leave, and any day a punch contradicts is reported back for you to settle.`,
        variant: 'confirm',
        onConfirm: item =>
          approveAbsence(item.id).then(
            () => undefined,
            () => undefined
          ),
      }),
    [confirm, approveAbsence]
  );

  /** A shared link arrives with an id and no name. The rows it filtered already
   *  carry that name, so the picker is seeded from them rather than fetching the
   *  employee a second time. */
  const employeeOptions = useMemo<Option[]>(() => {
    const employee = data?.data.find(row => row.employee?.id === filters.employeeId)?.employee;
    return employee
      ? [{ value: employee.id, label: `${employee.fullName} (${employee.employeeId})` }]
      : [];
  }, [data, filters.employeeId]);

  const filterConfig = useMemo<FilterConfig[]>(
    () => [
      {
        key: PLANNED_ABSENCE_FILTER_SPEC.from.param,
        label: 'From',
        type: 'date',
        placeholder: 'Any start',
      },
      {
        key: PLANNED_ABSENCE_FILTER_SPEC.to.param,
        label: 'To',
        type: 'date',
        placeholder: 'Any end',
      },
      {
        key: PLANNED_ABSENCE_FILTER_SPEC.status.param,
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
    () =>
      plannedAbsenceColumns({
        pendingId: cancelTarget?.id ?? rejectTarget?.id ?? null,
        onApprove: askApprove,
        onReject: setRejectTarget,
        onCancel: setCancelTarget,
      }),
    [cancelTarget, rejectTarget, askApprove]
  );

  return (
    <div className="pb-4">
      <PageHeader
        title="Leave"
        description="Requests employees file and leave you record yourself. Filter to Pending for the approval queue: a pending request moves no attendance day, approving it is what rewrites days already closed, and days a punch contradicts are reported back rather than guessed at."
      />

      {isError ? (
        <ErrorState onRetry={refetch} className="mb-4" />
      ) : (
        <>
          {/* No reset here: the popover carries its own Clear, and two clear
              affordances in one row is one too many. */}
          <FilterBar
            actions={
              <Button
                className="m-brand-fill h-10 w-full cursor-pointer sm:h-8 sm:w-auto"
                onClick={() => setIsFiling(true)}
              >
                <Plus />
                File leave
              </Button>
            }
          >
            <FilterAsyncSelect
              value={filters.employeeId}
              onChange={value => setFilter('employeeId', value)}
              fetchOptions={fetchEmployeeOptions}
              placeholder="Filter by employee"
              anyLabel="All employees"
              searchPlaceholder="Name or badge code"
              emptyMessage="No employees found."
              initialOptions={employeeOptions}
              className="sm:w-56"
            />
            <FilterPopover
              config={filterConfig}
              // A narrower filter must not land on an empty page 7.
              resetOnApply={[PLANNED_ABSENCE_FILTER_SPEC.page.param]}
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
                  description="The date filters match by overlap, so a leave running across the boundary still shows up. Try a wider window or a different employee."
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
                  title="No leave on record"
                  description="Nothing has been requested or filed yet. Filing one here records a leave settled offline and approves it in the same step."
                  action={
                    <Button
                      size="sm"
                      className="m-brand-fill cursor-pointer"
                      onClick={() => setIsFiling(true)}
                    >
                      <Plus />
                      File leave
                    </Button>
                  }
                />
              )
            }
          />
        </>
      )}

      <PlannedAbsenceFormSheet open={isFiling} onOpenChange={setIsFiling} />

      <PlannedAbsenceRejectSheet
        open={rejectTarget !== null}
        onOpenChange={open => setRejectTarget(open ? rejectTarget : null)}
        absence={rejectTarget}
      />

      <PlannedAbsenceCancelSheet
        open={cancelTarget !== null}
        onOpenChange={open => setCancelTarget(open ? cancelTarget : null)}
        absence={cancelTarget}
      />
    </div>
  );
}
