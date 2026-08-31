import { CircleCheck, CircleDashed, Clock, TriangleAlert } from 'lucide-react';

import type { AdminAttendance, AdminHeadcount } from '../../definitions/admin-dashboard.types';
import { StatGrid, StatTile } from '../stat-tile';

type Props = {
  attendance: AdminAttendance;
  headcount: AdminHeadcount;
  isFuture: boolean;
};

/** The four figures the screen is opened for, kept above everything else so the
 *  day answers itself before anyone scrolls. */
export function AdminDayStats({ attendance, headcount, isFuture }: Props) {
  const decided = headcount.onRolls ? Math.round((attendance.marked / headcount.onRolls) * 100) : 0;

  return (
    <StatGrid>
      <StatTile
        label="Not marked"
        value={attendance.notMarked}
        sub={`of ${headcount.onRolls} on rolls`}
        tone={attendance.notMarked ? 'awaiting' : 'settled'}
        icon={attendance.notMarked ? CircleDashed : CircleCheck}
        emphasis
        hint={
          isFuture
            ? 'A future day is unmarked by definition, not by neglect.'
            : 'On rolls for this date less the days somebody has decided.'
        }
      />
      <StatTile
        label="Marked"
        value={attendance.marked}
        sub={`${decided}% of the day`}
        icon={CircleCheck}
        hint="Days somebody or the nightly close has decided."
      />
      <StatTile
        label="Late arrivals"
        value={attendance.lateArrivals}
        sub="on this day"
        icon={Clock}
        hint="Rows with late minutes on this day."
      />
      <StatTile
        label="Conflicts"
        value={attendance.conflicts}
        sub="across the cycle"
        tone={attendance.conflicts ? 'overdue' : undefined}
        icon={TriangleAlert}
        hint="Open across the whole cycle, not just this day. A conflict sits unresolved until somebody opens it."
      />
    </StatGrid>
  );
}
