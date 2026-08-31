import { UserCheck, UserMinus, UserPlus, Users } from 'lucide-react';

import type { AdminHeadcount } from '../../definitions/admin-dashboard.types';
import { StatGrid, StatTile } from '../stat-tile';

type Props = {
  headcount: AdminHeadcount;
  /** True when the board is describing today, which is the only day on which
   *  the on-rolls count and the active flag are answering the same question. */
  isToday: boolean;
};

export function AdminHeadcountPanel({ headcount, isToday }: Props) {
  return (
    <StatGrid>
      <StatTile
        label="On rolls"
        value={headcount.onRolls}
        sub="on this date"
        icon={Users}
        hint="Counted for this date: joiners from their joining date, leavers through their last working day."
      />
      <StatTile
        label="Active now"
        value={headcount.activeNow}
        sub={isToday ? 'same as on rolls' : 'today, not this date'}
        icon={UserCheck}
        hint={
          isToday
            ? 'The active flag, which only ever answers for today.'
            : 'The active flag answers for today, not for the date shown, so these two differ on purpose.'
        }
      />
      <StatTile
        label="Joined"
        value={headcount.joinedThisCycle}
        sub="this cycle"
        icon={UserPlus}
        hint="Joined between the cycle start and this date."
      />
      <StatTile
        label="Exited"
        value={headcount.exitedThisCycle}
        sub="this cycle"
        icon={UserMinus}
        hint="Last working day inside the same window."
      />
    </StatGrid>
  );
}
