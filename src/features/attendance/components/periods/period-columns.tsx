import { differenceInCalendarDays, parseISO } from 'date-fns';
import { FileText, Loader2, Lock, LockOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';
import type { ColumnDef } from '@/systems/table/data-table';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import { cycleLabel } from '../../definitions/attendance-monthly.constants';
import { periodStatusLookup } from '../../definitions/attendance-period.lookup';
import type { AttendancePeriod } from '../../definitions/attendance-period.types';

type Args = {
  /** The row a lock is in flight for, so only that row's button spins. */
  lockingId: string | null;
  onLock: (period: AttendancePeriod) => void;
  onUnlock: (period: AttendancePeriod) => void;
  onViewSummary: (period: AttendancePeriod) => void;
};

const spanDays = (period: AttendancePeriod) =>
  differenceInCalendarDays(
    parseISO(toCalendarDate(period.endDate)),
    parseISO(toCalendarDate(period.startDate))
  ) + 1;

export function periodColumns({
  lockingId,
  onLock,
  onUnlock,
  onViewSummary,
}: Args): ColumnDef<AttendancePeriod>[] {
  return [
    {
      id: 'cycle',
      header: 'Cycle',
      cell: ({ row }) => (
        <span className="font-medium text-text-hi">
          {cycleLabel(row.original.year, row.original.month)}
        </span>
      ),
    },

    {
      id: 'window',
      header: 'Window',
      cell: ({ row }) => (
        <div className="min-w-0">
          <span data-numeric className="block text-text-mid">
            {formatDate(toCalendarDate(row.original.startDate), 'dd MMM yyyy')} to{' '}
            {formatDate(toCalendarDate(row.original.endDate), 'dd MMM yyyy')}
          </span>
          <span data-numeric className="block text-[11px] text-text-low">
            {spanDays(row.original)} days
          </span>
        </div>
      ),
    },

    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <LookupBadge lookup={periodStatusLookup} value={row.original.status} />,
    },

    {
      id: 'lockedAt',
      header: 'Locked',
      cell: ({ row }) =>
        row.original.lockedAt ? (
          <span data-numeric className="text-text-mid">
            {formatDate(row.original.lockedAt, 'dd MMM yyyy, HH:mm')}
          </span>
        ) : (
          <span className="text-text-low">-</span>
        ),
    },

    {
      id: 'unlock',
      header: 'Last unlock',
      cell: ({ row }) =>
        row.original.unlockedAt ? (
          <div className="min-w-0 max-w-64">
            <span data-numeric className="block text-[11px] text-text-low">
              {formatDate(row.original.unlockedAt, 'dd MMM yyyy, HH:mm')}
            </span>
            <span className="block truncate text-text-mid" title={row.original.unlockReason ?? ''}>
              {row.original.unlockReason}
            </span>
          </div>
        ) : (
          <span className="text-text-low">-</span>
        ),
    },

    {
      id: 'actions',
      header: '',
      size: 220,
      meta: { align: 'right' },
      cell: ({ row }) => {
        const isLocked = row.original.status === periodStatusLookup.keys.LOCKED;
        const isLocking = lockingId === row.original.id;

        return (
          <div className="flex items-center justify-end gap-1">
            {isLocked ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewSummary(row.original)}
                  className="h-10 sm:h-8"
                >
                  <FileText />
                  Summary
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onUnlock(row.original)}
                  className="h-10 sm:h-8"
                >
                  <LockOpen />
                  Unlock
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={isLocking}
                onClick={() => onLock(row.original)}
                className="h-10 sm:h-8"
              >
                {isLocking ? <Loader2 className="animate-spin" /> : <Lock />}
                {isLocking ? 'Locking' : 'Lock'}
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
