import { GraduationCap } from 'lucide-react';

import { toEducationFormValues } from '../../definitions/employee-profile.schema';
import type { EducationRecord } from '../../definitions/employee-profile.types';
import { EducationSummary } from './education-summary';
import { ProfileSectionView } from './profile-section-view';

type Props = {
  records: EducationRecord[];
  onEdit?: () => void;
};

export function EducationView({ records, onEdit }: Props) {
  return (
    <ProfileSectionView
      title="Education"
      description="Qualifications on record."
      isEmpty={records.length === 0}
      emptyIcon={GraduationCap}
      emptyTitle="No qualifications recorded"
      emptyDescription="Add what this employee studied, and where."
      onEdit={onEdit}
    >
      <ul className="divide-y divide-hairline">
        {records.map(record => (
          <li key={record.id} className="py-3 first:pt-0 last:pb-0">
            <EducationSummary values={toEducationFormValues(record)} />
          </li>
        ))}
      </ul>
    </ProfileSectionView>
  );
}
