import { AlertTriangle, History, Pencil, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDuration, instantToClock, minutesToTime } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@/systems/table/data-table';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import {
  attendanceSourceLookup,
  dayTypeLookup,
  rosterStatusLookup,
} from '../../definitions/attendance.lookup';
import type { RosterRow } from '../../definitions/attendance.types';

const VARIANCE_CHIPS = [
  { field: 'lateMinutes', label: 'Late', tone: 'text-awaiting' },
  { field: 'earlyExitMinutes', label: 'Early', tone: 'text-awaiting' },
  { field: 'overtimeMinutes', label: 'OT', tone: 'text-settled' },
] as const;

type Args = {
  selectedIds: string[];
  /** Only editable rows can be selected, so a future day cannot be swept into
   *  a bulk save the API would refuse. */
  selectableIds: string[];
  onToggleRow: (employeeId: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onMark: (row: RosterRow) => void;
  onHistory: (row: RosterRow) => void;
};

export function rosterColumns({
  selectedIds,
  selectableIds,
  onToggleRow,
  onToggleAll,
  onMark,
  onHistory,
}: Args): ColumnDef<RosterRow>[] {
  const allSelected = selectableIds.length > 0 && selectedIds.length === selectableIds.length;

  return [
    {
      id: 'select',
      size: 44,
      header: () => (
        <Checkbox
          checked={allSelected}
          indeterminate={selectedIds.length > 0 && !allSelected}
          disabled={selectableIds.length === 0}
          onCheckedChange={checked => onToggleAll(Boolean(checked))}
          aria-label="Select every markable row on this page"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.original.employee.id)}
          disabled={!row.original.isEditable}
          onCheckedChange={checked => onToggleRow(row.original.employee.id, Boolean(checked))}
          aria-label={`Select ${row.original.employee.fullName}`}
        />
      ),
    },

    {
      accessorKey: 'employee',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="min-w-0">
          <span className="block font-medium text-text-hi">{row.original.employee.fullName}</span>
          <span className="block text-[11px] text-text-low">
            <span data-numeric className="font-mono tracking-wide">
              {row.original.employee.employeeId}
            </span>
            {row.original.employee.designation ? ` Â· ${row.original.employee.designation}` : null}
          </span>
        </div>
      ),
    },

    {
      id: 'shift',
      header: 'Shift',
      cell: ({ row }) =>
        row.original.shift ? (
          <div className="min-w-0">
            <span data-numeric className="block text-text-mid">
              {minutesToTime(row.original.shift.startMinutes)} -{' '}
              {minutesToTime(row.original.shift.endMinutes)}
            </span>
            <span className="block font-mono text-[11px] tracking-wide text-text-low">
              {row.original.shift.code}
            </span>
          </div>
        ) : (
          <Badge variant="awaiting" title="The day cannot be judged until this employee has a shift">
            No shift
          </Badge>
        ),
    },

    {
      accessorKey: 'dayType',
      header: 'Day',
      cell: ({ row }) => <LookupBadge lookup={dayTypeLookup} value={row.original.dayType} />,
    },

    {
      accessorKey: 'status',
      header: 'Status',
      // Three states have to stay visually distinct: nothing has decided this
      // day, the device decided it, or HR overruled it. The dashed outline
      // carries the first, the source line beside the badge the other two.
      cell: ({ row }) => {
        const label =
          rosterStatusLookup.resolve(row.original.status)?.label ?? row.original.status;

        if (!row.original.isMarked) {
          return (
            <Badge
              variant="outline"
              className="border-dashed text-text-low"
              title="Nothing has decided this day yet - this is only how it currently reads"
            >
              {label}
            </Badge>
          );
        }

        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <LookupBadge lookup={rosterStatusLookup} value={row.original.status} />

            {row.original.source ? (
              <span className="meta-label text-text-low">
                {attendanceSourceLookup.resolve(row.original.source)?.label}
              </span>
            ) : null}

            {row.original.hasConflict ? (
              <span
                role="img"
                aria-label="Conflict"
                title={
                  row.original.attendance?.conflictNote ?? 'This day needs a human to settle it'
                }
              >
                <AlertTriangle aria-hidden className="size-3.5 text-overdue" />
              </span>
            ) : null}
          </div>
        );
      },
    },

    {
      id: 'times',
      header: 'In / out',
      cell: ({ row }) => {
        const attendance = row.original.attendance;
        const checkIn = instantToClock(attendance?.checkIn);
        const checkOut = instantToClock(attendance?.checkOut);

        if (!checkIn && !checkOut) return <span className="text-text-low">-</span>;

        return (
          <div className="min-w-0">
            <span data-numeric className="block text-text-mid">
              {checkIn ?? '--:--'} - {checkOut ?? '--:--'}
            </span>
            {attendance?.workedMinutes ? (
              <span data-numeric className="block text-[11px] text-text-low">
                {formatDuration(attendance.workedMinutes)} worked
              </span>
            ) : null}
          </div>
        );
      },
    },

    {
      id: 'variance',
      header: 'Variance',
      cell: ({ row }) => {
        const attendance = row.original.attendance;
        if (!attendance) return <span className="text-text-low">-</span>;

        const chips = VARIANCE_CHIPS.map(chip => ({
          ...chip,
          minutes: attendance[chip.field] ?? 0,
        })).filter(chip => chip.minutes > 0);

        if (!chips.length) return <span className="text-text-low">On time</span>;

        return (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {chips.map(chip => (
              <span key={chip.label} className="flex items-baseline gap-1">
                <span className="meta-label text-text-low">
                  {chip.label}
                </span>
                <span data-numeric className={cn('text-[12px] font-medium', chip.tone)}>
                  {formatDuration(chip.minutes)}
                </span>
              </span>
            ))}
          </div>
        );
      },
    },

    {
      id: 'actions',
      header: '',
      size: 150,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            disabled={!row.original.isEditable}
            onClick={() => onMark(row.original)}
            title={row.original.isEditable ? undefined : 'A future day can be read, not marked'}
            className="h-10 sm:h-8"
          >
            {row.original.isMarked ? <Pencil /> : <Plus />}
            {row.original.isMarked ? 'Correct' : 'Mark'}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            disabled={!row.original.attendance}
            onClick={() => onHistory(row.original)}
            aria-label={`History for ${row.original.employee.fullName}`}
            title={
              row.original.attendance ? undefined : 'Nothing has decided this day yet'
            }
            className="size-10 sm:size-8"
          >
            <History />
          </Button>
        </div>
      ),
    },
  ];
}
