import { useMemo, useState } from 'react';

import { Clock, Moon, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { SearchInput } from '@/components/shared/search-input';
import { formatDuration, weekdayLabel } from '@/lib/time';
import { useConfirmation } from '@/systems/confirmation/hooks/use-confirmation';
import { FilterSelect, useUrlFilters } from '@/systems/filters';
import { DataTable, type ColumnDef } from '@/systems/table/data-table';
import { FilterBar } from '@/systems/ui/filter-bar';
import { RowActions } from '@/systems/ui/row-actions';

import { useDeleteShift } from '../api/shift.mutations';
import { useShiftList } from '../api/shift.queries';
import { ACTIVE_OPTIONS, SHIFT_FILTER_SPEC } from '../definitions/shift.constants';
import type { Shift } from '../definitions/shift.types';
import { ShiftFormSheet } from '../components/shift-form-sheet';

export default function ShiftListPage() {
  const { filters, setFilter, isFiltered, resetFilters } = useUrlFilters(SHIFT_FILTER_SPEC);
  const [editing, setEditing] = useState<Shift | 'new' | null>(null);

  const { data, isLoading, isError, refetch } = useShiftList(filters);
  const deleteShift = useDeleteShift();
  const { confirm } = useConfirmation<Shift>();

  const askDelete = (shift: Shift) =>
    confirm({
      item: shift,
      title: 'Delete shift',
      description: item =>
        `${item.name} will be removed. Employees on it lose their schedule until they are moved to another shift.`,
      variant: 'delete',
      onConfirm: item => deleteShift.mutateAsync(item.id).then(() => undefined, () => undefined),
    });

  const columns = useMemo<ColumnDef<Shift>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Shift',
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="block font-medium text-text-hi">{row.original.name}</span>
            <span className="block font-mono text-[11px] tracking-wide text-text-low">
              {row.original.code}
            </span>
          </div>
        ),
      },
      {
        id: 'window',
        header: 'Window',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span data-numeric className="text-text-mid">
              {row.original.startTime} - {row.original.endTime}
            </span>
            {row.original.isNightShift ? (
              <Badge variant="outline" title="Crosses midnight">
                <Moon />
                Night
              </Badge>
            ) : null}
          </div>
        ),
      },
      {
        id: 'netShiftMinutes',
        header: 'Net hours',
        meta: { align: 'right' },
        cell: ({ row }) => (
          <span data-numeric className="text-text-mid">
            {formatDuration(row.original.netShiftMinutes)}
          </span>
        ),
      },
      {
        id: 'weeklyOffDays',
        header: 'Weekly offs',
        cell: ({ row }) =>
          row.original.weeklyOffDays.length ? (
            <div className="flex flex-wrap gap-1">
              {[...row.original.weeklyOffDays]
                .sort((a, b) => a - b)
                .map(day => (
                  <Badge key={day} variant="secondary">
                    {weekdayLabel(day)}
                  </Badge>
                ))}
            </div>
          ) : (
            <span className="text-text-low">None</span>
          ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? 'settled' : 'secondary'}>
            {row.original.isActive ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 120,
        meta: { align: 'right' },
        cell: ({ row }) => (
          <RowActions
            subject={row.original.name}
            onEdit={() => setEditing(row.original)}
            onDelete={() => askDelete(row.original)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteShift, confirm]
  );

  return (
    <div className="pb-4">
      <PageHeader
        title="Shifts"
        description="Working hours attendance is measured against. Every employee is assigned one."
      />

      {isError ? (
        <ErrorState onRetry={refetch} className="mb-4" />
      ) : (
        <>
          <FilterBar
            isFiltered={isFiltered}
            onReset={resetFilters}
            actions={
              <Button
                className="m-brand-fill h-10 w-full sm:h-8 sm:w-auto"
                onClick={() => setEditing('new')}
              >
                <Plus />
                New shift
              </Button>
            }
          >
            <SearchInput
              value={filters.search}
              onChange={value => setFilter('search', value)}
              placeholder="Search name or code"
              label="Search shifts"
              className="sm:w-64"
            />
            <FilterSelect
              value={filters.isActive}
              onChange={value => setFilter('isActive', value)}
              options={ACTIVE_OPTIONS}
              placeholder="Status"
              anyLabel="Any status"
            />
          </FilterBar>

          <DataTable
            columns={columns}
            data={data?.data ?? []}
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={page => setFilter('page', page)}
            emptyState={
              isFiltered ? (
                <EmptyState
                  icon={Clock}
                  title="No shifts match these filters"
                  description="Try a different status, or clear the search."
                  action={
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No shifts yet"
                  description="Add the shift most of your staff work, then refine from there."
                  action={
                    <Button size="sm" className="m-brand-fill" onClick={() => setEditing('new')}>
                      <Plus />
                      New shift
                    </Button>
                  }
                />
              )
            }
          />
        </>
      )}

      <ShiftFormSheet
        open={editing !== null}
        shift={editing === 'new' ? undefined : (editing ?? undefined)}
        onOpenChange={open => setEditing(open ? editing : null)}
      />
    </div>
  );
}
