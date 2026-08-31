import { CalendarDays } from 'lucide-react';

import { PanelSection } from '@/systems/ui/panel-section';

import type { AdminAttendance, AdminHeadcount } from '../../definitions/admin-dashboard.types';
import type { DashboardHoliday } from '../../definitions/dashboard.types';
import { StatusComposition } from '../status-composition';

type Props = {
  attendance: AdminAttendance;
  headcount: AdminHeadcount;
  holidayToday: DashboardHoliday | null;
  /** The link out to the roster, which is the screen that can act on any of
   *  this. Passed in because a component does not know its own routes. */
  action?: React.ReactNode;
};

/** The picture of the day, kept free of the tables that restate it: those sit
 *  lower down, where a reader who wants the exact figures goes looking. */
export function AdminDayPanel({ attendance, headcount, holidayToday, action }: Props) {
  const decided = headcount.onRolls ? Math.round((attendance.marked / headcount.onRolls) * 100) : 0;

  return (
    <PanelSection
      title="How the day reads"
      description="A status is a decision somebody or the nightly close has made. Days nobody has decided yet are not absences."
      action={action}
    >
      <StatusComposition
        counts={attendance.byStatus}
        total={headcount.onRolls}
        remainderLabel="Not marked"
        caption={`${attendance.marked} of ${headcount.onRolls} on rolls decided, ${decided}% of the day.`}
      />

      {holidayToday ? (
        <p className="flex items-start gap-2 rounded-lg border border-hairline bg-surface-2 px-3.5 py-3 text-[13px] text-text-mid">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-text-low" />
          <span>
            <span className="font-medium text-text-hi">{holidayToday.names.join(', ')}</span>
            {holidayToday.isOptional ? ' is an optional holiday' : ' is a holiday'} on this date.
          </span>
        </p>
      ) : null}
    </PanelSection>
  );
}
