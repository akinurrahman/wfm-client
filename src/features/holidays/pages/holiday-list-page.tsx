import { useMemo, useState } from 'react';

import { CalendarDays, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { USER_ROLES } from '@/constants/ROLES';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';
import { useAuthStore } from '@/stores/auth.store';
import { useConfirmation } from '@/systems/confirmation/hooks/use-confirmation';
import { FilterSelect, useUrlFilters } from '@/systems/filters';
import { DataTable, type ColumnDef } from '@/systems/table/data-table';
import { FilterBar } from '@/systems/ui/filter-bar';
import { RowActions } from '@/systems/ui/row-actions';

import { useDeleteHoliday } from '../api/holiday.mutations';
import { useHolidayList } from '../api/holiday.queries';
import {
  HOLIDAY_FILTER_SPEC,
  HOLIDAY_KIND_OPTIONS,
  holidayYearOptions,
} from '../definitions/holiday.constants';
import type { Holiday } from '../definitions/holiday.types';
import { HolidayFormSheet } from '../components/holiday-form-sheet';

export default function HolidayListPage() {
  const { filters, setFilter, isFiltered, resetFilters } = useUrlFilters(HOLIDAY_FILTER_SPEC);
  const [editing, setEditing] = useState<Holiday | 'new' | null>(null);

  // Employees read this calendar so their own attendance makes sense. The
  // calendar itself is the admin's to write.
  const role = useAuthStore(s => s.user?.role);
  const canManage = role === USER_ROLES.keys.SITE_ADMIN;

  const { data, isLoading, isError, refetch } = useHolidayList(filters);
  const deleteHoliday = useDeleteHoliday();
  const { confirm } = useConfirmation<Holiday>();

  const yearOptions = useMemo(() => holidayYearOptions(), []);

  const summary = data?.data;
  const rows = summary?.data ?? [];

  const askDelete = (holiday: Holiday) =>
    confirm({
      item: holiday,
      title: 'Delete holiday',
      description: item =>
        `${item.names.join(', ')} on ${formatDate(toCalendarDate(item.date), 'dd MMM yyyy')} will go back to being a working day.`,
      variant: 'delete',
      onConfirm: item => deleteHoliday.mutateAsync(item.id).then(() => undefined, () => undefined),
    });

  const columns = useMemo<ColumnDef<Holiday>[]>(() => {
    const base: ColumnDef<Holiday>[] = [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
          const date = toCalendarDate(row.original.date);
          return (
            <div className="min-w-0">
              <span data-numeric className="block font-medium text-text-hi">
                {formatDate(date, 'dd MMM yyyy')}
              </span>
              <span className="block text-[11px] text-text-low">{formatDate(date, 'EEEE')}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'names',
        header: 'Observed as',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.names.map(name => (
              <Badge key={name} variant="secondary">
                {name}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'isOptional',
        header: 'Type',
        cell: ({ row }) => (
          <Badge variant={row.original.isOptional ? 'outline' : 'default'}>
            {row.original.isOptional ? 'Optional' : 'Public'}
          </Badge>
        ),
      },
    ];

    if (!canManage) return base;

    return [
      ...base,
      {
        id: 'actions',
        header: '',
        size: 120,
        meta: { align: 'right' },
        cell: ({ row }) => (
          <RowActions
            subject={row.original.names.join(', ')}
            onEdit={() => setEditing(row.original)}
            onDelete={() => askDelete(row.original)}
          />
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteHoliday, confirm, canManage]);

  return (
    <div className="pb-4">
      <PageHeader
        title="Holidays"
        description={
          canManage
            ? 'The company calendar. Days listed here are not working days, unless marked optional.'
            : 'The company calendar. Days listed here are not working days, unless marked optional. Your admin sets it.'
        }
      />

      {isError ? (
        <ErrorState onRetry={refetch} className="mb-4" />
      ) : (
        <>
          <FilterBar
            isFiltered={isFiltered}
            onReset={resetFilters}
            actions={
              canManage ? (
                <Button
                  className="m-brand-fill h-10 w-full sm:h-8 sm:w-auto"
                  onClick={() => setEditing('new')}
                >
                  <Plus />
                  New holiday
                </Button>
              ) : undefined
            }
          >
            <FilterSelect
              value={String(filters.year)}
              onChange={value => setFilter('year', value)}
              options={yearOptions}
              placeholder="Year"
              clearable={false}
              className="sm:min-w-32"
            />
            <FilterSelect
              value={filters.isOptional}
              onChange={value => setFilter('isOptional', value)}
              options={HOLIDAY_KIND_OPTIONS}
              placeholder="Type"
              anyLabel="All types"
            />
          </FilterBar>

          <DataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            emptyState={
              <EmptyState
                icon={CalendarDays}
                title={`No holidays in ${filters.year}`}
                description={
                  canManage
                    ? 'Add the public holidays for the year so attendance and payroll agree on which days are off.'
                    : 'Nothing has been published for this year yet. Your admin adds them.'
                }
                action={
                  canManage ? (
                    <Button size="sm" className="m-brand-fill" onClick={() => setEditing('new')}>
                      <Plus />
                      New holiday
                    </Button>
                  ) : undefined
                }
              />
            }
          />

          {summary?.count ? (
            <p className="mt-3 text-[12px] text-text-low" data-numeric>
              {summary.count} {summary.count === 1 ? 'holiday' : 'holidays'} in {summary.year}
            </p>
          ) : null}
        </>
      )}

      {canManage ? (
        <HolidayFormSheet
          open={editing !== null}
          holiday={editing === 'new' ? undefined : (editing ?? undefined)}
          onOpenChange={open => setEditing(open ? editing : null)}
        />
      ) : null}
    </div>
  );
}
