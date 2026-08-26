import { useState } from 'react';

import { ArrowRight, History } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import { formatDuration, instantToClock } from '@/lib/time';
import { DataTablePagination } from '@/systems/table/data-table-pagination';

import { useAttendanceAudit } from '../../api/attendance.queries';
import type {
  AttendanceAuditEntry,
  AttendanceAuditSnapshot,
  RosterRow,
} from '../../definitions/attendance.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: RosterRow | null;
};

const FIELD_LABELS: Record<keyof AttendanceAuditSnapshot, string> = {
  dayType: 'Day type',
  status: 'Status',
  source: 'Source',
  checkIn: 'Check in',
  checkOut: 'Check out',
  workedMinutes: 'Worked',
  lateMinutes: 'Late',
  earlyExitMinutes: 'Early exit',
  overtimeMinutes: 'Overtime',
  compensationType: 'Compensation',
  hasConflict: 'Conflict',
  conflictNote: 'Conflict note',
  remark: 'Remark',
  shiftId: 'Shift',
  plannedAbsenceId: 'Planned absence',
};

const MINUTE_FIELDS = new Set([
  'workedMinutes',
  'lateMinutes',
  'earlyExitMinutes',
  'overtimeMinutes',
]);

const INSTANT_FIELDS = new Set(['checkIn', 'checkOut']);

function renderValue(field: string, value: unknown) {
  if (value === null || value === undefined || value === '') return 'empty';
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  if (MINUTE_FIELDS.has(field)) return formatDuration(Number(value));
  if (INSTANT_FIELDS.has(field)) return instantToClock(String(value)) ?? 'empty';
  return String(value);
}

/** The keys present in either snapshot whose values actually moved. A creation
 *  arrives with an empty `before`, so every key in `after` shows as a change,
 *  which is the correct reading of it. */
function changedFields(entry: AttendanceAuditEntry) {
  const keys = new Set([...Object.keys(entry.before), ...Object.keys(entry.after)]);

  return [...keys]
    .filter(key => {
      const before = entry.before[key as keyof AttendanceAuditSnapshot];
      const after = entry.after[key as keyof AttendanceAuditSnapshot];
      return before !== after;
    })
    .map(key => ({
      key,
      label: FIELD_LABELS[key as keyof AttendanceAuditSnapshot] ?? key,
      before: renderValue(key, entry.before[key as keyof AttendanceAuditSnapshot]),
      after: renderValue(key, entry.after[key as keyof AttendanceAuditSnapshot]),
    }));
}

export function AttendanceAuditSheet({ open, onOpenChange, row }: Props) {
  const [page, setPage] = useState(1);
  const attendanceId = row?.attendance?.id ?? null;

  const { data, isLoading, isError, refetch } = useAttendanceAudit(open ? attendanceId : null, page);
  const entries = data?.data ?? [];

  return (
    <Sheet
      open={open}
      onOpenChange={next => {
        // Reopening on a different row must start at the newest entry, not
        // wherever the last row was left paged to.
        if (!next) setPage(1);
        onOpenChange(next);
      }}
    >
      <SheetContent className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-hairline p-5">
          <SheetTitle className="font-serif text-lg leading-tight text-text-hi">
            {row ? `History for ${row.employee.fullName}` : 'History'}
          </SheetTitle>
          <SheetDescription className="text-[13px] leading-relaxed text-text-mid">
            Every change to this day, newest first. A change with no author was made by the nightly
            close job.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {isError ? (
            <ErrorState onRetry={refetch} />
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : entries.length ? (
            <ol className="space-y-3">
              {entries.map(entry => (
                <AuditEntry key={entry.id} entry={entry} />
              ))}
            </ol>
          ) : (
            <EmptyState
              icon={History}
              title="No changes recorded"
              description="This row exists but nothing has edited it since it was created."
            />
          )}
        </div>

        {data?.pagination ? (
          <DataTablePagination pagination={data.pagination} onPageChange={setPage} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function AuditEntry({ entry }: { entry: AttendanceAuditEntry }) {
  const fields = changedFields(entry);
  const isCreation = Object.keys(entry.before).length === 0;

  return (
    <li className="rounded-lg border border-hairline bg-surface-2 px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span data-numeric className="text-[13px] font-medium text-text-hi">
          {formatDate(entry.changedAt, 'dd MMM yyyy, HH:mm')}
        </span>
        <Badge variant={isCreation ? 'default' : 'secondary'}>
          {isCreation ? 'Created' : 'Edited'}
        </Badge>
        {entry.changedById ? null : (
          <Badge variant="outline" title="Written by the nightly close job">
            System
          </Badge>
        )}
      </div>

      {entry.remark ? (
        <p className="mt-2 text-[12px] leading-relaxed text-text-mid">{entry.remark}</p>
      ) : null}

      {fields.length ? (
        <dl className="mt-2.5 space-y-1">
          {fields.map(field => (
            <div key={field.key} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <dt className="font-mono text-[10px] tracking-[0.14em] text-text-low uppercase">
                {field.label}
              </dt>
              <dd className="flex items-center gap-1.5 text-[12px] text-text-mid">
                <span className="line-through decoration-text-low">{field.before}</span>
                <ArrowRight aria-hidden className="size-3 text-text-low" />
                <span className="font-medium text-text-hi">{field.after}</span>
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </li>
  );
}
