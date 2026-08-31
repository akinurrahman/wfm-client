import { CalendarCheck, Clock, Timer, TrendingUp } from 'lucide-react';

import { formatDate } from '@/lib/format';
import { formatDuration, toCalendarDate } from '@/lib/time';

import type { MyDashboardMonthToDate } from '../../definitions/my-dashboard.types';
import { StatGrid, StatTile } from '../stat-tile';

type Props = {
  monthToDate: MyDashboardMonthToDate;
};

export function MyMonthStats({ monthToDate }: Props) {
  const window = `${formatDate(toCalendarDate(monthToDate.from), 'dd MMM')} to ${formatDate(
    toCalendarDate(monthToDate.to),
    'dd MMM yyyy'
  )}`;

  return (
    <StatGrid>
      <StatTile
        label="Days decided"
        value={monthToDate.markedDays}
        sub="so far this cycle"
        icon={CalendarCheck}
        emphasis
        hint={`Counted over ${window}. Days nobody has decided yet are not in this figure.`}
      />
      <StatTile
        label="Worked"
        value={formatDuration(monthToDate.totals.workedMinutes)}
        sub="this cycle"
        icon={Timer}
        hint={`Counted over ${window}.`}
      />
      <StatTile
        label="Late"
        value={formatDuration(monthToDate.totals.lateMinutes)}
        sub="this cycle"
        tone={monthToDate.totals.lateMinutes ? 'overdue' : undefined}
        icon={Clock}
        hint="Minutes past your shift start, after grace, added up across the cycle."
      />
      <StatTile
        label="Overtime"
        value={formatDuration(monthToDate.totals.overtimeMinutes)}
        sub="this cycle"
        icon={TrendingUp}
        hint={`Counted over ${window}.`}
      />
    </StatGrid>
  );
}
