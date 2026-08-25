import { Building2 } from 'lucide-react';

import { toEmploymentHistoryFormValues } from '../../definitions/employee-profile.schema';
import type { EmploymentHistory } from '../../definitions/employee-profile.types';
import { EmploymentSummary } from './employment-summary';
import { ProfileSectionView } from './profile-section-view';

type Props = {
  records: EmploymentHistory[];
  onEdit: () => void;
};

export function EmploymentHistoryView({ records, onEdit }: Props) {
  return (
    <ProfileSectionView
      title="Employment history"
      description="Where this employee worked before joining."
      isEmpty={records.length === 0}
      emptyIcon={Building2}
      emptyTitle="No previous roles recorded"
      emptyDescription="Add the jobs held before this one."
      onEdit={onEdit}
    >
      <ul className="divide-y divide-hairline">
        {records.map(record => (
          <li key={record.id} className="py-3 first:pt-0 last:pb-0">
            <EmploymentSummary values={toEmploymentHistoryFormValues(record)} />
          </li>
        ))}
      </ul>
    </ProfileSectionView>
  );
}
