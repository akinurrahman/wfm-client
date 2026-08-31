import { CalendarOff, History } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { PanelSection } from '@/systems/ui/panel-section';

import type { MyDashboardLeave } from '../../definitions/my-dashboard.types';
import { AbsenceList } from '../absence-list';

type Props = {
  leave: MyDashboardLeave;
  upcomingDays: number;
  action?: React.ReactNode;
};

export function MyLeavePanel({ leave, upcomingDays, action }: Props) {
  return (
    <PanelSection
      title="Leave"
      description="Applied and approved sit in the same strip on purpose. Read the badge for which one a row is."
      action={action}
    >
      <div className="flex items-baseline gap-1.5">
        <span className="meta-label text-text-low">Awaiting an answer</span>
        <span data-numeric className="text-[18px] font-medium text-text-hi">
          {leave.pendingRequests}
        </span>
      </div>

      <Group title={`Starting in the next ${upcomingDays} days`}>
        {leave.upcoming.length ? (
          <AbsenceList absences={leave.upcoming} />
        ) : (
          <EmptyState
            icon={CalendarOff}
            title="Nothing booked in the window"
            description="Widen the look-ahead, or apply from the leave screen."
            className="py-8"
          />
        )}
      </Group>

      <Group title="Recently filed">
        {leave.recent.length ? (
          <AbsenceList absences={leave.recent} />
        ) : (
          <EmptyState
            icon={History}
            title="No requests yet"
            description="Anything you apply for shows up here, whatever it is answered with."
            className="py-8"
          />
        )}
      </Group>
    </PanelSection>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-3">
        <h4 className="meta-label text-text-low">{title}</h4>
        <span aria-hidden className="h-px flex-1 bg-hairline" />
      </div>
      {children}
    </section>
  );
}
