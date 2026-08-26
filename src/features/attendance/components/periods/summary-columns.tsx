import { formatDuration } from '@/lib/time';
import type { ColumnDef } from '@/systems/table/data-table';

import type { PeriodSummaryRow } from '../../definitions/attendance-period.types';

/** Every count column reads the same way, so they are declared rather than
 *  written out twelve times. */
const COUNT_COLUMNS: { id: keyof PeriodSummaryRow; header: string }[] = [
  { id: 'eligibleDays', header: 'Eligible' },
  { id: 'presentDays', header: 'Present' },
  { id: 'halfDays', header: 'Half' },
  { id: 'absentDays', header: 'Absent' },
  { id: 'paidLeaveDays', header: 'Paid leave' },
  { id: 'unpaidLeaveDays', header: 'Unpaid' },
  { id: 'holidayCount', header: 'Holiday' },
  { id: 'weeklyOffCount', header: 'Weekly off' },
];

export function summaryColumns(): ColumnDef<PeriodSummaryRow>[] {
  return [
    {
      id: 'employee',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="min-w-0">
          <span className="block font-medium text-text-hi">{row.original.employee.fullName}</span>
          <span className="block text-[11px] text-text-low">
            <span data-numeric className="font-mono tracking-wide">
              {row.original.employee.employeeId}
            </span>
            {row.original.employee.designation ? ` · ${row.original.employee.designation}` : null}
          </span>
        </div>
      ),
    },

    {
      id: 'workingDays',
      header: 'Working',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span
          data-numeric
          className="text-text-mid"
          title="Derived, not stored: eligible days less weekly offs and holidays."
        >
          {row.original.eligibleDays - row.original.weeklyOffCount - row.original.holidayCount}
        </span>
      ),
    },

    ...COUNT_COLUMNS.map<ColumnDef<PeriodSummaryRow>>(column => ({
      id: column.id,
      header: column.header,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span data-numeric className="text-text-mid">
          {row.original[column.id] as number}
        </span>
      ),
    })),

    {
      id: 'totalWorkedMinutes',
      header: 'Worked',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span data-numeric className="whitespace-nowrap text-text-hi">
          {formatDuration(row.original.totalWorkedMinutes)}
        </span>
      ),
    },

    {
      id: 'overtime',
      header: 'Overtime',
      meta: { align: 'right' },
      cell: ({ row }) => {
        const total =
          row.original.normalOvertimeMinutes +
          row.original.holidayOvertimeMinutes +
          row.original.weeklyOffOvertimeMinutes;

        return (
          <span
            data-numeric
            className="whitespace-nowrap text-text-mid"
            title={`Normal ${formatDuration(row.original.normalOvertimeMinutes)}, holiday ${formatDuration(row.original.holidayOvertimeMinutes)}, weekly off ${formatDuration(row.original.weeklyOffOvertimeMinutes)}`}
          >
            {formatDuration(total)}
          </span>
        );
      },
    },
  ];
}
