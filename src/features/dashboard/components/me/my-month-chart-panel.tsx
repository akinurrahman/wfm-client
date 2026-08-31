import { PanelSection } from '@/systems/ui/panel-section';

import type { MyDashboardMonthToDate } from '../../definitions/my-dashboard.types';
import { StatusComposition } from '../status-composition';
import { MyDaysChart } from './my-days-chart';

type Props = {
  monthToDate: MyDashboardMonthToDate;
};

export function MyMonthChartPanel({ monthToDate }: Props) {
  return (
    <PanelSection
      title="Cycle so far"
      description="Counted off your attendance days, not off the locked payroll snapshot, so these are provisional until the cycle is settled."
    >
      <MyDaysChart days={monthToDate.days} />

      <StatusComposition
        counts={monthToDate.byStatus}
        total={monthToDate.markedDays}
        remainderLabel="Undecided"
        caption={`How your ${monthToDate.markedDays} decided ${monthToDate.markedDays === 1 ? 'day' : 'days'} broke down.`}
      />
    </PanelSection>
  );
}
