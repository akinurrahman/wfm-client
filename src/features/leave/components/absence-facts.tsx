import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';

import type { PlannedAbsence } from '../definitions/planned-absence.types';

/** The request a drawer is about to act on, restated inside it. The row that
 *  was clicked is behind the sheet by then, and a withdrawal aimed at the wrong
 *  window is not something the reason field can undo. */
export function AbsenceFacts({ absence }: { absence: PlannedAbsence }) {
  const windowLabel = `${formatDate(
    toCalendarDate(absence.startDate),
    'dd MMM yyyy'
  )} to ${formatDate(toCalendarDate(absence.endDate), 'dd MMM yyyy')}`;

  return (
    <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 rounded-lg border border-hairline bg-surface-2 px-3.5 py-2.5">
      {absence.employee ? <Fact label="Employee" value={absence.employee.fullName} /> : null}
      <Fact label="Leave" value={absence.leaveType?.code ?? 'Leave'} />
      <Fact label="Window" value={windowLabel} />
    </dl>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="meta-label text-text-low">{label}</dt>
      <dd data-numeric className="text-[13px] font-medium text-text-hi">
        {value}
      </dd>
    </div>
  );
}
