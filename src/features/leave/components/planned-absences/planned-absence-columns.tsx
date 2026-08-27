import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Ban } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';
import type { ColumnDef } from '@/systems/table/data-table';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import { plannedAbsenceStatusLookup } from '../../definitions/planned-absence.lookup';
import type { PlannedAbsence } from '../../definitions/planned-absence.types';

type Args = {
  /** The row whose withdraw drawer is already open, so its button cannot be
   *  pressed a second time behind the sheet. */
  pendingId: string | null;
  onCancel: (absence: PlannedAbsence) => void;
};

/** Both bounds are inclusive, so the 5th to the 7th is three days. */
const spanDays = (absence: PlannedAbsence) =>
  differenceInCalendarDays(
    parseISO(toCalendarDate(absence.endDate)),
    parseISO(toCalendarDate(absence.startDate))
  ) + 1;

export function plannedAbsenceColumns({
  pendingId,
  onCancel,
}: Args): ColumnDef<PlannedAbsence>[] {
  return [
    {
      id: 'employee',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="min-w-0">
          <span className="block truncate font-medium text-text-hi">
            {row.original.employee?.fullName ?? 'Unknown employee'}
          </span>
          {row.original.employee ? (
            <span data-numeric className="block text-[11px] text-text-low">
              {row.original.employee.employeeId}
            </span>
          ) : null}
        </div>
      ),
    },

    {
      id: 'leaveType',
      header: 'Leave type',
      cell: ({ row }) =>
        row.original.leaveType ? (
          <div className="min-w-0">
            <span className="block truncate text-text-mid">{row.original.leaveType.name}</span>
            <span data-numeric className="block text-[11px] text-text-low">
              {row.original.leaveType.code}
              {row.original.leaveType.isPaid ? ' - paid' : ' - unpaid'}
            </span>
          </div>
        ) : (
          <span className="text-text-low">-</span>
        ),
    },

    {
      id: 'dates',
      header: 'Dates',
      cell: ({ row }) => {
        const days = spanDays(row.original);

        return (
          <div className="min-w-0">
            <span data-numeric className="block text-text-mid">
              {formatDate(toCalendarDate(row.original.startDate), 'dd MMM yyyy')} to{' '}
              {formatDate(toCalendarDate(row.original.endDate), 'dd MMM yyyy')}
            </span>
            <span data-numeric className="block text-[11px] text-text-low">
              {row.original.isHalfDay ? 'Half day' : `${days} ${days === 1 ? 'day' : 'days'}`}
            </span>
          </div>
        );
      },
    },

    {
      id: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <div className="min-w-0 max-w-64">
          <span className="block truncate text-text-mid" title={row.original.reason}>
            {row.original.reason}
          </span>
          {row.original.cancelReason ? (
            <span
              className="block truncate text-[11px] text-text-low"
              title={row.original.cancelReason}
            >
              Withdrawn: {row.original.cancelReason}
            </span>
          ) : null}
        </div>
      ),
    },

    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <LookupBadge lookup={plannedAbsenceStatusLookup} value={row.original.status} />
      ),
    },

    {
      id: 'actions',
      header: '',
      size: 140,
      meta: { align: 'right' },
      cell: ({ row }) => {
        if (row.original.status === plannedAbsenceStatusLookup.keys.CANCELLED) {
          return <span className="text-text-low">-</span>;
        }

        return (
          <Button
            size="sm"
            variant="outline"
            disabled={pendingId === row.original.id}
            onClick={() => onCancel(row.original)}
            className="h-10 cursor-pointer sm:h-8"
          >
            <Ban />
            Withdraw
          </Button>
        );
      },
    },
  ];
}
