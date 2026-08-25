import { Eye, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import type { ColumnDef } from '@/systems/table/data-table';
import { LookupBadge } from '@/systems/ui/lookup-badge';
import { RowActionsMenu } from '@/systems/ui/row-actions-menu';

import { employeeTypeLookup } from '../../definitions/employee.lookup';
import type { EmployeeListItem } from '../../definitions/employee.types';

type Handlers = {
  onView: (employee: EmployeeListItem) => void;
  onEdit: (employee: EmployeeListItem) => void;
  onDelete: (employee: EmployeeListItem) => void;
};

export const employeeColumns = ({
  onView,
  onEdit,
  onDelete,
}: Handlers): ColumnDef<EmployeeListItem>[] => [
  {
    accessorKey: 'fullName',
    header: 'Employee',
    cell: ({ row }) => (
      <div className="min-w-0">
        <span className="block font-medium text-text-hi">{row.original.fullName}</span>
        <span className="block font-mono text-[11px] tracking-wide text-text-low">
          {row.original.employeeId}
        </span>
      </div>
    ),
  },
  {
    id: 'designation',
    header: 'Designation',
    cell: ({ row }) => <span className="text-text-mid">{row.original.designation.title}</span>,
  },
  {
    accessorKey: 'employeeType',
    header: 'Type',
    cell: ({ row }) => (
      <LookupBadge lookup={employeeTypeLookup} value={row.original.employeeType} />
    ),
  },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => (
      <div className="min-w-0">
        <span data-numeric className="block text-text-mid">
          {row.original.phoneNumber}
        </span>
        <span className="block truncate text-[12px] text-text-low">{row.original.user.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'dateOfJoining',
    header: 'Joined',
    cell: ({ row }) => (
      <span data-numeric className="text-text-mid">
        {formatDate(row.original.dateOfJoining, 'dd MMM yyyy')}
      </span>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'settled' : 'secondary'}>
        {row.original.isActive ? 'On rolls' : 'Exited'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: '',
    size: 120,
    meta: { align: 'right' },
    cell: ({ row }) => (
      // The row itself opens the record, so the menu has to keep its clicks to
      // itself.
      <div onClick={event => event.stopPropagation()}>
        <RowActionsMenu
          subject={row.original.fullName}
          actions={[
            { label: 'View profile', icon: Eye, onSelect: () => onView(row.original) },
            { label: 'Edit', icon: Pencil, onSelect: () => onEdit(row.original) },
            {
              label: 'Delete',
              icon: Trash2,
              variant: 'destructive',
              onSelect: () => onDelete(row.original),
            },
          ]}
        />
      </div>
    ),
  },
];
