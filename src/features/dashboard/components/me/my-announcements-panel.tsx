import { Megaphone, Pin } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { formatDate } from '@/lib/format';
import { PanelSection } from '@/systems/ui/panel-section';

import type { MyDashboardAnnouncement } from '../../definitions/my-dashboard.types';

type Props = {
  announcements: MyDashboardAnnouncement[];
};

/** Pinned first, then newest: a pin is somebody saying read this one whatever
 *  the date on it. */
export function MyAnnouncementsPanel({ announcements }: Props) {
  return (
    <PanelSection title="Announcements">
      {announcements.length ? (
        <ul className="divide-y divide-hairline">
          {announcements.map(announcement => (
            <li key={announcement.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start gap-2">
                {announcement.pinned ? (
                  <Pin aria-label="Pinned" className="mt-0.5 size-3.5 shrink-0 text-brand" />
                ) : null}
                <p className="text-[13px] font-medium text-text-hi">{announcement.title}</p>
              </div>

              <p className="mt-1 text-[13px] leading-relaxed text-text-mid">{announcement.body}</p>

              <p data-numeric className="mt-1 text-[12px] text-text-low">
                {announcement.postedBy.fullName} ·{' '}
                {formatDate(announcement.createdAt, 'dd MMM yyyy')}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={Megaphone}
          title="Nothing posted"
          description="Notices from HR appear here."
          className="py-8"
        />
      )}
    </PanelSection>
  );
}
