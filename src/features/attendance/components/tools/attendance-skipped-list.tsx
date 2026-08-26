import { toCalendarDate } from '@/lib/time';
import { formatDate } from '@/lib/format';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import { skipReasonLookup } from '../../definitions/attendance-tools.lookup';
import type { DerivationSkip } from '../../definitions/attendance-tools.types';

type Props = {
  skipped: DerivationSkip[];
};

/** Always rendered in full rather than counted. A pass that quietly dropped
 *  forty days is indistinguishable from one that had nothing to do, and only
 *  one of those is fine. */
export function AttendanceSkippedList({ skipped }: Props) {
  if (!skipped.length) {
    return <p className="text-[13px] text-text-mid">Nothing was skipped.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-[13px] text-text-mid">
        <span data-numeric className="font-medium text-text-hi">
          {skipped.length}
        </span>{' '}
        {skipped.length === 1 ? 'day was' : 'days were'} left alone.
      </p>

      <ul className="max-h-64 space-y-1.5 overflow-y-auto">
        {skipped.map((skip, index) => (
          <li
            key={`${skip.employeeId}-${skip.attendanceDate}-${index}`}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-hairline bg-surface-2 px-3 py-2"
          >
            <span data-numeric className="text-[12px] font-medium text-text-hi">
              {formatDate(toCalendarDate(skip.attendanceDate), 'dd MMM yyyy')}
            </span>
            <span className="font-mono text-[11px] tracking-wide text-text-low">
              {skip.employeeId}
            </span>
            <LookupBadge lookup={skipReasonLookup} value={skip.reason} className="ml-auto" />
          </li>
        ))}
      </ul>
    </div>
  );
}
