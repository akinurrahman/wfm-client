import { Ban } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/systems/table/data-table';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import { plannedAbsenceStatusLookup } from '../../definitions/planned-absence.lookup';
import type { PlannedAbsence } from '../../definitions/planned-absence.types';
import { DatesCell, LeaveTypeCell, ReasonCell } from '../absence-cells';

type Args = {
  /** The row whose withdraw drawer is already open, so its button cannot be
   *  pressed a second time behind the sheet. */
  pendingId: string | null;
  onCancel: (absence: PlannedAbsence) => void;
};

const { PENDING, APPROVED } = plannedAbsenceStatusLookup.keys;

export function myLeaveColumns({ pendingId, onCancel }: Args): ColumnDef<PlannedAbsence>[] {
  return [
    {
      id: 'leaveType',
      header: 'Leave type',
      cell: ({ row }) => <LeaveTypeCell absence={row.original} />,
    },

    {
      id: 'dates',
      header: 'Dates',
      cell: ({ row }) => <DatesCell absence={row.original} />,
    },

    {
      id: 'reason',
      header: 'Reason',
      cell: ({ row }) => <ReasonCell absence={row.original} />,
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
        const absence = row.original;
        // A rejected request authorised nothing, so there is nothing to
        // withdraw and the API refuses it.
        const canWithdraw = absence.status === PENDING || absence.status === APPROVED;

        if (!canWithdraw) return <span className="text-text-low">-</span>;

        return (
          <Button
            size="sm"
            variant="outline"
            disabled={pendingId === absence.id}
            onClick={() => onCancel(absence)}
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
