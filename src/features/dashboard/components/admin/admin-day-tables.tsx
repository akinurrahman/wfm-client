import { attendanceStatusLookup, dayTypeLookup } from '@/features/attendance';
import { PanelSection } from '@/systems/ui/panel-section';

import type { AdminAttendance } from '../../definitions/admin-dashboard.types';
import { CountBreakdown } from '../count-breakdown';

type Props = {
  attendance: AdminAttendance;
};

/** The table view the charts above are paired with. It sits below them because
 *  a reader who wants an exact figure comes looking for it, while the shape of
 *  the day has to be readable at a glance. */
export function AdminDayTables({ attendance }: Props) {
  return (
    <PanelSection
      title="The day in numbers"
      description="Every status and every day type, zero-filled. A missing key would be a bug, not an empty bucket, so the zeroes stay on the page."
    >
      <CountBreakdown lookup={attendanceStatusLookup} counts={attendance.byStatus} />

      <div className="pt-1">
        <div className="mb-3 flex items-center gap-3">
          <h4 className="meta-label text-text-low">Day types</h4>
          <span aria-hidden className="h-px flex-1 bg-hairline" />
        </div>
        <CountBreakdown lookup={dayTypeLookup} counts={attendance.byDayType} />
      </div>
    </PanelSection>
  );
}
