import { useMemo, useState } from 'react';

import { Link } from 'react-router';

import { CalendarCheck, ChevronLeft, ChevronRight, Settings2, X } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { formatDate } from '@/lib/format';
import { shiftCalendarDate, todayCalendarDate } from '@/lib/time';
import { useUrlFilters } from '@/systems/filters';
import { DataTable } from '@/systems/table/data-table';
import { FilterBar } from '@/systems/ui/filter-bar';

import { useRoster } from '../../api/attendance.queries';
import { AttendanceAuditSheet } from '../../components/roster/attendance-audit-sheet';
import { MarkAttendanceSheet } from '../../components/roster/mark-attendance-sheet';
import { RosterDaySummary } from '../../components/roster/roster-day-summary';
import { rosterColumns } from '../../components/roster/roster-columns';
import { ROSTER_FILTER_SPEC } from '../../definitions/attendance.constants';
import type { RosterRow } from '../../definitions/attendance.types';

export default function RosterPage() {
  const { filters, setFilter } = useUrlFilters(ROSTER_FILTER_SPEC);

  const { data, isLoading, isError, refetch } = useRoster(filters);
  const rows = useMemo(() => data?.data ?? [], [data]);

  const [marking, setMarking] = useState<RosterRow[] | null>(null);
  const [auditRow, setAuditRow] = useState<RosterRow | null>(null);

  /** A selection only means anything for the page it was made on, so it is
   *  stamped with the day and page it belongs to and read as empty once either
   *  moves. Resetting during render beats an effect, which would let one paint
   *  through with rows selected that are no longer on screen. */
  const token = `${filters.date}|${filters.page}`;
  const [selection, setSelection] = useState({ token, ids: [] as string[] });
  const selectedIds = selection.token === token ? selection.ids : [];

  const selectableIds = useMemo(
    () => rows.filter(row => row.isEditable).map(row => row.employee.id),
    [rows]
  );

  const setSelectedIds = (ids: string[]) => setSelection({ token, ids });

  const columns = useMemo(
    () =>
      rosterColumns({
        selectedIds,
        selectableIds,
        onToggleRow: (employeeId, checked) =>
          setSelectedIds(
            checked ? [...selectedIds, employeeId] : selectedIds.filter(id => id !== employeeId)
          ),
        onToggleAll: checked => setSelectedIds(checked ? selectableIds : []),
        onMark: row => setMarking([row]),
        onHistory: row => setAuditRow(row),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, selectableIds]
  );

  const selectedRows = rows.filter(row => selectedIds.includes(row.employee.id));
  const isToday = filters.date === todayCalendarDate();

  return (
    <div className="pb-4">
      <PageHeader
        title="Daily roster"
        description="Every employee on rolls for the day, marked or not. A row that has not been decided reads as a description, not a fact."
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
                render={<Link to="/attendance/tools" />}
              >
                <Settings2 />
                Attendance tools
              </Button>
            }
          >
            <DateStepper
              value={filters.date}
              onChange={date => setFilter('date', date)}
              isToday={isToday}
            />
          </FilterBar>

          <RosterDaySummary rows={rows} total={data?.pagination.total ?? 0} />

          {selectedRows.length ? (
            <div className="m-panel mb-4 flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
              <p className="text-[13px] text-text-mid">
                <span data-numeric className="font-medium text-text-hi">
                  {selectedRows.length}
                </span>{' '}
                {selectedRows.length === 1 ? 'day' : 'days'} selected
              </p>

              <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-center">
                <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                  <X />
                  Clear selection
                </Button>
                <Button
                  size="sm"
                  className="m-brand-fill"
                  onClick={() => setMarking(selectedRows)}
                >
                  Mark {selectedRows.length} selected
                </Button>
              </div>
            </div>
          ) : null}

          <DataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={page => setFilter('page', page)}
            emptyState={
              <EmptyState
                icon={CalendarCheck}
                title={`Nobody on rolls for ${formatDate(filters.date, 'dd MMM yyyy')}`}
                description="Either the date is before anyone joined, or every employee has left. Pick another day."
              />
            }
          />
        </>
      )}

      <MarkAttendanceSheet
        open={marking !== null}
        targets={marking ?? []}
        filters={filters}
        onOpenChange={open => {
          if (open) return;
          setMarking(null);
          setSelectedIds([]);
        }}
      />

      <AttendanceAuditSheet
        open={auditRow !== null}
        row={auditRow}
        onOpenChange={open => setAuditRow(open ? auditRow : null)}
      />
    </div>
  );
}

/** The roster is a day at a time, and HR walks it forwards. Stepping beats
 *  reopening a calendar for every one of them, so the picker keeps its place
 *  for the jumps and the arrows carry the routine. */
function DateStepper({
  value,
  onChange,
  isToday,
}: {
  value: string;
  onChange: (date: string) => void;
  isToday: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous day"
        onClick={() => onChange(shiftCalendarDate(value, -1))}
        className="size-10 sm:size-8"
      >
        <ChevronLeft />
      </Button>

      <DatePicker
        date={value}
        onDateChange={next => onChange(next ?? todayCalendarDate())}
        ariaLabel="Roster date"
        className="h-10 w-auto min-w-52 sm:h-8"
      />

      <Button
        variant="outline"
        size="icon"
        aria-label="Next day"
        onClick={() => onChange(shiftCalendarDate(value, 1))}
        className="size-10 sm:size-8"
      >
        <ChevronRight />
      </Button>

      {/* Kept on the same baseline as the controls: a caption stacked under the
          picker makes the arrows centre against a two-line block. */}
      <span className="text-[12px] text-text-low">{formatDate(value, 'EEEE')}</span>

      {isToday ? null : (
        <Button variant="ghost" size="sm" onClick={() => onChange(todayCalendarDate())}>
          Today
        </Button>
      )}
    </div>
  );
}
