import { Ban, Check, X } from 'lucide-react';

import type { ColumnDef } from '@/systems/table/data-table';
import { LookupBadge } from '@/systems/ui/lookup-badge';
import { RowActionsMenu, type RowAction } from '@/systems/ui/row-actions-menu';

import { plannedAbsenceStatusLookup } from '../../definitions/planned-absence.lookup';
import type { PlannedAbsence } from '../../definitions/planned-absence.types';
import { DatesCell, LeaveTypeCell, ReasonCell } from '../absence-cells';

type Args = {
  /** The row whose drawer is already open, so its actions cannot be fired a
   *  second time from behind the sheet. */
  pendingId: string | null;
  onApprove: (absence: PlannedAbsence) => void;
  onReject: (absence: PlannedAbsence) => void;
  onCancel: (absence: PlannedAbsence) => void;
};

const { PENDING, APPROVED } = plannedAbsenceStatusLookup.keys;

export function plannedAbsenceColumns({
  pendingId,
  onApprove,
  onReject,
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
      size: 80,
      meta: { align: 'right' },
      cell: ({ row }) => {
        const absence = row.original;
        const isBusy = pendingId === absence.id;
        const actions: RowAction[] = [];

        if (absence.status === PENDING) {
          actions.push(
            {
              label: 'Approve',
              icon: Check,
              onSelect: () => onApprove(absence),
              disabled: isBusy,
            },
            {
              label: 'Reject',
              icon: X,
              variant: 'destructive',
              onSelect: () => onReject(absence),
              disabled: isBusy,
            }
          );
        }

        // Rejected and cancelled requests are terminal, and a rejected one
        // refuses a withdrawal outright: it never authorised a day.
        if (absence.status === PENDING || absence.status === APPROVED) {
          actions.push({
            label: 'Withdraw',
            icon: Ban,
            variant: 'destructive',
            onSelect: () => onCancel(absence),
            disabled: isBusy,
          });
        }

        if (actions.length === 0) return <span className="text-text-low">-</span>;

        return (
          <RowActionsMenu
            subject={absence.employee?.fullName ?? 'this request'}
            actions={actions}
          />
        );
      },
    },
  ];
}
