import { Inbox } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { PanelSection } from '@/systems/ui/panel-section';

import type { AdminLeave } from '../../definitions/admin-dashboard.types';
import { AbsenceList } from '../absence-list';

type Props = {
  leave: AdminLeave;
  action?: React.ReactNode;
};

export function AdminLeavePanel({ leave, action }: Props) {
  return (
    <PanelSection
      title="Leave queue"
      description="Requests nobody has answered yet. What has been approved sits on the upcoming strip instead, because that is a staffing question rather than a decision."
      action={action}
    >
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <Figure label="Pending" value={leave.pendingRequests} />
        <Figure label="On leave this day" value={leave.onLeaveToday} />
      </div>

      {leave.oldestPending.length ? (
        <section>
          <div className="mb-2 flex items-center gap-3">
            <h4 className="meta-label text-text-low">Waiting longest</h4>
            <span aria-hidden className="h-px flex-1 bg-hairline" />
          </div>
          <AbsenceList absences={leave.oldestPending} showWaiting />
        </section>
      ) : (
        <EmptyState
          icon={Inbox}
          title="Nothing pending"
          description="Every request has been answered."
          className="py-8"
        />
      )}
    </PanelSection>
  );
}

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="meta-label text-text-low">{label}</span>
      <span data-numeric className="text-[18px] font-medium text-text-hi">
        {value}
      </span>
    </span>
  );
}
