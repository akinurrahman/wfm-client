import { attendanceStatusLookup, dayTypeLookup } from '@/features/attendance';
import { formatDuration } from '@/lib/time';
import { PanelSection } from '@/systems/ui/panel-section';

import type { MyDashboardMonthToDate } from '../../definitions/my-dashboard.types';
import { CountBreakdown } from '../count-breakdown';

type Props = {
  monthToDate: MyDashboardMonthToDate;
};

/** The table view behind the cycle charts. Below them because the shape of the
 *  month is the glance, and the exact counts are what you come back for. */
export function MyMonthTablesPanel({ monthToDate }: Props) {
  return (
    <PanelSection
      title="The cycle in numbers"
      description="Every status and every day type, zero-filled."
    >
      <CountBreakdown lookup={attendanceStatusLookup} counts={monthToDate.byStatus} />

      <div className="pt-1">
        <div className="mb-3 flex items-center gap-3">
          <h4 className="meta-label text-text-low">Day types</h4>
          <span aria-hidden className="h-px flex-1 bg-hairline" />
        </div>
        <CountBreakdown lookup={dayTypeLookup} counts={monthToDate.byDayType} />
      </div>

      <p className="text-[12px] text-text-low">
        Early exit totals{' '}
        <span data-numeric>{formatDuration(monthToDate.totals.earlyExitMinutes)}</span> over the
        same window. Days nobody has decided yet are counted nowhere above.
      </p>
    </PanelSection>
  );
}
